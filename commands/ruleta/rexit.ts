import { Message } from "discord.js";
import { rouletteState } from "../../funcs/rula.utils.ts";

export async function rexit(message: Message, _: string[]) {
    if (!rouletteState.hasRoulette(message.channel.id)) {
        return message.reply("No hay rula en este canal");
    }

    rouletteState.removePlayer(message.channel.id, message.author.id);
    await message.react("👍");
}
