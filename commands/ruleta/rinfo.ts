import { Message } from "discord.js";
import { Roulette } from "../../types/casino.types.ts";
import { displayBet, getBet, getBetAmount, rouletteState } from "../../funcs/rula.utils.ts";

export async function rinfo(message: Message, args: string[]) {
    const roulette = rouletteState.get(message.channel.id)
    if (!roulette) {
        return message.reply("No hay una ruleta en este canal.");
    }
    return message.reply({embeds: [embed(roulette, message)]})
}

export function embed(roulette: Roulette, message: Message) {
    const playersThatBet: {id: string, amount: number}[] = []
    const playersThatDidntBet : string[] = []

    for (const userId in roulette.players) {
        const player = roulette.players[userId];
        if (player.bets.length > 0) {
            playersThatBet.push({id: player.id, amount: getBetAmount(player.bets)})
        } else {
            playersThatDidntBet.push(player.id)
        }
    }

    const bet = getBet(message.channel.id, message.author.id)

    return {
        title: "Información de la ruleta",
        description: `Ruleta activa en este canal. ${Object.keys(roulette.players).length} jugadores.\n\n`+
        (playersThatBet.length ? `Jugadores con apuestas:\n`+playersThatBet.map(player => `<@${player.id}>: ${player.amount}`).join(", ")+"\n\n" : "")+
        (playersThatDidntBet.length ? `Jugadores sin apuestas:\n${playersThatDidntBet.map(player => `<@${player}>`).join(", ")}\n` : "")+
        `Tu apuesta:\n`+
        `${bet.length ? displayBet(bet) : "No tenes apuesta"}`
    }
}

