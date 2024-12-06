import { client } from "../bot.js"

const ADMIN_CHANNEL = "790747207665319947"

export let pendingTrades = [];

export async function buy(message, args) {
    const amount = parseInt(args[0]);
    
    if (!amount) {
        return message.reply("Falta la cantidad");
    }

    if (isNaN(amount)) {
        return message.reply("La cantidad tiene que ser un número");
    }

    const admin_channel = await client.channels.fetch(ADMIN_CHANNEL);

    const cajeroMessage = await admin_channel.send("Che " + message.author.username + " quiere comprar " + amount + " de scrap quien le hace la segunda?");
    await cajeroMessage.react("✅");

    const filter = (reaction, user) => {
        return reaction.emoji.name === "✅" && user.id !== client.user.id;
    }

    const collector = cajeroMessage.createReactionCollector({ filter, time: 60000, max:1 });

    collector.on("collect", async (reaction, user) => {
        pendingTrades.push({
            cashier: user.id,
            buyer: message.author.id,
            amount
        });

        await cajeroMessage.channel.send("Bueno **" + user.username + "** le vendes **" + amount + "** de scrap a **" + message.author.username + "**, dale?");
    });

}
