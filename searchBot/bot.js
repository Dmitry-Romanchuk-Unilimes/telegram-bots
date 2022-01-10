const Telegraf = require('telegraf').Telegraf;
const axios = require('axios');

const bot = new Telegraf('5023929875:AAFpJdhAaVVH0xR5_-T-qh6D7I684gc19kg');

const pixabayApiKey = '25184478-77363031224825ac619999300';

bot.command(['start', 'help'], ctx => {
  let message = `
Welcome to Search Bot!
Use the inline mode below
@dimitrrrr_searchBot p <search image>
@dimitrrrr_searchBot w <search wiki>
  `;

  ctx.reply(message, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Search Pixabay Image', switch_inline_query_current_chat: 'p ' }
        ], [
          { text: 'Search Wiki', switch_inline_query_current_chat: 'w ' }
        ]
      ]
    }
  });
});

bot.inlineQuery(['start', 'help'], ctx => {
  let message = `
Welcome to Search Bot!
Use the inline mode below
@dimitrrrr_searchBot p <search image>
@dimitrrrr_searchBot w <search wiki>
  `;

  let results = [
    {
      type: 'article',
      id: '1',
      title: 'Help Reference',
      input_message_content: {
        message_text: message
      },
      description: 'Sends help message on how to use bot',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Search Pixabay Image', switch_inline_query_current_chat: 'p ' }
          ], [
            { text: 'Search Wiki', switch_inline_query_current_chat: 'w ' }
          ]
        ]
      }
    }
  ];
  ctx.answerInlineQuery(results);
});

bot.inlineQuery(/p\s.+/, async ctx => {
  let input = ctx.inlineQuery.query.split(' ');
  input.shift();
  let query = input.join(' ');

  let res = await axios.get(`https://pixabay.com/api?key=${pixabayApiKey}&q=${query}`);
  let data = res.data.hits;

  let results = data.map((item, index) => {
    return {
      type: 'photo',
      id: String(index),
      photo_url: item.webformatURL,
      thumb_url: item.previewURL,
      photo_width: 300,
      photo_height: 200,
      caption: `[Source](${item.webformatURL})\n[Large Image](${item.largeImageURL})`,
      parse_mode: 'Markdown'
    }
  });

  ctx.answerInlineQuery(results);
});

bot.inlineQuery(/w\s.+/, async ctx => {
  let input = ctx.inlineQuery.query.split(' ');
  input.shift();
  let query = input.join(' ');

  let res = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=50&format=json`);
  let data = res.data;
  let allTitles = data[1];
  let allLinks = data[3];
  if (!allTitles) return;

  let results = allTitles.map((item, index) => {
    return {
      type: 'article',
      id: String(index),
      title: item,
      input_message_content: {
        message_text: `${item}\n${allLinks[index]}`,
      },
      description: allLinks[index],
      reply_markup: {
        inline_keyboard: [
          [
            { text: `Share ${item}`, switch_inline_query: `${item}` }
          ]
        ]
      }
    }
  });

  ctx.answerInlineQuery(results);
});

bot.launch();