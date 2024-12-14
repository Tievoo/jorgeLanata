import { Message, TextChannel } from "discord.js";
import { SlotGame } from "../../models/slot.ts";

export function shelp(message: Message, _: string[]) {
    (message.channel as TextChannel).send({ embeds: [embed()] });
}

function embed() {
    let description = `**La maquinita de las slots pibe!**\nSe tira con **$sroll**, con 10, 50, 100 o 500.\n\n`;

    for (const slot of SlotGame.emojiWeights) {
        description += `${slot.icon} - **${slot.weight}%**. Paga **x${slot.three}** con ${slot.icon}${slot.icon}${slot.icon}, paga **x${slot.two}** con ${slot.icon}${slot.icon}-\n`;
    }

    description += `Al caer 2 iguales **comunes** (🍒, 🍋, 🍇, 🍊) y el tercero es una 🌟, el pago se multiplica **x1.5**.\n`;

    return {
        title: "Slots",
        description
    }
}
