// index.js — Express + interactions + авто-регистрация слэшей
import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const {
  PUBLIC_KEY, // для verifyKeyMiddleware
  BOT_TOKEN,          // для авто-регистрации (если есть)
  ID,
  GUILD_ID,
  PORT = 3000
} = process.env;

const app = express();
app.use(express.json());

// ------------------ Команды (используются и для регистрации) ------------------
const COMMANDS = [
  {
    name: 'minecraft',
    description: '🧱 Играть в текстовый Minecraft',
    options: [
      {
        type: 3,
        name: 'действие',
        description: 'Выберите действие',
        required: true,
        choices: [
          { name: 'исследовать мир', value: 'исследовать мир' },
          { name: 'копать', value: 'копать' },
          { name: 'добыть еду', value: 'добыть еду' },
          { name: 'найти ведро лавы', value: 'найти ведро лавы' },
          { name: 'найти ведро воды', value: 'найти ведро воды' },
          { name: 'соединить лаву и воду', value: 'соединить лаву и воду' },
          { name: 'отправиться в ад', value: 'отправиться в ад' },
          { name: 'уничтожить блейзов', value: 'уничтожить блейзов' },
          { name: 'скрафтить око эндера', value: 'скрафтить око эндера' },
          { name: 'вернуться в обычный мир', value: 'вернуться в обычный мир' },
          { name: 'найти с око портал', value: 'найти с око портал' },
          { name: 'активировать его', value: 'активировать его' },
          { name: 'уничтожить кристаллы энда', value: 'уничтожить кристаллы энда' },
          { name: 'победа дракона', value: 'победа дракона' },
          { name: 'получение опыта', value: 'получение опыта' }
        ]
      }
    ]
  },
  {
    name: '8ball',
    description: '🎱 Получить ответ от магического шара',
    options: [
      {
        type: 3,
        name: 'text',
        description: 'Задайте вопрос шару',
        required: true
      }
    ]
  },
  {
    name: 'tea',
    description: '🍵 Завари чай — укажи 1–2 ингредиента',
    options: [
      { type: 3, name: 'ингредиент1', description: 'Первый ингредиент', required: true },
      { type: 3, name: 'ингредиент2', description: 'Второй ингредиент (необязательно)', required: false }
    ]
  },
  {
    name: 'namefusion',
    description: '🔤 Слияние двух имён в новое',
    options: [
      { type: 3, name: 'name1', description: 'Первое имя', required: true },
      { type: 3, name: 'name2', description: 'Второе имя', required: true }
    ]
  },
  {
    name: 'treegrow',
    description: '🌳 Поливай дерево — прогресс сохраняется'
  }
];

// ------------------ Внутренняя память (заменяем на БД по желанию) ------------------
const minecraftProgress = new Map(); // userId -> [steps_done]
const treeGrowStage = new Map();     // userId -> stage (0..n)

// ------------------ Авто-регистрация слэшей (если есть BOT_TOKEN и CLIENT_ID/GUILD_ID) ------------------
async function registerSlashCommands() {
  if (!BOT_TOKEN || !ID || !GUILD_ID) {
    console.log('⚠️ Пропущена регистрация слэшей: BOT_TOKEN/ID/GUILD_ID не заданы в .env');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

  try {
    console.log('⏳ Регистрируем слэш-команды (guild scope)...');
    await rest.put(
      Routes.applicationGuildCommands(ID, GUILD_ID),
      { body: COMMANDS }
    );
    console.log('✅ Слэш-команды зарегистрированы (guild).');
  } catch (err) {
    console.error('❌ Ошибка регистрации слэшей:', err);
  }
}

// запускаем регистрацию асинхронно (не блокируя основной сервер)
registerSlashCommands().catch(console.error);

// ------------------ Helpers ------------------
const getOption = (options, name) => {
  if (!options) return undefined;
  const opt = options.find(o => o.name === name);
  return opt ? opt.value : undefined;
};

const makeInteractionReply = (res, content, components = undefined, ephemeral = false) => {
  const data = { content: String(content) };
  if (components) data.components = components;
  if (ephemeral) data.flags = 64; // ephemeral flag
  return res.send({ type: 4, data });
};

// ------------------ Endpoint для интеракций ------------------
if (!PUBLIC_KEY) {
  console.warn('⚠️ PUBLIC_KEY не задан. verifyKeyMiddleware отключён — небезопасно для продакшна.');
}

// Используем verifyKeyMiddleware если есть PUBLIC_KEY, иначе пропускаем в dev режиме
const interactionsMiddleware = PUBLIC_KEY ? verifyKeyMiddleware(PUBLIC_KEY) : (req, res, next) => next();

app.post('/interactions', interactionsMiddleware, async (req, res) => {
  const interaction = req.body;

  // PING (type 1)
  if (interaction.type === 1) return res.send({ type: 1 });

  // Component interaction (кнопки, select ...) — type 3
  if (interaction.type === 3) {
    const customId = interaction.data.custom_id;
    // пример: можно обрабатывать кнопки вида 'tree_water_{userId}' и т.д.
    // Пока просто ответим коротко
    return makeInteractionReply(res, 'Кнопка нажата (обработка компонентов ещё не настроена).', undefined, true);
  }

  // Application Command (slash) — type 2
  if (interaction.type === 2) {
    const name = interaction.data.name;
    const options = interaction.data.options || [];

    try {
      // ---------- /minecraft ----------
      if (name === 'minecraft') {
        const action = getOption(options, 'действие');
        const userId = interaction.member?.user?.id || interaction.user?.id;
        if (!userId) return makeInteractionReply(res, '❌ Не удалось определить пользователя.');

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

        const state = minecraftProgress.get(userId) || [];
        const currentStep = state.length;

        if (action === steps[currentStep]) {
          state.push(action);
          minecraftProgress.set(userId, state);

          if (state.length === steps.length) {
            // закончено — сбрасываем прогресс (или можно хранить как пройдено)
            minecraftProgress.set(userId, []);
            return makeInteractionReply(res, '🏆 Поздравляем! Вы победили дракона и прошли Minecraft!');
          } else {
            return makeInteractionReply(res, `✅ Шаг выполнен: **${action}**. Следующий шаг: **${steps[currentStep + 1]}**`);
          }
        } else {
          return makeInteractionReply(res, `⚠️ Сейчас нужно выполнить шаг: **${steps[currentStep]}**`);
        }
      }

      // ---------- /8ball ----------
      if (name === '8ball') {
        const question = getOption(options, 'text') || '(вопрос не задан)';
        const answers = [
          'Без сомнений ✅',
          'Вероятно да 👍',
          'Нет ❌',
          'Спроси позже ⏳',
          'Очень маловероятно...',
          'Знаки указывают на да 🔮',
          'Возможно 🤔',
          'Я не уверен 😶',
          'Попробуй снова позже',
          'Да, но будь осторожен ⚠️'
        ];
        const answer = answers[Math.floor(Math.random() * answers.length)];
        return makeInteractionReply(res, `🎱 **Вопрос:** ${question}\n**Ответ:** ${answer}`);
      }

      // ---------- /tea ----------
      if (name === 'tea') {
        const ingr1 = getOption(options, 'ингредиент1');
        const ingr2 = getOption(options, 'ингредиент2');
        const items = [ingr1, ingr2].filter(Boolean);
        const descriptions = [
          'Отличный выбор, аромат обещает быть насыщенным.',
          'Будь осторожен с молоком — иногда перебивает вкус.',
          'Сахар добавит сладости, но уменьшит сложность букета.',
          'Кипяток — важный элемент для хорошего чая.'
        ];
        const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
        return makeInteractionReply(res, `🍵 Вы заварили чай с: **${items.join(', ') || 'ничего?'}**\n${desc}`);
      }

      // ---------- /namefusion ----------
      if (name === 'namefusion') {
        const n1 = getOption(options, 'name1') || '';
        const n2 = getOption(options, 'name2') || '';
        // простая логика: первая половина n1 + вторая половина n2, с небольшой рандомизацией
        const a = n1.slice(0, Math.ceil(n1.length / 2));
        const b = n2.slice(Math.floor(n2.length / 2));
        const fusion = (a + b).replace(/[^а-яА-Яa-zA-Z0-9_-]/g, '');
        return makeInteractionReply(res, `🧬 Результат слияния: **${fusion || (n1 + n2)}**`);
      }

      // ---------- /treegrow ----------
      if (name === 'treegrow') {
        const userId = interaction.member?.user?.id || interaction.user?.id;
        if (!userId) return makeInteractionReply(res, '❌ Не удалось определить пользователя.');
        const stage = Math.min((treeGrowStage.get(userId) || 0) + 1, 3);
        treeGrowStage.set(userId, stage);
        const emojis = ['🌱', '🌿', '🌳', '🎋'];
        return makeInteractionReply(res, `🌳 Этап роста: ${emojis[stage - 1] || emojis[emojis.length - 1]} (этап ${stage})`);
      }

      // ---------- неизвестная команда ----------
      return makeInteractionReply(res, '❌ Неизвестная команда или она ещё не реализована.');
    } catch (err) {
      console.error('Ошибка обработки интеракции:', err);
      return makeInteractionReply(res, '❌ Внутренняя ошибка при обработке команды.');
    }
  }

  // по умолчанию — неизвестный тип
  return res.send({ type: 4, data: { content: '❌ Неподдерживаемый тип интеракции.' } });
});

// healthcheck (uptime ping)
app.get('/', (_, res) => res.send('✅ Бот (interactions endpoint) работает.'));

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT} (порт ${PORT})`);
});
