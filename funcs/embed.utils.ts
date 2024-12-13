// utils.js
import { EmbedBuilder, HexColorString } from "discord.js";
import { client } from "../bot.ts";
import { Leaderboard } from "../types/db.types.ts";
import { kakeraEmoji } from "./discord.utils.ts";

export type UserPoints = Record<string, number>;

export function sumUserPoints(top: Leaderboard) : UserPoints {	
    const userPoints : UserPoints = {};

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

export async function buildEmbed(userPoints: UserPoints, title:string , logo? : string, color?: HexColorString) {
    const embed = new EmbedBuilder();

    const users = Object.keys(userPoints);
    const sortedUsers = users.sort((a, b) => userPoints[b] - userPoints[a]);

    const total = sortedUsers.reduce((acc, userId) => acc + userPoints[userId], 0);

    let description = `**TOTAL:** ${total} ${kakeraEmoji}\n‎\n`;



    sortedUsers.forEach((userId, index) => {
        const user = userPoints[userId];
        description += `${numberToEmoji(index + 1)} - <@${userId}> - ${user} ${kakeraEmoji} \n`;
    });

    embed.setAuthor({
        name: title,
        iconURL: logo,
    });
    embed.setColor(color || "#670c09");
    embed.setDescription(description);
    
    if (sortedUsers.length > 0) {
        const topPlayer = await client.users.fetch(sortedUsers[0]);
        embed.setThumbnail(topPlayer.displayAvatarURL());
    }

    return embed;
}

function numberToEmoji(number: number) {
    const emojis : Record<number,string> = {
        1: ":first_place:",
        2: ":second_place:",
        3: ":third_place:",
    };

    return emojis[number] || `**#${number}**`;
}
