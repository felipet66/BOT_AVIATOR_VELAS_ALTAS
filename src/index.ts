
import express, { Request, Response } from 'express';
import axios from 'axios';
import { fromEvent } from 'rxjs';
import { Telegram } from 'telegraf';

const app = express();
const port = 3091;

app.use(express.json());

app.listen(port, () => {
  console.log(`API rodando!`);
  const ENV_VELA_ALTA = "6534315678:AAGEFLsSgld3t0PoWQy_xx8-JlwKgN9fchI";
  const ENV_REI_VELA = "6513557532:AAEzXKYDvzI3HoyziZlsV11KAdmOTlGwk7M"
  const bot_1: Telegram = new Telegram(ENV_VELA_ALTA);
  const bot_2: Telegram = new Telegram(ENV_REI_VELA);
  let lastMessage = "START BOT";
  const telegramApiUrl = 'https://api.telegram.org/bot6433509933:AAHZ-wTwWo2a7aW_bokFbQbM_ATY3Qc_pV0/getUpdates?offset=-1';
  setInterval(async () => {
    await axios.get(telegramApiUrl)
      .then(async (response) => {
        const { result } = response.data;
        const messageAPI = result[0].channel_post.text;
        if (lastMessage !== messageAPI) {
          let teste = messageAPI.replace("Padrão 15 AUS", "Padrão Vela Acima de 10X");
          console.log(teste);
          const res = await bot_1.sendMessage(
            -1001936954309,
            teste
          );
          const res2 = await bot_2.sendMessage(
            -1001978816761,
            teste
          );
        }

        lastMessage = messageAPI;
      })
      .catch(error => {
        console.error('Erro ao buscar atualizações do Telegram:', error);
      });
  }, 2000);
});

