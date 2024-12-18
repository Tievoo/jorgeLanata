import { HexColorString } from "discord.js";

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
    lastResults: number[];
}

export interface JsonBet {
    amount: number;
    slot: string;
}

export interface JsonRoulettePlayer {
    id: string;
    name: string;
    bets: JsonBet[];
    prevBets: JsonBet[];
}

