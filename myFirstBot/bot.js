const Telegraf = require('telegraf').Telegraf;

const bot = new Telegraf('5066973891:AAHb-IDyexkJPdXlPFaFokPTUzRs0Bk_-ZY');

bot.use((ctx, next) => {
  ctx.reply('you used the bot');
  ctx.state.test = 123;
  next(ctx);
});

bot.start((ctx) => {
  ctx.reply(`${ctx.from.first_name} have entered the start command and it is a '${ctx.message.text}'`);
  ctx.reply(`State is ${ctx.state.test}`);
  ctx.reply(ctx.state);
});

bot.launch();