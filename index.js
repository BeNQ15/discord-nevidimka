// mega_slash_bot/index.js — улучшенная обработка интеракций с /ticket и /minecraft

import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const minecraftProgress = new Map();

app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  // PING от Discord
  if (interaction.type === 1) return res.send({ type: 1 });

  // Обработка команды
  if (interaction.type !== 2) {
    return res.send({
      type: 4,
      data: { content: '❌ Неизвестный тип взаимодействия' }
    });
  }

  const name = interaction.data.name;
  const options = interaction.data.options || [];
  const getOption = (key) => options.find(opt => opt.name === key)?.value;
  const reply = (content) => res.send({ type: 4, data: { content } });

  // 🧱 /minecraft — пошаговая игра
  if (name === 'minecraft') {
    const action = getOption('действие');
    const userId = interaction.member.user.id;
    const state = minecraftProgress.get(userId) || [];

    const steps = [
      'исследовать мир',
      'копать',
      'добыть еду',
      'найти ведро лавы',
      'найти ведро воды',
      'соединить лаву и воду',
      'отправиться в ад',
      'уничтожить блейзов',
      'скрафтить око эндера',
      'вернуться в обычный мир',
      'найти с око портал',
      'активировать его',
      'уничтожить кристаллы энда',
      'победа дракона',
      'получение опыта'
    ];

    const currentStep = state.length;
    if (action === steps[currentStep]) {
      state.push(action);
      minecraftProgress.set(userId, state);

      if (state.length === steps.length) {
        return reply('🏆 Поздравляем! Вы победили дракона и прошли игру Minecraft!');
      } else {
        return reply(`✅ Шаг выполнен: **${action}**. Следующий шаг: **${steps[currentStep + 1]}**`);
      }
    } else {
      return reply(`⚠️ Сейчас нужно выполнить шаг: **${steps[currentStep]}**`);
    }
  }

  // 🎱 /8ball — рандомный ответ
  if (name === '8ball') {
    const question = getOption('text');
    const answers = [
      '🎱 Да',
      '🎱 Нет',
      '🎱 Возможно',
      '🎱 Определённо да',
      '🎱 Определённо нет',
      '🎱 Спроси позже',
      '🎱 Без сомнений',
      '🎱 Лучше не знать ответа 😅'
    ];
    const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
    return reply(`**Вопрос:** ${question}\n**Ответ:** ${randomAnswer}`);
  }

  return reply('❌ Неизвестная команда');
});

app.get('/', (_, res) => {
  res.send('✅ Бот работает. Пинг живой.');
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

