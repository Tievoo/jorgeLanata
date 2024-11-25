import { stringSelectForGames } from "../funcs/find.utils.js";
import { MUDADE_USER_ID } from "../bot.js";
import { readFileSync, writeFileSync } from "fs";

export async function givescrap(message, args) {
    const [mention, amountString] = args;
    const userId = mention.replace(/[<@!>]/g, "");
    const amount = parseInt(amountString) || 0;

    const collectorFilter = (reaction, user) => {
        return reaction.emoji.name == "✅" && user.id === MUDADE_USER_ID;
    };

    const reacted = await message.awaitReactions({
        filter: collectorFilter,
        max: 1,
        time: 30000,
    }).catch((_) => null)

    if (!reacted) return;


    const member = await message.guild.members.fetch(userId);
    const response = await message.channel.send({
        content: `O sea, digamos, le diste ${amount} de scrap a ${member.nickname} (${member.user.username}). Para que juego?`,
        components: [stringSelectForGames()],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;

    const interacted = await response.awaitMessageComponent({ filter, max:1, time: 30000 }).catch((_) => null);

    if (!interacted) return;
    
    const gameId = interacted.values[0];

    addToUserId(userId, gameId, amount);

    await interacted.reply({ content: "Listo", ephemeral: true });

}

const addToUserId = (userId, gameId, amount) => {
    const rawData = readFileSync('./leaderboard.json');
    const top = JSON.parse(rawData);

    if (!top[gameId]) return // Vemos

    const useridx = top[gameId].users.findIndex((user) => user.id === userId);

    if (useridx === -1) {
        top[gameId].users.push({ id: userId, amount });
    } else {
        top[gameId].users[useridx].amount += amount;
    }

    writeFileSync('./leaderboard.json', JSON.stringify(top, null, 4));
}
