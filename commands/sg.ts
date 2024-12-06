import { sumUserPoints, buildEmbed } from '../funcs/embed.utils.ts';
import { findGameById } from '../funcs/find.utils.ts';
import { readFileSync } from 'node:fs';
import { Top } from '../types/db.types.ts';
import { Message, TextChannel } from 'discord.js';

export async function buildEmbedGeneral(top: Top) {
    const userPoints = await sumUserPoints(top);
    const embed = await buildEmbed(userPoints, "🏆 GENERAL");
    return { embeds: [embed] };
}

export async function buildEmbedForGame(top: Top, gameName: string) {
    const game = findGameById(gameName);

    if (!game) {
        return "No se encontró el juego"
    }

    const gameData = top[game.id];

    const userPoints = {};

    for (const user of gameData.users) {
        if (!userPoints[user.id]) {
            userPoints[user.id] = 0;
        }
        userPoints[user.id] += user.amount;
    }
    const embed = await buildEmbed(userPoints, `🏆 ${game.name}`, game.logo, game.color);
    return { embeds: [embed] };
}

export async function sg(message: Message, args: string[]) {

    const rawData = readFileSync('./database/leaderboard.json', 'utf-8');
    const top = JSON.parse(rawData);
    let embed: { embeds: any[]; } | string; 

    if (args.length > 0) {
        embed = await buildEmbedForGame(top, args[0]);
    } else {
        embed = await buildEmbedGeneral(top);
    }
    await (message.channel as TextChannel).send(embed);

}
