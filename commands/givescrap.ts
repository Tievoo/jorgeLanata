import { MUDAE_USER_ID } from "../bot.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { Message, MessageReaction, User } from "discord.js";

let actualGame : string | null = null;

export function setActualGame(gameId : string | null) {
    actualGame = gameId;
}

export async function givescrap(message : Message, args : string[]) {
    const [mention, amountString] = args;
    const userId = mention.replace(/[<@!>]/g, "");
    const amount = parseInt(amountString) || 0;

    const collectorFilter = (reaction : MessageReaction, user : User) => {
        return reaction.emoji.name == "✅" && user.id === MUDAE_USER_ID;
    };

    const reacted = await message.awaitReactions({
        filter: collectorFilter,
        max: 1,
        time: 30000,
    }).catch((_) => null)

    if (!reacted || !actualGame) return;

    addToUserId(userId, actualGame, amount);

    await message.reply(`Agregamos ${amount} al vago ese en \`${actualGame}\``);

}

const addToUserId = (userId : string, gameId : string, amount : number) => {
    const rawData = readFileSync('./database/leaderboard.json', 'utf-8');
    const top = JSON.parse(rawData);

    if (!top[gameId]) return // Vemos

    const useridx = top[gameId].users.findIndex((user: User) => user.id === userId);

    if (useridx === -1) {
        top[gameId].users.push({ id: userId, amount });
    } else {
        top[gameId].users[useridx].amount += amount;
    }

    writeFileSync('./database/leaderboard.json', JSON.stringify(top, null, 4));
}
