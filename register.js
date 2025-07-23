import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const commands = [
  new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Открыть чат или сымитировать разговор')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Сообщение, которое вы хотите отправить в чат')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Показать правила сервера'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Показать список доступных команд'),

  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Создать тикет для поддержки')
    .addStringOption(option =>
      option.setName('тема')
        .setDescription('Опишите проблему')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('game')
    .setDescription('Запустить текстовую игру')
    .addStringOption(option =>
      option.setName('действие')
        .setDescription('Введите ваше действие (например: идти, осмотреться)')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('🚀 Обновляем (ре) регистрацию слэш-команд...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Команды успешно обновлены.');
  } catch (error) {
    console.error('❌ Ошибка при регистрации:', error);
  }
})();
