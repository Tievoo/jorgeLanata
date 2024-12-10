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
}
