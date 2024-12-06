import { Message } from "discord.js";
import { addBalance } from "../funcs/casino.utils.ts";
import { pendingTrades } from "./buy.ts";

export async function load(message: Message, args: string[]) {

    if (args.length < 2) {
        return message.reply("Faltan argumentos");
    }
    const [mention, amountString] = args;
    const userId = mention.replace(/[<@!>]/g, "");
    const amount = parseInt(amountString) || 0;

    if (amount === 0) {
        return message.reply("Cantidad invalida");
    }

    const tradeIndex = pendingTrades.findIndex((trade) => trade.buyer === userId && trade.amount === amount && trade.cashier === message.author.id);

    if (tradeIndex === -1) {
        return message.reply("No se encontró la transacción");
    }

    pendingTrades.splice(tradeIndex, 1);

    addBalance(userId, amount);

    await message.reply("Listo");
}
