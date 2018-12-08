import {config} from "./config";
import {TelegramBot} from "./TelegramBot";

function startBotService() {
  const bot = new TelegramBot(config);
  bot.start();
}

startBotService();
