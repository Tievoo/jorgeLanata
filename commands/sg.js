import { sumUserPoints, buildEmbed } from '../funcs/embed.utils.js';
import { findGameById } from '../funcs/find.utils.js';
import { readFileSync } from 'fs';

export async function buildEmbedGeneral(top) {
    const userPoints = await sumUserPoints(top);
    const embed = await buildEmbed(userPoints, "🏆 GENERAL");
    return { embeds: [embed] };
}

export async function buildEmbedForGame(top, gameName) {
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

export async function sg(message, args) {

    const rawData = readFileSync('./leaderboard.json');
    const top = JSON.parse(rawData);

    if (args.length > 0) {
        const embed = await buildEmbedForGame(top, args[0]);
        await message.channel.send(embed);
    } else {
        const embed = await buildEmbedGeneral(top);
        await message.channel.send(embed);
    }
}
