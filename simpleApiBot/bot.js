const Telegraf = require('telegraf').Telegraf;
const axios = require('axios');
const fs = require('fs');

const bot = new Telegraf('5097461305:AAF0PwK_Dd_jxPmUA0dGaAhkZBbYfEsmw68');

const helpMessage = `
*Simple API Bot*
/fortune - get a fortune cookie
/cat - get a random cat pic
/cat \`<text>\` - get cat image with text
/dogbreeds - get list of dog breeds
/dogs \`<breed>\` - get image of dog breed
`;

bot.help(ctx => {
  // ctx.reply(helpMessage);
  bot.telegram.sendMessage(ctx.from.id, helpMessage, {
    parse_mode: 'Markdown'
  });
})

bot.command('fortune', ctx => {
  axios.get('http://yerkee.com/api/fortune')
    .then(res => {
      ctx.reply(res.data.fortune);
    }).catch(err => {
      console.log(err);
    });
});

bot.command('cat', async ctx => {
  let input = ctx.message.text;
  let inputArray = input.split(' ');

  if (inputArray.length === 1) {
    try {
      let res = await axios.get('https://aws.random.cat/meow');
      ctx.replyWithPhoto(res.data.file);
    } catch (err) {
      console.log(err);
    }
  } else {
    inputArray.shift();
    input = inputArray.join(' ');
    ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
  }
});

bot.command('dogbreeds', ctx => {
  let rawData = fs.readFileSync('./dogbreeds.json', 'utf8');
  let data = JSON.parse(rawData);

  let message = 'Dog Breeds: \n';
  data.forEach(item => message += `-${item}\n`);
  ctx.reply(message);
});

bot.command('dog', async ctx => {
  let inputArray = ctx.message.text.split(' ');

  if (inputArray.length !== 2) {
    ctx.reply('You must give a dog breed as the second argument');
    return;
  }

  let breedInput = inputArray[1];
  let rawData = fs.readFileSync('./dogbreeds.json', 'utf8');
  let data = JSON.parse(rawData);

  if (data.includes(breedInput)) {
    axios.get(`https://dog.ceo/api/breed/${breedInput}/images/random`)
      .then(res => {
        ctx.replyWithPhoto(res.data.message);
      }).catch(err => {
        console.log(err);
      });
  } else {
    let suggestions = data.filter(item => item.startsWith(breedInput));
    let message = 'Did you mean: \n';
    suggestions.forEach(item => message += `-${item}\n`);

    if (suggestions.length === 0) ctx.reply('There are no dogs with this breed');
    else ctx.reply(message);
  }
});

bot.launch();