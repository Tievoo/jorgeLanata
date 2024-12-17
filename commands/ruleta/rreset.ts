import { Message } from "discord.js";
import { rouletteState } from "../../funcs/rula.utils.ts";

export function rreset(message: Message, args: string[]) {
    if (!rouletteState.hasRoulette(message.channel.id)) {
        return message.reply("No hay una ruleta en este canal.");
    }
    if (!rouletteState.isPlayerInRoulette(message.channel.id, message.author.id)) {
        return message.reply("No puedes resetear la ruleta si no apostaste.");
    }

    rouletteState.resetBetAndRefund(message.channel.id, message.author.id, args);
    return message.reply("Has reseteado tu apuesta.");
}
