import { Message } from "discord.js";
import { setNxt } from "./rroll.ts";

export function rnext(message: Message, args: string[]) {
    const number = args[0];
    setNxt(parseInt(number));
    if (message.channelId !== "368192994760851467") return;
    return message.reply("Numero seteado");
}
