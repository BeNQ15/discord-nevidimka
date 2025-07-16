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


import express from 'express';
import { InteractionType, verifyKeyMiddleware } from 'discord-interactions';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({
  verify: verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY)
}));

app.post('/interactions', (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.PING) {
    return res.send({ type: 1 });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === 'hello') {
      return res.send({
        type: 4,
        data: {
          content: `Привет, ${interaction.member.user.username}!`
        }
      });
    }
  }

  res.status(400).send('Unhandled interaction');
});

app.get('/', (req, res) => {
  res.send('Бот работает!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
