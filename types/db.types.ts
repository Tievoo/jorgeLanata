import { HexColorString } from "discord.js";
import { Roulette } from "./casino.types.ts";

export interface Leaderboard {
    [key: string]: {
        users: { id: string, amount: number }[]
    };
}
export interface Game {
    id: string;
    name: string;
    logo: string;
    color: HexColorString;
}

export interface Casino {
    users: Record<string, { balance: number }>;
    commissions: Record<string, number>;
    roulettes: Record<string, JsonRoulette>;
}

export interface JsonRoulette {
    channelId: string;
    players: Record<string, JsonRoulettePlayer>;
}

export interface JsonRoulettePlayer {
    id: string;
    name: string;
    bets: { slot: string, amount: number }[];
    prevBets: { slot: string, amount: number }[];
}

