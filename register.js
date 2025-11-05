import fetch from "node-fetch";

const TOKEN = process.env.BOT_TOKEN;
const APP_ID = process.env.APPLICATION_ID;

const url = `https://discord.com/api/v10/applications/${APP_ID}/commands`;

const commands = [
  {
    name: "ping",
    description: "Пинг!"
  }
];

await fetch(url, {
  method: "PUT",
  headers: {
    "Authorization": `Bot ${TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(commands)
}).then(res => res.json()).then(console.log);
