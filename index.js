import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware
} from "discord-interactions";

const app = express();

const PUBLIC_KEY = process.env.PUBLIC_KEY;

app.post("/interactions", verifyKeyMiddleware(PUBLIC_KEY), (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const name = interaction.data.name;
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `Команда: ${name} выполнена ✅` }
    });
  }
});

app.listen(10000, () => console.log("Interactions server running!"));
