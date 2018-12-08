export const showMessage = (bot, query, message: string) => {
  bot.editMessageText(message, {
    chat_id: query.message.chat.id,
    message_id: query.message.message_id
  });
  bot.answerCallbackQuery(query.id, {
    text: message,
    cache_time: 3
  });
};
