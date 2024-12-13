import { Message } from "discord.js";
import { addBetsToPlayer, displayBet, getBet, getPrevBet, isPlayerInRoulette, parseBet, resetBetAndRefund } from "../../funcs/rula.utils.ts";
import {  getBalance } from "../../funcs/casino.utils.ts";
import { Bet } from "../../types/casino.types.ts";
import { ROULETTE_MIN } from "../../models/roulette.ts";

export function rbet(message: Message, args: string[], repeat?: boolean, double?: boolean) {
    if (!isPlayerInRoulette(message.channel.id, message.author.id)) {
        return message.reply("No estas en la rula");
    }

    let parsedBet: Bet[];

    try {
        if (repeat) {
            const lastBet = getPrevBet(message.channel.id, message.author.id);
            resetBetAndRefund(message.channel.id, message.author.id, []);
            parsedBet = lastBet;
        }
        else if (double) {
            const lastBet = getBet(message.channel.id, message.author.id);
            parsedBet = lastBet;
        }
        
        else {
            const all : number = getBalance(message.author.id);
            parsedBet = parseBet(args, all);
        }
    } catch (error) {
        if ((error as Error).message === "Low bet") {
            return message.reply("Apuesta minima " + ROULETTE_MIN);
        }
        return message.reply("Apuesta invalida tarado");
    }

    const amount = parsedBet.reduce((acc: number, bet: Bet) => acc + bet.amount, 0);

    if (amount > getBalance(message.author.id)) {
        return message.reply("No tenes plata suficiente");
    }

    addBetsToPlayer(
        message.channel.id,
        message.author.id,
        parsedBet
    )

    const actualBet = getBet(message.channel.id, message.author.id)

    message.reply(`**Apuesta realizada**. Tu apuesta actual:\n${displayBet(actualBet)}`);
}
