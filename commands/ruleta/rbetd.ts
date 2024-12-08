import { Message } from "discord.js";
import { rbet } from "./rbet.ts";

export function rbetd(message: Message, args: string[]) {
    return rbet(message, args, false, true);
}