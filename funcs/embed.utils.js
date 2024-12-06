// utils.js
import { EmbedBuilder } from "discord.js";
import { client } from "../bot.js";

export async function sumUserPoints(top) {
    const userPoints = {};

    for (const game of Object.keys(top)) {
        for (const user of top[game].users) {
            if (!userPoints[user.id]) {
                userPoints[user.id] = 0;
            }
            userPoints[user.id] += user.amount;
        }
    }

    return userPoints;
}

export async function buildEmbed(userPoints, title, logo, color) {
    const embed = new EmbedBuilder();

    const users = Object.keys(userPoints);
    const sortedUsers = users.sort((a, b) => userPoints[b] - userPoints[a]);

    const total = sortedUsers.reduce((acc, userId) => acc + userPoints[userId], 0);

    let description = `**TOTAL:** ${total} <:kakera:1309807660987846686>\n‎\n`;


    const topPlayer = await client.users.fetch(sortedUsers[0]);

    sortedUsers.forEach((userId, index) => {
        const user = userPoints[userId];
        description += `${numberToEmoji(index + 1)} - <@${userId}> - ${user} <:kakera:1309807660987846686> \n`;
    });

    embed.setAuthor({
        name: title,
        iconURL: logo,
    });
    embed.setColor( color || "#670c09");
    embed.setDescription(description);
    embed.setThumbnail(topPlayer.displayAvatarURL());

    return embed;
}

function numberToEmoji(number) {
    const emojis = {
        1: ":first_place:",
        2: ":second_place:",
        3: ":third_place:",
    };

    return emojis[number] || `**#${number}**`;
}
