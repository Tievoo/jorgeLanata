import { leaderboardDB } from '../database/manager.ts';
import { sumUserPoints, buildEmbed } from '../funcs/embed.utils.ts';
import { findGameById } from '../funcs/find.utils.ts';
import { Leaderboard } from '../types/db.types.ts';
import { Message, TextChannel } from 'discord.js';

export async function buildEmbedGeneral(top: Leaderboard) {
    const userPoints = await sumUserPoints(top);
    const embed = await buildEmbed(userPoints, "🏆 GENERAL");
    return { embeds: [embed] };
}

export async function buildEmbedForGame(top: Leaderboard, gameName: string) {
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

export async function scraptop(message: Message, args: string[]) {
    const leaderboard = leaderboardDB.get();
    let embed: { embeds: any[]; } | string; 

    if (args.length > 0) {
        embed = await buildEmbedForGame(leaderboard, args[0]);
    } else {
        embed = await buildEmbedGeneral(leaderboard);
    }
    await (message.channel as TextChannel).send(embed);

}
