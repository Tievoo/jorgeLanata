import { Message } from "discord.js";
import { Bet, Roulette } from "../../types/casino.types.ts";
import { displayBet, getBet, getBetAmount, isPlayerInRoulette, rouletteState } from "../../funcs/rula.utils.ts";

export async function rinfo(message: Message, args: string[]) {
    const roulette = rouletteState.get(message.channel.id)
    if (!roulette) {
        return message.reply("No hay una ruleta en este canal.");
    }

    // if (!isPlayerInRoulette(message.channel.id, message.author.id)) {
    //     return message.reply("No estas en la ruleta de este canal.");
    // }
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

    let bet : Bet[] | null = []

    if (isPlayerInRoulette(message.channel.id, message.author.id)) {
        bet = getBet(message.channel.id, message.author.id)
    } else bet = null

    let totalPlayers = Object.keys(roulette.players).length

    return {
        title: "Información de la ruleta",
        description: `Ruleta activa en este canal. ${totalPlayers} jugadores.\n\n`+
        (playersThatBet.length ? `Jugadores con apuestas:\n`+playersThatBet.map(player => `<@${player.id}>: ${player.amount}`).join(", ")+"\n\n" : "")+
        (playersThatDidntBet.length ? `Jugadores sin apuestas:\n${playersThatDidntBet.map(player => `<@${player}>`).join(", ")}\n` : "")+
        `Tu apuesta:\n`+
        `${bet ? (bet.length ? displayBet(bet) : "No tenes apuesta") : "No estas en la ruleta"}` +
        ((totalPlayers > 0 && totalPlayers === playersThatBet.length) ? "\n**Todos los jugadores apostaron**. Usa **$rroll** para girar la ruleta!" : "")
    }
}

