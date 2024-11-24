import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { buildEmbedGeneral, buildEmbedForGame } from "./commands/sg.js";
dotenv.config();
export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
});
const { TOKEN } = process.env;

const MUDADE_USER_ID = "432610292342587392"

try {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "hola") {
            await interaction.reply("tu nariz contra mis bolas kuka");
        }

        if (interaction.commandName === "despertar") {
            const [member, channel] = [
                interaction.options.getMember("quien"),
                interaction.options.getChannel("vc"),
            ];

            if (!member.voice?.channelId) {
                return interaction.reply({
                    content: "no esta en vc",
                    ephemeral: true,
                });
            }

            if (member.voice.channelId === channel.id) {
                return interaction.reply({
                    content: "ya esta en ese canal",
                    ephemeral: true,
                });
            }

            if (member.voice.channelId !== interaction.member.voice.channelId) {
                return interaction.reply({
                    content: "no esta con vos en el canal de voz flaco",
                    ephemeral: true,
                });
            }

            await interaction.reply({ content: `ahi va`, ephemeral: true });

            // Move user between it's actual channel and the target channel
            const times = 5;
            const prevId = member.voice.channelId;
            for (let i = 0; i < times; i++) {

                if (member.voice) await member.voice.setChannel(channel.id);
                if (member.voice) await member.voice.setChannel(prevId);
            }
        }
    });

    client.on('messageCreate', async (message) => {
        if (message.content.startsWith("$")) {
            const msg = message.content.slice(1);
            const [command, ...args] = msg.split(" ");

            const rawData = readFileSync('./leaderboard.json');
            const top = JSON.parse(rawData);

            if (command === "sg") {

                if (args.length > 0) {
                    const embed = await buildEmbedForGame(top, args[0]);
                    await message.channel.send(embed);
                } else {
                    const embed = await buildEmbedGeneral(top);
                    await message.channel.send(embed);
                }

            }

            if (command === "sgl") {
                // TODO
            }

            if (command === "givescrap") {
                const [mention, amount] = args;
                const userId = mention.replace(/[<@!>]/g, '');

                const collectorFilter = (reaction, user) => {
                    return reaction.emoji.name == '✅' && user.id === MUDADE_USER_ID;
                };

                const collector = message.createReactionCollector({ filter: collectorFilter, max: 2, time: 60000 });

                collector.on('collect', async (reaction, user) => {
                    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                    const member = await message.guild.members.fetch(userId);
                    message.channel.send(`O sea, digamos, le diste ${amount} de scrap a ${member.nickname} (${member.user.username})`);
                });

            }
        }
    });
} catch (error) {
    console.error(error);
}

client.login(TOKEN);
