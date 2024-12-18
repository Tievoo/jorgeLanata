import { Queue } from "../models/Queue.ts";
import { RouletteSlot } from "../models/RouletteManager.ts";

export interface Roulette {
    channelId: string;
    players: Record<string, RoulettePlayer>;
    lastResults: Queue<number>;
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
