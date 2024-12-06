import { HexColorString } from "discord.js";

export interface Top {
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
