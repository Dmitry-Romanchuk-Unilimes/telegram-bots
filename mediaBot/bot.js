const Telegraf = require('telegraf').Telegraf;

const bot = new Telegraf('5049771661:AAFEfyeX8kg9NHoS_IQUmaOTsqV2Hj5-Mzs');

bot.command(['start', 'help'], ctx => {
  let message = `
/newyork - get image of New York
/dubai - get gif of Dubai
/singapore - get location of Singapore
/cities - get photos of cities
/citiesllist - get text file citoes
  `;

  ctx.reply(message);
})

bot.command('newyork', ctx => {
  bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
  bot.telegram.sendPhoto(ctx.chat.id, { source: 'res/newyork.jpg' }, { reply_to_message_id: ctx.message.message_id });
});

bot.command('dubai', ctx => {
  bot.telegram.sendChatAction(ctx.chat.id, 'upload_video');
  bot.telegram.sendAnimation(ctx.chat.id, 'https://media.itsnicethat.com/original_images/giphy-2021-gifs-and-clips-animation-itsnicethat-03.gif', { reply_to_message_id: ctx.message.message_id });
});

bot.command('cities', ctx => {
  let cities = ['dubai', 'hongkong', 'london', 'newyork', 'singapore',];
  bot.telegram.sendMediaGroup(ctx.chat.id,
    cities.map(city => ({ type: 'photo', media: { source: `res/${city}.jpg` } })),
    { reply_to_message_id: ctx.message.message_id });
});

bot.command('citieslist', ctx => {
  bot.telegram.sendDocument(ctx.chat.id, { source: 'res/citieslist.txt' }, { reply_to_message_id: ctx.message.message_id, thumb: { source: 'res/dubai.jpg' } });
});

bot.command('singapore', ctx => {
  bot.telegram.sendLocation(ctx.chat.id, 1.3521, 103.8198);
});

bot.on('message', async ctx => {
  if (ctx?.message?.document) {
    try {
      let link = await bot.telegram.getFileLink(ctx.message.document.file_id);
      ctx.reply(`Your download link: ${link}`);
    } catch (err) {
      console.log(err);
      ctx.reply(err.description);
    }
  } else if (ctx?.message?.photo) {
    try {
      let link = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
      ctx.reply(`Your download link: ${link}`);
    } catch (err) {
      console.log(err);
      ctx.reply(err.description);
    }
  }
});

bot.launch();