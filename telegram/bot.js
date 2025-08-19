import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `${msg.chat.id} Привіт, Аліна! Я твій Telegram-бот. Тут будуть твої замовлення. Очікуй на них!`);
});

bot.on("message", (msg) => {
  if (msg.text !== "/start") {
    bot.sendMessage(msg.chat.id, `${msg.text}`);
  }
});