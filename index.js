import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const minecraftProgress = new Map();
const treeGrowStage = new Map();

app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === 1) return res.send({ type: 1 });
  if (interaction.type !== 2) return res.send({ type: 4, data: { content: '❌ Неизвестный тип взаимодействия' } });

  const name = interaction.data.name;
  const options = interaction.data.options || [];
  const getOption = (key) => options.find(opt => opt.name === key)?.value;
  const reply = (content) => res.send({ type: 4, data: { content } });

  if (name === 'minecraft') {
    const action = getOption('действие');
    const userId = interaction.member.user.id;
    const state = minecraftProgress.get(userId) || [];
    const steps = [
      'исследовать мир', 'копать', 'добыть еду', 'найти ведро лавы', 'найти ведро воды',
      'соединить лаву и воду', 'отправиться в ад', 'уничтожить блейзов', 'скрафтить око эндера',
      'вернуться в обычный мир', 'найти с око портал', 'активировать его',
      'уничтожить кристаллы энда', 'победа дракона', 'получение опыта'
    ];

    const currentStep = state.length;
    if (action === steps[currentStep]) {
      state.push(action);
      minecraftProgress.set(userId, state);
      return reply(state.length === steps.length ? '🏆 Победа над драконом!' : `✅ ${action} выполнено. Следующее: ${steps[currentStep + 1]}`);
    } else {
      return reply(`⚠️ Сейчас нужно выполнить шаг: **${steps[currentStep]}**`);
    }
  }

  if (name === '8ball') {
    const question = getOption('text');
    const answers = ['🎱 Да', '🎱 Нет', '🎱 Возможно', '🎱 Определённо да', '🎱 Определённо нет', '🎱 Спроси позже', '🎱 Без сомнений', '🎱 Лучше не знать 😅'];
    return reply(`**Вопрос:** ${question}\n**Ответ:** ${answers[Math.floor(Math.random() * answers.length)]}`);
  }

  if (name === 'tea') {
    const ingredients = options.map(o => o.value).join(', ');
    return reply(`🍵 Вы заварили чай с: ${ingredients}`);
  }

  if (name === 'namefusion') {
    const name1 = getOption('name1');
    const name2 = getOption('name2');
    const fusion = name1.slice(0, Math.ceil(name1.length / 2)) + name2.slice(Math.floor(name2.length / 2));
    return reply(`🧬 Получилось имя: **${fusion}**`);
  }

  if (name === 'treegrow') {
    const userId = interaction.member.user.id;
    const stage = (treeGrowStage.get(userId) || 0) + 1;
    treeGrowStage.set(userId, stage);
    const emojis = ['🌱', '🌿', '🌳'];
    return reply(`🌳 Этап роста: ${emojis[Math.min(stage - 1, 2)]}`);
  }

  return reply('❌ Неизвестная команда');
});

app.get('/', (_, res) => res.send('✅ Бот работает.')); 

app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
