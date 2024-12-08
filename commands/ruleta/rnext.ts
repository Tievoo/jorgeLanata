import { Message } from "discord.js";
import { setNxt } from "./rroll.ts";

export function rnext(message: Message, args: string[]) {
    const number = args[0];
    setNxt(parseInt(number));
    return message.reply("Numero seteado");
}