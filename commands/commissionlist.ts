import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { getCommissions } from "../funcs/casino.utils.ts";
import { kakeraEmoji } from "../funcs/discord.utils.ts";

export function commissionlist(message: Message, _: string[]) {
    const comms = getCommissions()
    return (message.channel as TextChannel).send({
        embeds: [embed(comms)]
    })
}

function embed(comms: Record<string, number>) {
    const embed = new EmbedBuilder();
    embed.setTitle("Comisiones");
    let description = "Comisiones de los usuarios:\n";

    for (const userId in comms) {
        description += `<@${userId}>: ${comms[userId]} ${kakeraEmoji} puntos de comisión\n`;
    }

    embed.setDescription(description);
    return embed;
}
