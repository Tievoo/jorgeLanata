import { casinoDB } from "../database/manager.ts";
import { RouletteState } from "../models/RouletteState.ts";
import { Bet } from "../types/casino.types.ts";

export const rouletteState: RouletteState = new RouletteState(casinoDB.get().roulettes)

export function getBetAmount(bet: Bet[]) {
    return bet.reduce((acc, bet) => acc + bet.amount, 0);
}

export function displayBet(bets: Bet[]) {
    const amount = bets.reduce((acc, bet) => acc + bet.amount, 0);
    return `${bets.map(bet => `**${bet.amount}** en ${bet.slot}`).join("\n")}\nTotal apostado: **${amount}**`;
}
