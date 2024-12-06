import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { addBalance, addCommissions } from "../funcs/casino.utils.ts";
import { pendingTrades } from "./buy.ts";

export async function load(message: Message, args: string[]) {

    if (args.length < 1) {
        return message.reply("Faltan argumentos");
    }
    const [mention] = args;
    const userId = mention.replace(/[<@!>]/g, "");

    const tradeIndex = pendingTrades.findIndex((trade) => trade.buyer === userId && trade.cashier === message.author.id);

    if (tradeIndex === -1) {
        return message.reply("No se encontró la transacción");
    }

    const { amount } = pendingTrades[tradeIndex];

    pendingTrades.splice(tradeIndex, 1);

    addBalance(userId, amount);
    addCommissions(message.author.id, amount);

    await message.reply(`Se le ${ amount > 0 ? "cargaron" : "removieron"} ${Math.abs(amount)} puntos a <@${userId}>`);
}

export async function loadAll(message: Message, args: string[]) {
    const tradeIndexes = pendingTrades.map((trade, index) => trade.cashier === message.author.id ? index : -1).filter((index) => index !== -1);
    
    if (tradeIndexes.length === 0) {
        return message.react("❌");
    }

    let positives = "";
    let negatives = "";

    for (const index of tradeIndexes) {
        const { buyer, amount } = pendingTrades[index];
        
        addBalance(buyer, amount);
        addCommissions(message.author.id, amount);
        if (amount > 0) {
            positives += `<@${buyer}>: ${amount}\n`;
        }
        else {
            negatives += `<@${buyer}>: ${Math.abs(amount)}\n`;
        }
    }

    if (negatives.length) {
        negatives = "Le sacaste puntos a:\n" + negatives;
    }

    if (positives.length) {
        positives = "Le cargaste puntos a:\n" + positives;
    }

    for (const index of tradeIndexes) {
        pendingTrades.splice(index, 1);
    }

    const embed = new EmbedBuilder();

    embed.setTitle("Carga de puntos");
    embed.setDescription(
        negatives + '\n' + positives
    );

    await (message.channel as TextChannel).send({
        embeds: [embed]
    });

}
