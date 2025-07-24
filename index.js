import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
  (req, res) => {
    const interaction = req.body;

    // PING от Discord
    if (interaction.type === 1) {
      return res.send({ type: 1 });
    }

    // SLASH-команды
    if (interaction.type === 2) {
      const { name, options } = interaction.data;

      if (name === 'chat') {
        const message = options.find(opt => opt.name === 'message')?.value;
        return res.send({
          type: 4,
          data: {
            content: `💬 Вы сказали: ${message}`
          }
        });
      }

      if (name === 'rules') {
        return res.send({
          type: 4,
          data: {
            content: `📜 **Правила сервера:**\n1. Не нарушай ToS\n2. Не спамь\n3. Будь вежлив`
          }
        });
      }

      if (name === 'help') {
        return res.send({
          type: 4,
          data: {
            content: `🛠 **Справка:**\n• /chat <сообщение>\n• /rules\n• /help\n• /ticket <тема>\n• /game <действие>`
          }
        });
      }

      if (name === 'ticket') {
        const тема = options.find(opt => opt.name === 'тема')?.value;
        return res.send({
          type: 4,
          data: {
            content: `🎫 Тикет создан: **${тема}**\nОжидайте ответа модерации.`
          }
        });
      }

      if (name === 'game') {
        const действие = options.find(opt => opt.name === 'действие')?.value.toLowerCase();
        let reply = '🤷 Неизвестное действие.';

        if (действие.includes('идти')) reply = '🚶 Вы идёте вперёд по тропе.';
        else if (действие.includes('осмотреться')) reply = '🔍 Вы осмотрелись вокруг.';
        else if (действие.includes('взять')) reply = '🎒 Вы подобрали предмет.';

        return res.send({
          type: 4,
          data: { content: reply }
        });
      }

      // Если команда не найдена
      return res.send({
        type: 4,
        data: { content: '❌ Неизвестная команда' }
      });
    }
  }
);

// Тестовый GET
app.get('/', (_, res) => {
  res.send('✅ Бот работает!');
});

app.listen(PORT, () => {
  console.log(`⚡ Сервер запущен на порту ${PORT}`);
});
