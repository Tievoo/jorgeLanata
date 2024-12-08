import { Message, TextChannel } from "discord.js";
import { hasRoulette, isPlayerInRoulette, resetBets, RouletteNumberEmojis, rouletteState, usersWithoutBet } from "../../funcs/rula.utils.ts";
import { RouletteManager } from "../../models/roulette.ts";
import { addBalance } from "../../funcs/casino.utils.ts";
import { RoulettePlayer } from "../../types/casino.types.ts";

let nxt : number | null = null;
export function setNxt(n: number | null){
    nxt = n;
}

export function rroll(message: Message, args: string[]){
    // Esta funcion tira la rula
    if (!hasRoulette(message.channel.id)) {
        return message.reply("No hay rula en este canal");
    }

    if (!isPlayerInRoulette(message.channel.id, message.author.id)) {
        return message.reply("No estas en la rula");
    }

    const usersWOBet = usersWithoutBet(message.channel.id);
    if (usersWOBet.length > 0){
        return message.reply("Faltan apuestas de: " + usersWOBet.map(user => user.name).join(", "));
    }

    const result = nxt || Math.floor(Math.random() * 37);
    nxt = null;

    const roulette = rouletteState.get(message.channel.id);

    const winningPerUser : Record<string, number> = {};

    for (const player of Object.values(roulette!.players)) {
        const winning = RouletteManager.getFullPayout(player.bets, result);
        winningPerUser[player.id] = winning;
        addBalance(player.id, winning);
    }

    resetBets(message.channel.id);

    const winners = Object.values(roulette!.players).filter(player => winningPerUser[player.id] > 0) 

    return (message.channel as TextChannel).send({embeds: [embed(result, winners, winningPerUser)]});
}

function embed(result: number, winners: RoulettePlayer[], winningPerUser: Record<string, number>) {
    const docena = Math.floor(result / 12);
    const color = RouletteManager.BLACK.includes(result) ? "Negro" : RouletteManager.REDS.includes(result) ? "Rojo" : "Verde";
    const paridad = result === 0 ? "0" : result % 2 === 0 ? "Par" : "Impar" 

    const embedColor = {
        "Negro": 0x000000,
        "Rojo": 0xEF3F32,
        "Verde": 0x61AC43
    }

    let description = `Numero color **${color}**, de la **${docena+1} docena**, **${paridad}**.\n\n`

    if (winners.length) {
        description += "Ganadores:\n" + winners.map((player) => `**${player.name}**: ${winningPerUser[player.id]}`).join("\n")
    } else {
        description += "No hay ganadores."
    }

    return {
        title: "Salio el **numero** " + RouletteNumberEmojis[result],
        description ,
        color: embedColor[color]
    }
}