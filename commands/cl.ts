import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { getCommissions } from "../funcs/casino.utils.ts";

export function cl(message: Message, args: string[]) {
    const comms = getCommissions()
    return (message.channel as TextChannel).send({
        embeds: [embed(comms)]
    })
}

function embed(comms: Record<string, number>) {
    const embed = new EmbedBuilder();
    embed.setTitle("Comisiones");
    let description = "";

    for (const userId in comms) {
        description += `<@${userId}>: ${comms[userId]} <:kakera:1309807660987846686> puntos de comisión\n`;
    }

    embed.setDescription(description);
    return embed;
}
