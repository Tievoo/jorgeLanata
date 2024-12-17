import { RouletteSlot } from "../models/rouletteManager.ts";

export interface Roulette {
    channelId: string;
    players: Record<string, RoulettePlayer>;
}

export interface RoulettePlayer {
    id: string;
    name: string;
    bets: Bet[];
    prevBets: Bet[];
}

export type Bet = {
    amount: number;
    slot: RouletteSlot;
}
