const app = require("../config/express")();
const port = app.get("port");
const axios = require("axios");

const { Telegraf } = require("telegraf");

const options = {
  method: "GET",
  url:
    "https://aposta-ganha-aviator-api1.p.rapidapi.com/apostaganha-aviator-latest",
  headers: {
    "X-RapidAPI-Key": "8c90b725fdmshc520ab6927c0896p1cf1cfjsn89c7ac202a8e",
    "X-RapidAPI-Host": "aposta-ganha-aviator-api1.p.rapidapi.com"
  }
};

const API_URL = "https://aviator-manager-app.herokuapp.com/";
// BOT CIFRAO
// https://api.telegram.org/bot6193807556:AAFyhd8uT0-N0OX1CBtySk1-Eo0hhVt8b2A/getUpdates
const CHAT_ID = -1001840011460;
async function obtemResultados() {
  try {
    const dateNow = "2023-06-02";
    const betHouse = "APOSTA_GANHA";
    const numberVelas = 10;
    const response = await axios.get(
      `${options}history-vela?date=${dateNow}&bet-house=${betHouse}&number-velas=${numberVelas}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUb3RvbmVyb1NlcnZpY2UiLCJzdWIiOiIxIiwiZW1haWwiOiJ0ZWxlY29AYWRpbS5jb20iLCJpZCI6MSwicm9sZXMiOlsiUk9MRV9URUxFQ08iXSwiaWF0IjoxNjg3NzQxNTUwLCJleHAiOjE2ODg2NDA1Mzl9.2auphYMMIiAXRGejBtcD4lJhB7cperVujgz2gtzI4RA"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function postTelegram(message) {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot6193807556:AAFyhd8uT0-N0OX1CBtySk1-Eo0hhVt8b2A/sendMessage?chat_id=${CHAT_ID}&text=${message}&parse_mode=MarkdownV2`
    );
    console.log("ENVIO PRO TELEGRAM", response.data.ok);
  } catch (error) {
    console.error(error);
  }
}

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(8085, async () => {
  let dois = false;
  console.log("Start server");

  const bot = new Telegraf("6193807556:AAFyhd8uT0-N0OX1CBtySk1-Eo0hhVt8b2A");

  let results2 = {
    velas: [
      {
        odd: 0
      }
    ]
  };

  setInterval(async () => {
    let results = await obtemResultados();

    let cinco = false;
    let um = false;
    console.log("nova chamada realizada interval");

    if (results === undefined) {
      console.log("Error on server");
      return;
    }

    if (results.velas[0].odd !== results2.velas[0].odd) {
      const game1 = results.velas[0].odd;
      const game2 = results2.velas[0].odd;
      const specialOdds = [1.37, 1.11, 1.88, 1.99];

      console.log(
        `atualizou odds game1: ${JSON.stringify(results.velas.map(x => x.odd))}`
      );

      const FAKE_AVIATOR = [0, 13.5, 0, 13.1, 8, 7.5, 1.0, 0, 0, 0, 1.88];

      const findBy = results.velas.filter(item => {
        return specialOdds.some(x => x === item.odd);
      });

      console.log("find", findBy);

      const findByPurple = results.velas.filter(item => {
        if (item.odd >= 7 && item.odd < 10) {
          return item.odd;
        }
      });

      const findByPink = results.velas.filter(item => {
        if (item.odd >= 13 && item.odd < 14) {
          return item.odd;
        }

        if (item.odd >= 15 && item.odd < 16) {
          return item.odd;
        }

        if (item.odd >= 17 && item.odd < 18) {
          return item.odd;
        }

        if (item.odd >= 55 && item.odd < 56) {
          return item.odd;
        }

        if (item.odd >= 99 && item.odd < 100) {
          return item.odd;
        }
      });

      const specialFilter = specialOdds.find(x => (x === game1 ? true : false));

      if (specialFilter) {
        await bot.telegram.sendMessage(
          CHAT_ID,
          `💰 BOT CIFRAO 💰\n\nATENÇÃO! VELA ESPECIAL ${game1}x CONFIRMADA!
            \nFAZER PROTEÇÃO NO 1.49X ✅
            \nPOSSÍVEL SUBIDA DE ATÉ 2X 5X 10X!!!
            \nObs: Analise e assuma seu risco!.`
        );
        console.log(
          `PADRÃO DE COMBINAÇÃO DE VELAS ESPECIAIS BAIXAS CONFIRMADO!!! ${JSON.stringify(
            findBy
          )}\n\n`
        );
      }

      if (findByPink.length + findBy.length + findByPurple.length >= 2) {
        const mergeOdds = findBy.concat(findByPink).concat(findByPurple);
        await bot.telegram.sendMessage(
          CHAT_ID,
          `💰 BOT CIFRAO 💰 \n\nPADRÃO DE COMBINAÇÃO DE VELAS ESPECIAIS COMBINADAS!!! 
            \nHISTÓRICO AVIATOR: ${JSON.stringify(
              results.velas.map(x => x.odd)
            )}
            \nCOMBINAÇÃO: ${JSON.stringify(mergeOdds.map(x => x.odd))}`
        );
        console.log(
          `PADRÃO DE COMBINAÇÃO DE VELAS ESPECIAIS COMBINADAS CONFIRMADO!!! ${JSON.stringify(
            findByPink.map(x => x.odd)
          )}\n\n`
        );
      }
    }

    results2 = results;
  }, 5000);
});
