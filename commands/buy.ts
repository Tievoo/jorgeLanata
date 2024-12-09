import { Message, TextChannel } from "discord.js";
import { client } from "../bot.ts"
import { kakeraEmoji } from "../funcs/discord.utils.ts";

const ADMIN_CHANNEL = "790747207665319947"

type Trade = {
    cashier: string,
    buyer: string,
    amount: number
}
export let pendingTrades : Map<string, Trade> = new Map();

const ARGS = 1;

export async function buy(message : Message, args : string[]) {
    const amount = parseInt(args[0]);
    
    if (args.length !== ARGS) {
        return message.reply(`Sintaxis: $buy **<cantidad>**\nEste comando te permite **comprar** puntos de casino por **kakera**${kakeraEmoji}.\nUn **moderador** será notificado y te removera los kakera.`);
    }

    if (isNaN(amount)) {
        return message.reply("La cantidad tiene que ser un número");
    }

    const answer = await message.reply("Ok, se notificara a un cajero para que te saque " + amount + " de scrap por fichas");

    const admin_channel = await client.channels.fetch(ADMIN_CHANNEL) as TextChannel;

    const cajeroMessage = await admin_channel.send("Che " + message.author.username + " quiere **comprar** " + amount + " de scrap quien le hace la segunda?");
    await cajeroMessage.react("✅");

    const filter = (reaction, user) => {
        return reaction.emoji.name === "✅" && user.id !== client.user!.id;
    }

    const collector = cajeroMessage.createReactionCollector({ filter, time: 60000, max:1 });

    collector.on("collect", async (reaction, user) => {
        pendingTrades.set(user.id, {
            cashier: user.id,
            buyer: message.author.id,
            amount
        });

        await cajeroMessage.channel.send(`Bueno **${user.username}** le vendes **${amount}** de fichas a **${message.author.username}**, dale?`);
        await answer.edit(`El moderador **${user.username}** acepto tu compra, te removera ${amount} de kakera por fichas`);
    });

}
