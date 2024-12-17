import { Message } from "discord.js";
import { rouletteState } from "../../funcs/rula.utils.ts";

export async function rexit(message: Message, _: string[]) {
    const roulette = rouletteState.getRoulette(message.channel.id);

    if (!roulette) {
        return message.reply("No hay rula en este canal");
    }

    rouletteState.removePlayer(message.channel.id, message.author.id);
    await message.react("👍");
}
