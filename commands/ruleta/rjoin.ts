import { Message } from "discord.js";
import { addPlayerToRoulette, rouletteState } from "../../funcs/rula.utils.ts";
import { hasNoBalance } from "../../funcs/casino.utils.ts";

export async function rjoin(message: Message, _: string[]) {
    const roulette = rouletteState[message.channel.id];

    if (!roulette) {
        return message.reply("No hay rula en este canal");
    }

    if (hasNoBalance(message.author.id)) {
        return message.reply("No tenes guita");
    }

    addPlayerToRoulette(message.channel.id, message.author.id, message.author.username);

    await message.react("👍");
}
