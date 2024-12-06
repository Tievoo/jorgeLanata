import { Message, TextChannel } from "discord.js";
import { client } from "../bot.ts";
import { pendingTrades } from "./buy.ts";
import { getBalance } from "../funcs/casino.utils.ts";

const ADMIN_CHANNEL = "790747207665319947";

export async function sell(message: Message, args: string[]) {
    const amount = parseInt(args[0]);
    
    if (!amount) {
        return message.reply("Falta la cantidad");
    }

    if (isNaN(amount)) {
        return message.reply("La cantidad tiene que ser un número");
    }

    const balance = getBalance(message.author.id);
    if (balance < amount) {
        return message.reply("No tenes suficientes puntos");
    }

    const admin_channel = await client.channels.fetch(ADMIN_CHANNEL) as TextChannel;

    const cajeroMessage = await admin_channel.send("Che " + message.author.username + " quiere **vender** " + amount + " de scrap quien le hace la segunda?");
    await cajeroMessage.react("✅");

    const filter = (reaction, user) => {
        return reaction.emoji.name === "✅" && user.id !== client.user!.id;
    }

    const collector = cajeroMessage.createReactionCollector({ filter, time: 60000, max:1 });

    collector.on("collect", async (reaction, user) => {
        pendingTrades.push({
            cashier: user.id,
            buyer: message.author.id,
            amount: -amount
        });

        await cajeroMessage.channel.send("Bueno **" + user.username + "** le pasas **" + amount + "** de scrap a **" + message.author.username + "**, dale?");
    });
}
