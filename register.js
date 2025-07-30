import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const { DISCORD_BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const headers = {
  "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
  "Content-Type": "application/json"
};

const commands = [
  {
    name: 'minecraft',
    description: 'Пошаговое прохождение Minecraft',
    type: 1,
    options: [
      {
        name: 'действие',
        description: 'Следующий шаг',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: '8ball',
    description: 'Магический шар предскажет ответ',
    type: 1,
    options: [
      {
        name: 'text',
        description: 'Ваш вопрос',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'tea',
    description: 'Заварите собственный чай',
    type: 1,
    options: [
      { name: 'ингредиент1', type: 3, description: 'Первый ингредиент', required: true },
      { name: 'ингредиент2', type: 3, description: 'Второй ингредиент', required: false }
    ]
  },
  {
    name: 'namefusion',
    description: 'Слияние двух имён',
    type: 1,
    options: [
      { name: 'name1', type: 3, description: 'Первое имя', required: true },
      { name: 'name2', type: 3, description: 'Второе имя', required: true }
    ]
  },
  {
    name: 'treegrow',
    description: 'Полей дерево и смотри, как оно растёт',
    type: 1
  }
];

const url = `https://discord.com/api/v10/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands`;

fetch(url, {
  method: 'PUT',
  headers,
  body: JSON.stringify(commands)
})
.then(res => res.json())
.then(json => console.log('✅ Зарегистрированы команды:', json))
.catch(console.error);
