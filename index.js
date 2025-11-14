import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";

const app = express();
const PORT = process.env.PORT || 3000;

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async (req, res) => {
    const interaction = req.body;

    // Ping от Discord при проверке
    if (interaction.type === 1) {
      return res.send({ type: 1 });
    }

    // Slash-команда /ping
    if (
      interaction.type === 2 &&
      interaction.data.name === "ping"
    ) {
      const latency = Date.now() - Date.parse(interaction.id / 4194304 + 1420070400000);

      return res.send({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: `🏓 Pong! Latency: **${latency} ms**`
        }
      });
    }
  }
);

app.listen(PORT, () => console.log("Started on " + PORT));
