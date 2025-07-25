// register.js — модерационные + игровые команды с ограничением прав

import { REST, Routes, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  {
    name: 'purge',
    description: '🧹 Удалить сообщения пользователя (только для админов)',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: 'пользователь',
        description: 'Кого чистить?',
        type: 6, // USER
        required: true
      },
      {
        name: 'количество',
        description: 'Сколько сообщений удалить (до 100)?',
        type: 4, // INTEGER
        required: true
      }
    ]
  },
  {
    name: 'ams',
    description: '⚙️ Добавить правило автомода (только для админов)',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: 'название',
        description: 'Название правила',
        type: 3,
        required: true
      },
      {
        name: 'тип',
        description: 'Тип автомода',
        type: 3,
        required: true,
        choices: [
          { name: 'delete-ping-here', value: 'delete_ping_here' },
          { name: 'delete-ping-everyone', value: 'delete_ping_everyone' },
          { name: 'delete-ping-user', value: 'delete_ping_user' },
          { name: 'count', value: 'count' },
          { name: 'flood', value: 'flood' }
        ]
      }
    ]
  },
  {
    name: 'amsd',
    description: '🗑️ Удалить правило автомода (только для админов)',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
    options: [
      {
        name: 'название',
        description: 'Имя правила, которое удалить',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'minecraft',
    description: '🧱 Играть в текстовый Minecraft',
    options: [
      {
        name: 'действие',
        description: 'Выберите действие',
        type: 3,
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
    console.log('⏳ Регистрируем все слэш-команды...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );
    console.log('✅ Все команды успешно зарегистрированы');
  } catch (error) {
    console.error('❌ Ошибка при регистрации:', error);
  }
})();
