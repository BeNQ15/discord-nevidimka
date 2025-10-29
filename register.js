import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const { DISCORD_BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_BOT_TOKEN || !CLIENT_ID) {
  console.error("❌ Ошибка: Не указаны DISCORD_BOT_TOKEN или CLIENT_ID в .env");
  process.exit(1);
}

const commands = [
  {
    name: "minecraft",
    description: "Пошаговое прохождение Minecraft",
    type: 1,
    options: [
      {
        name: "действие",
        description: "Следующий шаг",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "8ball",
    description: "Магический шар отвечает",
    type: 1,
    options: [
      {
        name: "text",
        description: "Ваш вопрос",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "tea",
    description: "Заварите собственный чай",
    type: 1,
    options: [
      { name: "ингредиент1", type: 3, description: "Первый ингредиент", required: true },
      { name: "ингредиент2", type: 3, description: "Второй ингредиент", required: false }
    ],
  },
  {
    name: "namefusion",
    description: "Слияние двух имён",
    type: 1,
    options: [
      { name: "name1", type: 3, description: "Первое имя", required: true },
      { name: "name2", type: 3, description: "Второе имя", required: true },
    ],
  },
  {
    name: "treegrow",
    description: "Полей дерево и смотри, как оно растёт",
    type: 1,
  },
];

// ✅ Хочешь глобально? — просто поставь false
const guildOnly = true;

// ✅ Выбор URL: для сервера или глобально
const url = guildOnly
  ? `https://discord.com/api/v10/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${CLIENT_ID}/commands`;

const headers = {
  "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
  "Content-Type": "application/json",
};

async function registerCommands() {
  console.log("🚀 Регистрирую слэш-команды...");

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(commands),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Ошибка регистрации:", data);
      return;
    }

    console.log(`✅ Команды успешно зарегистрированы! (${guildOnly ? "Guild" : "Global"})`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Ошибка сети:", err);
  }
}

registerCommands();
