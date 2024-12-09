import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { addBalance, addCommissions } from "../funcs/casino.utils.ts";
import { pendingTrades } from "./buy.ts";
import { isUserAdmin } from "../funcs/discord.utils.ts";

const ARGS = 1;

export async function load(message: Message, args: string[]) {
    
    if (isUserAdmin(message.member!)) {
        return message.reply("`$load` es para administradores");
    }

    if (args.length !== ARGS) {
        return message.reply("Sintaxis: $load **<mención | id>** (mención/id a un usuario)\nEste comando carga los puntos pendientes de un usuario a su balance, se por un $sell o un $buy");
    }
    const [mention] = args;
    const userId = mention.replace(/[<@!>]/g, "");

    const trade = pendingTrades.get(userId);

    if (!trade) {
        return message.reply("No se encontró la transacción");
    }

    const { amount, buyer } = trade

    pendingTrades.delete(userId);

    addBalance(userId, amount);
    addCommissions(message.author.id, amount, buyer);

    await message.reply(`Se le ${ amount > 0 ? "cargaron" : "removieron"} ${Math.abs(amount)} puntos a <@${userId}>`);
}

export async function loadAll(message: Message, args: string[]) {
    const tradeIds = Object.keys(pendingTrades).filter((key) => pendingTrades.get(key)!.cashier === message.author.id);
    
    if (tradeIds.length === 0) {
        return message.react("❌");
    }

    let positives = "";
    let negatives = "";

    for (const userId of tradeIds) {
        const { buyer, amount } = pendingTrades.get(userId)!;
        
        addBalance(buyer, amount);
        addCommissions(message.author.id, amount, buyer);
        if (amount > 0) {
            positives += `<@${buyer}>: ${amount}\n`;
        }
        else {
            negatives += `<@${buyer}>: ${Math.abs(amount)}\n`;
        }

        pendingTrades.delete(userId);
    }

    if (negatives.length) {
        negatives = "Le sacaste puntos a:\n" + negatives;
    }

    if (positives.length) {
        positives = "Le cargaste puntos a:\n" + positives;
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
