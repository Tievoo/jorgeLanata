import { Message, TextChannel } from "discord.js";
import { client } from "../bot.ts";
import { pendingTrades } from "./buy.ts";
import { getBalance } from "../funcs/casino.utils.ts";
import { kakeraEmoji } from "../funcs/discord.utils.ts";

const ADMIN_CHANNEL = "1317363297841975337";

const ARGS = 1;

export async function sell(message: Message, args: string[]) {
    const amount = parseInt(args[0]);

    if (args.length !== ARGS) {
        return message.reply(`Sintaxis: $sell **<cantidad>**\nEste comando te permite **vender** tus puntos de casino por **kakera**${kakeraEmoji}.\nUn **moderador** será notificado y te proveerá los kakera.`);
    }

    if (isNaN(amount)) {
        return message.reply("La cantidad tiene que ser un número");
    }

    const balance = getBalance(message.author.id);
    if (balance < amount) {
        return message.reply("No tenes suficientes puntos");
    }

    const answer = await message.reply("Ok, se notificara a un cajero para que te de " + amount + " de kakeras por tus fichas");

    const admin_channel = await client.channels.fetch(ADMIN_CHANNEL) as TextChannel;

    const cajeroMessage = await admin_channel.send("Che " + message.author.username + " quiere **vender** " + amount + " de scrap quien le hace la segunda?");
    await cajeroMessage.react("✅");

    const filter = (reaction, user) => {
        return reaction.emoji.name === "✅" && user.id !== client.user!.id;
    }

    const collector = cajeroMessage.createReactionCollector({ filter, time: 60000, max: 1 });

    collector.on("collect", async (reaction, user) => {
        pendingTrades.set(user.id, {
            cashier: user.id,
            buyer: message.author.id,
            amount: -amount
        });

        await cajeroMessage.channel.send("Bueno **" + user.username + "** le pasas **" + amount + "** de scrap a **" + message.author.username + "**, dale?");
        await answer.edit(`El moderador **${user.username}** acepto tu venta, te removera ${amount} de fichas por kakera`);
    });
}
