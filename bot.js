const mineflayer = require('mineflayer');
const express = require('express');
const path = require('path');

const options = {
  host: 'tomatomc.pl.falixsrv.me',
  port: 28676,
  username: 'MPromidorek',
  version: '1.21.4',
  auth: 'offline'
};

let bot;

function createBot() {
  bot = mineflayer.createBot(options);

  bot.on('login', () => {
    console.log('✅ Bot zalogowany!');
  });

  bot.on('end', () => {
    console.log('❌ Bot rozłączony, ponawianie za 5 sekund...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('⚠️ Błąd: ', err);
  });

  // 🔁 Anti-AFK: skakanie + chodzenie + obracanie się
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 400);

      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), 800);

      const yaw = Math.random() * 2 * Math.PI;
      const pitch = (Math.random() - 0.5) * 0.5;
      bot.look(yaw, pitch, true);
    }
  }, 30000); // co 30 sekund

  // 💬 Wiadomość na czacie co 5 minut
  setInterval(() => {
    if (bot && bot.chat) {
      bot.chat('✅ Jestem botem AFK – nie wyrzucajcie mnie 😄');
    }
  }, 5 * 60 * 1000); // co 5 minut
}

// 🌐 Express serwer
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Panel bota dostępny na http://localhost:${PORT}`);
});

createBot();
