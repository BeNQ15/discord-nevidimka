import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY),
  async (req, res) => {
    const interaction = req.body;

    // PING
    if (interaction.type === 1) {
      return res.send({ type: 1 }); // PONG
    }

    // SLASH command
    if (interaction.type === 2) {
      const { name, options } = interaction.data;

      // /chat
      if (name === "chat") {
        const message = options.find(o => o.name === "message")?.value;
        return res.send({
          type: 4,
          data: {
            content: `🗨️ Вы сказали: "${message}"`
          }
        });
      }

      // /rules
      if (name === "rules") {
        return res.send({
          type: 4,
          data: {
            content: "**📜 Правила сервера:**\n1. Будь вежлив\n2. Не спамь\n3. Соблюдай Discord ToS"
          }
        });
      }

      // /help
      if (name === "help") {
        return res.send({
          type: 4,
          data: {
            content:
              "**🛠️ Доступные команды:**\n" +
              "`/chat <сообщение>` — симулированный чат\n" +
              "`/rules` — правила\n" +
              "`/ticket <тема>` — создать тикет\n" +
              "`/game <действие>` — текстовая игра\n" +
              "`/help` — эта справка"
          }
        });
      }

      // /ticket
      if (name === "ticket") {
        const тема = options.find(o => o.name === "тема")?.value;
        return res.send({
          type: 4,
          data: {
            content: `🎫 Тикет создан!\nТема: **${тема}**\nМодератор свяжется с вами.`
          }
        });
      }

      // /game
      if (name === "game") {
        const действие = options.find(o => o.name === "действие")?.value.toLowerCase();

        let response = "🤷 Неизвестное действие.";
        if (действие.includes("идти")) {
          response = "🚶 Вы идёте по тёмному лесу...";
        } else if (действие.includes("осмотреться")) {
          response = "👀 Вы осмотрелись и заметили сундук.";
        } else if (действие.includes("взять")) {
          response = "📦 Вы взяли предмет!";
        }

        return res.send({
          type: 4,
          data: { content: response }
        });
      }

      // Если не распознано
      return res.send({
        type: 4,
        data: { content: "❌ Неизвестная команда" }
      });
    }
  }
);

// тестовая страница
app.get("/", (req, res) => {
  res.send("👋 Бот живой!");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
