const Telegraf = require('telegraf').Telegraf;
const axios = require('axios');

const bot = new Telegraf('5089557561:AAFkh_CYNJnJFKYRuJQuyMMYUuwiPn7VNZ4');

const apikey = 'fb6b7a042e4b066e42f04fbd00cf34b77532e208b1d45d205e101036973cbeb8';

bot.command('start', ctx => {
  sendStartMessage(ctx);
});

bot.action('start', ctx => {
  ctx.deleteMessage();
  sendStartMessage(ctx);
});

bot.action('price', ctx => {
  let priceMessage = `Get Price Information. Select one of the cryptocurrencies below`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, priceMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'BTC', callback_data: 'price-BTC' },
          { text: 'ETC', callback_data: 'price-ETC' },
        ], [
          { text: 'BCH', callback_data: 'price-BCH' },
          { text: 'LTC', callback_data: 'price-LTC' },
        ], [
          { text: 'Back to Menu', callback_data: 'start' },
        ],
      ]
    }
  });
});

function sendStartMessage(ctx) {
  let startMessage = `Welcome, this bot gives you cryptocurrency information`;
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Crypto Prices', callback_data: 'price' }],
        [{ text: 'CoinMarketCap', url: 'https://coinmarketcap.com/' }],
        [{ text: 'Info', callback_data: 'info' }],
      ]
    }
  });
}

let priceActionList = ['price-BTC', 'price-ETC', 'price-BCH', 'price-LTC'];

// bot.action();

bot.action(priceActionList, async ctx => {
  console.log(ctx);
  let symbol = ctx.match[0].split('-')[1];
  try {
    let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apikey}`);
    let data = res.data.DISPLAY[symbol].USD;

    let message = `
Symbol: ${symbol}
Price: ${data.PRICE}
Open: ${data.OPENDAY}
High: ${data.HIGHDAY}
Low: ${data.LOWDAY}
Supply: ${data.SUPPLY}
Market Cap: ${data.MKTCAP}
    `;

    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard:
          [
            [
              { text: 'Back to prices', callback_data: 'price' }
            ]
          ]
      }
    });
  } catch (err) {
    console.log(err);
    ctx.reply('Error encoutered');
  }
});

bot.action('info', ctx => {
  ctx.answerCbQuery();
  bot.telegram.sendMessage(ctx.chat.id, 'Bot info', {
    reply_markup: {
      keyboard: [
        [
          { text: 'Credits' },
          { text: 'API' }
        ],
        [
          { text: 'Remove keyboard' }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.hears('Credits', ctx => {
  ctx.reply('This bot was made by @dimitrrrr');
});

bot.hears('API', ctx => {
  ctx.reply('This bot uses cryptocompare API');
});

bot.hears('Remove keyboard', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, 'Removed keyboard', {
    reply_markup: {
      remove_keyboard: true
    }
  });
});

bot.launch();