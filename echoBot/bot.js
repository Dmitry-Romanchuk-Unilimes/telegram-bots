const Telegraf = require('telegraf').Telegraf;

const bot = new Telegraf('5011768578:AAEkfmRFYiTGREdVzUhsKH1Px_5gsi4IXGY');

const helpMessage = `
  Say something to me
  /start - start the bot
  /help - command reference
`;

bot.use((ctx, next) => {
  if (ctx?.from?.username)
    if (ctx.message.text)
      bot.telegram.sendMessage(-535081639, `${ctx.from.username} said ${ctx.message.text}`);
    else telegram.sendMessage(-535081639, `${ctx.from.username} sent a non-text message`);
  next();
})

bot.start(ctx => {
  ctx.reply('Hi I am Echo Bot');
  ctx.reply(helpMessage);
});

bot.help(ctx => {
  ctx.reply(helpMessage);
});

bot.command('echo', (ctx) => {
  let input = ctx.message.text;
  let inputArray = input.split(' ');

  let message = "";
  if (inputArray.length === 1) message = 'You said echo';
  else {
    inputArray.shift();
    message = inputArray.join(' ');
  }

  ctx.reply(message);
});

bot.launch();