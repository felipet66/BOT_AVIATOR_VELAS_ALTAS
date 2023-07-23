"use strict";
import { GetHistoryOdd, SendMessageTelegram, GetMediaArray, EditMessageTelegramFeedback, EditMessageTelegramGale, SendMessage } from "./helpers";
import { Gale } from "./models";

const express = require('express');
const app = express();
// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(8082, async () => {
  console.info("SERVIDOR INICIADO!");
  let dois = false;

  let results2 = {
    velas: [
      {
        odd: 0
      }
    ]
  };
  let messageTelegram: any;
  let sinal = false;
  let sinal2x = false;
  let gale1 = false;
  let gale2 = false;
  let red = false;
  let placar = 0;
  let media;
  let green = 0;
  let deuRed = 0;

  setInterval(async () => {
    let results = await GetHistoryOdd();
    red = false;

    if (results === undefined) {
      console.log("Error on server");
      return;
    }

    media = GetMediaArray(results.velas);

    console.log(
      `
      ------------- log -------------- 
      ${results.velas[0].odd} - ${results2.velas[0].odd}
      \nmédia: ${media}
      `
    );

    if (results.velas[0].odd !== results2.velas[0].odd) {
      const game1 = results.velas[0].odd;
      const game2 = results.velas[1].odd;
      const game3 = results.velas[2].odd;

      console.log("Updating results.");
      console.log(`Green: ${green} Red: ${deuRed}`);

      if (sinal) {
        setTimeout(() => {
          SendMessage(`CONFIRA NOSSO PLACAR: \n\n${green} ✅  x 🔻 ${deuRed}  `)
        }, 1000000);
      }

      // valida se o sinal deu odd maior que 2
      // ou entra no gale 2
      if (sinal && gale1 && game1 > 1.5 && gale2) {
        placar += 1;
        console.log("DEU GREEN NO GALE 2: ODD: ", game1);
        EditMessageTelegramFeedback(
          messageTelegram.message_id,
          game1,
          Gale.GALE_TWO,
          true,
          media
        );
        sinal = false;
        gale1 = false;
        gale2 = false;
        green++;
      } else if (sinal && gale1 && gale2) {
        console.log("DEU RED: ", game1);
        await EditMessageTelegramFeedback(
          messageTelegram.message_id,
          game1,
          Gale.RED,
          false,
          media
        );
        gale1 = false;
        gale2 = false;
        sinal = false;
        red = true;
        deuRed++;
      }

      // valida se o sinal deu odd maior que 2
      // ou entra no gale 1
      if (sinal && gale1 && game1 > 1.5 && !gale2) {
        console.log("DEU GREEN VALOR: ", game1);
        EditMessageTelegramFeedback(
          messageTelegram.message_id,
          game1,
          Gale.GALE_ONE,
          true,
          media
        );
        placar += 1;

        sinal = false;
        gale1 = false;
        gale2 = false;

        green++;
      } else if (sinal && gale1) {
        console.log("GALE 2:", game1);
        EditMessageTelegramGale(
          messageTelegram.message_id,
          game1,
          Gale.GALE_TWO
        );
        gale2 = true;
      }

      // valida se o sinal deu odd maior que 2
      // ou entra no gale 1
      if (sinal && game1 > 1.5 && !gale1 && !gale2) {
        console.log("DEU GREEN VALOR: ", game1);
        EditMessageTelegramFeedback(
          messageTelegram.message_id,
          game1,
          Gale.NOT_GALE,
          true,
          media
        );
        placar += 1;
        sinal = false;
        green++;
      } else if (sinal && !gale1 && !gale2) {
        console.log("GALE 1: ", game1);
        EditMessageTelegramGale(
          messageTelegram.message_id,
          game1,
          Gale.GALE_ONE
        );
        gale1 = true;
      }

      if (
        game1 >= 2 &&
        game1 <= 12 &&
        (game2 >= 2 && game2 <= 12) &&
        (game3 >= 2 && game3 <= 12) &&
        !gale1 &&
        !gale2 &&
        !sinal &&
        !red
      ) {
        console.log(
          `SINAL CONFIRMADO BUSCAR 1.50X - sinal ${sinal} game1 ${game1} game2 ${game2}`
        );

        const res = await SendMessageTelegram("1.5", game1, "3");
        console.log(res);
        messageTelegram = res;
        sinal = true;
        red = false;
      }
      
      // DUPLA ABAIXO DE 2
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

        const res = await SendMessageTelegram("1.5", game1, "1");
        console.log(res);
        messageTelegram = res;

        sinal = true;
        red = false;
      }

      // ALTERNANCIA
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

        const res = await SendMessageTelegram("1.5", game1, "2");
        console.log(res);
        messageTelegram = res;
        sinal = true;
        red = false;
      }
    }

    results2 = results;
  }, 1500);
});
