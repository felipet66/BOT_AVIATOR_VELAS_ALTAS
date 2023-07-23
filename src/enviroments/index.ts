interface IEnviroment {
  API_URL: string,
  BOT_TELECO: string,
  BOT_CIFRAO: string,
  BOT_OPTIMUS: string,
  CHAT_ID_CIFRAO: number,
  CHAT_ID_OPTIMUS: number,
  CHAT_ID_TELECO_FREE: number,
  CHAT_ID_TELECO_VIP: number
}

const Enviroments: IEnviroment = {
  API_URL: "https://aviator-manager-app.herokuapp.com/",
  BOT_CIFRAO: "6193807556:AAFyhd8uT0-N0OX1CBtySk1-Eo0hhVt8b2A",
  BOT_OPTIMUS: "6193807556:AAFyhd8uT0-N0OX1CBtySk1-Eo0hhVt8b2A",
  BOT_TELECO: "6069657404:AAHPjHgrS2e_aDSIrtxnwYBB7GKBjyVH_J8",
  CHAT_ID_CIFRAO: -1001840011460,
  CHAT_ID_OPTIMUS: -1001988569786,
  CHAT_ID_TELECO_FREE: -1001899468267,
  CHAT_ID_TELECO_VIP: -1001934853510
}

export default Enviroments;