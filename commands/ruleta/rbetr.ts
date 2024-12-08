import { Message } from "discord.js";
import { rbet } from "./rbet.ts";

export function rbetr(message: Message, args: string[]) {
    return rbet(message, args, true);
}