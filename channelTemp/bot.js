const fetch = require('node-fetch');
// const Telegraf = require('telegraf').Telegraf;

// const bot = new Telegraf('5046180200:AAEGs0N_fnuerWalq4axydgKbbIoZQJ-ZjY');

// bot.use(ctx => {
//   console.log(ctx.chat);
// });

// bot.launch();

// this is wrapped in an `async` function
// you can use await throughout the function


let token = "5046180200:AAEGs0N_fnuerWalq4axydgKbbIoZQJ-ZjY";
let data = {
  chat_id: "-1001681416522",
  text: 'test'
};

(async () => {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
})();


// output = [{ id: 123, hello: "world" }];