import { APIEmbed, Message } from "discord.js";
import { Bet, Roulette } from "../../types/casino.types.ts";
import { getBetAmount, rouletteState } from "../../funcs/rula.utils.ts";
import { RouletteNumberEmojis } from "../../types/consts.ts";
import { BetDisplay } from "../../models/BetDisplay.ts";

export function rinfo(message: Message, _: string[]) {
    const roulette = rouletteState.getRoulette(message.channel.id)
    if (!roulette) {
        return message.reply("No hay una ruleta en este canal.");
    }

    return embed(roulette, message)
}

function embed(roulette: Roulette, message: Message) {
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

    if (rouletteState.isPlayerInRoulette(message.channel.id, message.author.id)) {
        bet = rouletteState.getBet(message.channel.id, message.author.id)
    } else bet = null

    const totalPlayers = Object.keys(roulette.players).length

    const embed : APIEmbed = {
        title: "Información de la ruleta",
        description: `Ruleta activa en este canal. ${totalPlayers} jugadores.\n\n`+
        (playersThatBet.length ? `Jugadores con apuestas:\n`+playersThatBet.map(player => `<@${player.id}>: ${player.amount}`).join(", ")+"\n\n" : "")+
        (playersThatDidntBet.length ? `Jugadores sin apuestas:\n${playersThatDidntBet.map(player => `<@${player}>`).join(", ")}\n` : "")+
        `Ultimos resultados:\n${roulette.lastResults.peekAmount(15).map(n=> RouletteNumberEmojis[n]).join(" ")}\n\n`+
        ((totalPlayers > 0 && totalPlayers === playersThatBet.length) ? "\n**Todos los jugadores apostaron**. Usa **$rroll** para girar la ruleta!\n" : "")+
        `Tu apuesta:\n`+
        `${bet ? (bet.length ? "" : "No tenes apuesta") : "No estas en la ruleta"}`
    }

    if (bet) {
        const attachment = BetDisplay.fromBet(bet)
        embed.image = {url: `attachment://${attachment.name}`}
        return message.reply({embeds: [embed], files: [attachment]})
    }

    return message.reply({embeds: [embed]})
}

