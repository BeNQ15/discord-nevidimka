import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'hello',
    description: 'Приветствие',
    type: 1
  }
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  try {
    console.log('Регистрируем команды...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Команды успешно зарегистрированы');
  } catch (error) {
    console.error('Ошибка при регистрации команд:', error);
  }
}

registerCommands(); // Вызываем при запуске
