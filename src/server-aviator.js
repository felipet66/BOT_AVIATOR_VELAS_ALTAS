const app = require("../config/express")();
const port = app.get("port");
const axios = require("axios");
const { Telegraf } = require("telegraf");

const API_URL = "https://aviator-manager-app.herokuapp.com/";

// BOT TELECO
// https://api.telegram.org/bot6069657404:AAHPjHgrS2e_aDSIrtxnwYBB7GKBjyVH_J8/getUpdates

const CHAT_ID_VIP = -1001934853510;

const CHAT_ID_FREE = -1001899468267;

const CHAT_ACTIVE = CHAT_ID_VIP;

async function obtemResultados() {
  try {
    const dateNow = "2023-06-02";
    const betHouse = "APOSTA_GANHA";
    const numberVelas = 7;
    const response = await axios.get(
      `${API_URL}history-vela?date=${dateNow}&bet-house=${betHouse}&number-velas=${numberVelas}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function handleEditMessageTelegram(bot, messageId, message) {
  await bot.telegram.editMessageText(CHAT_ACTIVE, messageId, "xd", message);
}

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(port, async () => {
  console.info("SERVIDOR INICIADO!");
  let dois = false;

  let results2 = {
    velas: [
      {
        odd: 0
      }
    ]
  };
  let messageTelegram;
  let sinal = false;
  let gale1 = false;
  let gale2 = false;
  let red = false;
  let placar = 0;
  let media;
  const bot = new Telegraf("6069657404:AAHPjHgrS2e_aDSIrtxnwYBB7GKBjyVH_J8");

  setInterval(async () => {
    let results = await obtemResultados();
    red = false;

    if (results === undefined) {
      console.log("Error on server");
      return;
    }

    media = results.velas
      .map(x => x.odd)
      .reduce(function(total, item, indice, array) {
        total = total + item;

        if (indice == array.length - 1) {
          return total / array.length;
        }

        return total;
      });
    if (media) {
      media = media.toFixed(2);
    }

    console.log(media);

    console.log(
      `------------- log -------------- ${JSON.stringify(
        results.velas[0].odd
      )} - ${JSON.stringify(results2.velas[0].odd)}`
    );

    if (results.velas[0].odd !== results2.velas[0].odd) {
      const game1 = results.velas[0].odd;
      const game2 = results.velas[1].odd;

      console.log("Updating results.");

      // valida se o sinal deu odd maior que 2
      // ou entra no gale 2
      if (sinal && gale1 && game1 > 1.5 && gale2) {
        placar += 1;
        console.log("DEU GREEN NO GALE 2: ODD: ", game1);
        handleEditMessageTelegram(
          bot,
          messageTelegram.message_id,
          `🔥 BOT TELECO 🔥 \nDEU GREEN ✅✅✅✅✅✅ \nAvião subiu até ${game1} \nPagou no gale 2 \nmedia ${media}`
        );
        sinal = false;
        gale1 = false;
        gale2 = false;
      } else if (sinal && gale1 && gale2) {
        console.log("DEU RED: ", game1);
        await bot.telegram.editMessageText(
          CHAT_ACTIVE,
          messageTelegram.message_id,
          "xd",
          `DEU RED TROPINHA, 🔻🔻🔻 \nVOLTEM DEPOIS!: \nODD: ${game1} \nmedia ${media}`
        );
        gale1 = false;
        gale2 = false;
        sinal = false;
        red = true;
      }

      // valida se o sinal deu odd maior que 2
      // ou entra no gale 1
      if (sinal && gale1 && game1 > 1.5 && !gale2) {
        console.log("DEU GREEN VALOR: ", game1);
        handleEditMessageTelegram(
          bot,
          messageTelegram.message_id,
          `🔥 BOT TELECO 🔥 \nDEU GREEN ✅✅✅✅✅✅ \nAvião subiu até ${game1} \nPagou gale 1\nmedia ${media}`
        );
        placar += 1;

        sinal = false;
        gale1 = false;
        gale2 = false;
      } else if (sinal && gale1) {
        console.log("GALE 2:", game1);
        handleEditMessageTelegram(
          bot,
          messageTelegram.message_id,
          `🔥 BOT TELECO 🔥 \nEstamos no gale 2!\nAvião subiu até: ${game1}x`
        );
        gale2 = true;
      }

      // valida se o sinal deu odd maior que 2
      // ou entra no gale 1
      if (sinal && game1 > 1.5 && !gale1 && !gale2) {
        console.log("DEU GREEN VALOR: ", game1);
        handleEditMessageTelegram(
          bot,
          messageTelegram.message_id,
          `🔥 BOT TELECO 🔥 \nDEU GREEN ✅✅✅✅✅✅ \nAvião subiu até: ${game1}x \nPagou sem gale \nmedia ${media}`
        );
        placar += 1;
        sinal = false;
      } else if (sinal && !gale1 && !gale2) {
        console.log("GALE 1: ", game1);
        handleEditMessageTelegram(
          bot,
          messageTelegram.message_id,
          `🔥 BOT TELECO 🔥 \nEstamos no gale 1!!!\nAvião subiu até: ${game1}x`
        );
        gale1 = true;
      }

      if (
        game1 < 2 &&
        game2 < 2 &&
        media > 1.5 &&
        !gale1 &&
        !gale2 &&
        !sinal &&
        !red
      ) {
        console.log(
          `SINAL CONFIRMADO BUSCAR 1.5X - sinal ${sinal} game1 ${game1} game2 ${game2}`
        );

        const res = await bot.telegram.sendMessage(
          CHAT_ACTIVE,
          `🔥 BOT TELECO 1🔥 \nSINAL CONFIRMADO! \nentrar após ${game1}x \nvoar até 1.5x \nmedia ${media}`
        );

        console.log(res);
        messageTelegram = res;
        sinal = true;
        red = false;
      }

      if (
        game1 >= 2 &&
        game2 < 2 &&
        media > 2 &&
        !gale1 &&
        !gale2 &&
        !sinal &&
        !red
      ) {
        console.log(
          `SINAL CONFIRMADO BUSCAR 1.5X - sinal ${sinal} game1 ${game1} game2 ${game2}`
        );

        const res = await bot.telegram.sendMessage(
          CHAT_ACTIVE,
          `🔥 BOT TELECO 2🔥 \nSINAL CONFIRMADO! \nentrar após ${game1}x \nvoar até 1.5x \nmedia ${media}`
        );

        console.log(res);
        messageTelegram = res;
        sinal = true;
        red = false;
      }
    }

    results2 = results;
  }, 2000);
});
