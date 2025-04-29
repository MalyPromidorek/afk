const mineflayer = require('mineflayer');
const express = require('express');
const path = require('path');

const options = {
  host: 'wszyscygramy.aternos.me', // IP serwera bez portu
  port: 47374,                    // port serwera
  username: 'MPromidorek',         // nick bota
  version: '1.21.4',              // wersja serwera
  auth: 'offline'                 // jeśli online-mode jest wyłączony (offline mode)
};
//
let bot;

function createBot() {
  bot = mineflayer.createBot(options);

  bot.on('login', () => {
    console.log('Bot zalogowany!');
  });

  bot.on('end', () => {
    console.log('Bot rozłączony, ponowne łączenie za 5 sekund...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Błąd: ', err);
  });

  // Anti-AFK - co 60 sekund podskoczy i obróci się lekko
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      bot.look(Math.random() * 2 * Math.PI, 0);
    }
  }, 60000);

  // Opcjonalnie możesz ustawić wysyłanie wiadomości co jakiś czas:
  /*
  setInterval(() => {
    if (bot && bot.chat) {
      bot.chat('Jestem tylko afk botem ;)');
    }
  }, 300000); // co 5 minut
  */
}


// app.js - Serwer Node.js z Express do hostowania strony
//

const app = express();

const PORT = process.env.PORT || 3000;

// Serwowanie plików statycznych (np. CSS, obrazy, JS)
app.use(express.static('public'));

// Główna strona
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});

/*
Struktura katalogu:
- project-folder/
  - app.js
  - public/
    - index.html
    - style.css (jeśli chcesz oddzielny CSS)
*/


createBot();