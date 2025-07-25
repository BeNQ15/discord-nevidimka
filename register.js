// register.js — обновлённый список слэш-команд для Discord REST API

import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  {
    name: 'chat',
    description: '💬 Отправить сообщение в чат',
    options: [
      {
        type: 3,
        name: 'message',
        description: 'Сообщение для отправки',
        required: true
      }
    ]
  },
  {
    name: 'ticket',
    description: '🎫 Создать тикет для поддержки',
    options: [
      {
        type: 3,
        name: 'тема',
        description: 'Опишите проблему',
        required: true
      }
    ]
  },
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
    description: '🎱 Получить ответ от магического шара'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('⏳ Регистрируем слэш-команды...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Команды успешно зарегистрированы');
  } catch (error) {
    console.error('❌ Ошибка при регистрации:', error);
  }
})();
