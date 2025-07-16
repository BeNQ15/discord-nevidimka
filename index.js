import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ ВАЖНО: middleware ТОЛЬКО для /interactions
app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
  (req, res) => {
    const interaction = req.body;

    // Примеры обработки
    if (interaction.type === 1) {
      return res.send({ type: 1 }); // Pong
    }

    if (interaction.type === 2 && interaction.data.name === 'hello') {
      return res.send({
        type: 4,
        data: {
          content: 'Привет!'
        }
      });
    }

    res.status(400).send('Unhandled interaction type');
  }
);

// ✅ НЕ подключаем express.json() вообще или делаем это после
// app.use(express.json()); ← ⚠️ Удалить или перенести в другой endpoint

app.get('/', (req, res) => {
  res.send('Бот живой!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
