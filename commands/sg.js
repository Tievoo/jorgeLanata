import { sumUserPoints, buildEmbed } from '../funcs/embed.utils.js';

export async function buildEmbedGeneral(top) {
    const userPoints = await sumUserPoints(top);
    const embed = await buildEmbed(userPoints, "🏆 GENERAL");
    return { embeds: [embed] };
}

export async function buildEmbedForGame(top, gameName) {
    if (!top[gameName.toLowerCase()]) {
        return "No se encontró el juego"
    }

    const gameData = top[gameName.toLowerCase()];
    const gameLogo = gameData.logo;
    const gameColor = gameData.color;

    const userPoints = {};

    for (const user of gameData.users) {
        if (!userPoints[user.id]) {
            userPoints[user.id] = 0;
        }
        userPoints[user.id] += user.amount;
    }
    const embed = await buildEmbed(userPoints, `🏆 ${gameName.toUpperCase()}`, gameLogo, gameColor);
    return { embeds: [embed] };
}
