interface IHistoryOdd {
  velas: IOdd[]
}

interface IOdd {
  odd: number,
  time: string
}

enum Gale {
  NOT_GALE = "Sem gale",
  GALE_ONE = "Gale 1",
  GALE_TWO = "Gale 2",
  RED = "Deu red"
}

export { IHistoryOdd, IOdd, Gale };