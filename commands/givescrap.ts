import { MUDAE_USER_ID } from "../bot.ts";
import { Message, MessageReaction, User } from "discord.js";
import { leaderboardDB } from "../database/manager.ts";

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
    const leaderboard = leaderboardDB.get();

    if (!leaderboard[gameId]) return // Vemos

    const useridx = leaderboard[gameId].users.findIndex((user) => user.id === userId);

    if (useridx === -1) {
        leaderboard[gameId].users.push({ id: userId, amount });
    } else {
        leaderboard[gameId].users[useridx].amount += amount;
    }

    leaderboardDB.set(leaderboard);
}
