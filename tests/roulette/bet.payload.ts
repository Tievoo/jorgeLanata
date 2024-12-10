import { parseBet } from '../../funcs/rula.utils'
import { RouletteEven, RouletteRed } from '../../models/roulette.ts'
import { Bet } from '../../types/casino.types.ts'

export const parRojo : Bet[] = [
    { amount: 100, slot: new RouletteRed()  },
    { amount: 100, slot: new RouletteEven() }
]

export const numeros13579 : Bet[] = parseBet(["[1,3,5,7,9]:100"], 0)

export const allInRojo : Bet[] = parseBet(["rojo:all"], 500)
