import { Message } from "discord.js";
import { rouletteState } from "../../funcs/rula.utils.ts";
import { hasNoBalance } from "../../funcs/casino.utils.ts";

export async function rjoin(message: Message, _: string[]) {
    if (!rouletteState.hasRoulette(message.channel.id)) {
        return message.reply("No hay rula en este canal");
    }

    if (hasNoBalance(message.author.id)) {
        return message.reply("No tenes guita");
    }

    rouletteState.addPlayer(message.channel.id, message.author.id, message.author.username);

    await message.react("👍");
}
