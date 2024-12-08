import { Message } from "discord.js";
import { hasRoulette, isPlayerInRoulette, resetBetAndRefund, rouletteState } from "../../funcs/rula.utils.ts";

export function rreset(message: Message, args: string[]) {
    if (!hasRoulette(message.channel.id)) {
        return message.reply("No hay una ruleta en este canal.");
    }
    if (!isPlayerInRoulette(message.channel.id, message.author.id)) {
        return message.reply("No puedes resetear la ruleta si has apostado.");
    }
    resetBetAndRefund(message.channel.id, message.author.id);
    return message.reply("Has reseteado tu apuesta.");
}