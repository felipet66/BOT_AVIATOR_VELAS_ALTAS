import axios from "axios";
import { Telegram } from 'telegraf';

import {IHistoryOdd, IOdd, Gale} from "../models";
import Enviroments from "../enviroments";

export const GetHistoryOdd = async (): Promise<IHistoryOdd> => {
  try {
    const dateNow = "2023-06-02";
    const betHouse = "APOSTA_GANHA";
    const numberVelas = 10;
    const response = await axios.get(
      `${Enviroments.API_URL}history-vela?date=${dateNow}&bet-house=${betHouse}&number-velas=${numberVelas}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJUb3RvbmVyb1NlcnZpY2UiLCJzdWIiOiIyIiwiZW1haWwiOiJmbGlwdG05NUBnbWFpbC5jb20iLCJpZCI6Miwicm9sZXMiOlsiUk9MRV9URUxFQ08iXSwiaWF0IjoxNjg5Mjc0Njg0LCJleHAiOjE2OTAxNzM2NzR9.-TyFWoECHACWjxrA2nmcxTesLjK0iwBsCnnznBWfgTw"
        }
      }
    );

    const historyOdds: IHistoryOdd = response.data;
    return historyOdds;
  } catch (error) {
    console.error("ESTAMOS COM ALGUM ERRO NA CONSULTA DOS DADOS");
    throw error;
  }
}

export const SendMessageTelegram = async (odd: string, lastResult: number, strategy: string) => {
  const bot: Telegram = new Telegram(Enviroments.BOT_TELECO);
  const res = await bot.sendMessage(
    Enviroments.CHAT_ID_TELECO_FREE,
    `🔥 BOT TELECO 🔥 \nSINAL CONFIRMADO! \nEntrar após ${lastResult}x \nVoar até ${odd}X \nEstratégia ${strategy}`
  );

  return res;
}


export const SendMessage = async (message: string) => {
  const bot: Telegram = new Telegram(Enviroments.BOT_TELECO);
  const res = await bot.sendMessage(
    Enviroments.CHAT_ID_TELECO_FREE,
    message
  );

  return res;
}

export const EditMessageTelegramGale = async (messageId: number, game: number, gale: Gale) =>  {
  const bot: Telegram = new Telegram(Enviroments.BOT_TELECO);
  const message = `🔥 BOT TELECO 🔥 \n Estamos no ${gale} \nAvião subiu até ${game}x \n`;
  await bot.editMessageText(Enviroments.CHAT_ID_TELECO_FREE, messageId, "xd", message);
}

export const EditMessageTelegramFeedback = async (messageId: number, game: number, gale: Gale, green: boolean, media: number) =>  {
  const bot: Telegram = new Telegram(Enviroments.BOT_TELECO);
  const title = green ? `DEU GREEN ✅✅✅✅✅✅ ` : `DEU RED TROPINHA 🔻🔻🔻`;
  const message = `🔥 BOT TELECO 🔥 \n${title} \nAvião subiu até ${game}x ${game >= 10 ? `🌹🌹🌹` : ``} \n${gale} \n a média estava em: ${media}`;
  await bot.editMessageText(Enviroments.CHAT_ID_TELECO_FREE, messageId, "xd", message);
}

export const GetMediaArray = (values: IOdd[]): number => {
  let media = values.map((x: any) => x.odd)
    .reduce(function(total: any, item: any, indice: any, array: any) {
      total = total + item;

      if (indice == array.length - 1) {
        return total / array.length;
      }

      return total;
    });
  
  if (media) {
    media = media.toFixed(2);
  }
  
  return media;
}