export function editButton(bot, query, inlineKeyboards): void {
  bot.editMessageReplyMarkup(
    {inline_keyboard: [inlineKeyboards]},
    {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id
    },
  );
}
