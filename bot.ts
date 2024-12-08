import { Client, GatewayIntentBits, GuildMember, VoiceChannel } from "discord.js";
import dotenv from "dotenv";
import { executeCommand } from "./commandMap.ts";
import { isUserAdmin } from "./funcs/discord.utils.ts";
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

export const MUDAE_USER_ID = "432610292342587392"

try {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user!.tag}!`);
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "hola") {
            await interaction.reply("tu nariz contra mis bolas kuka");
        }

        if (interaction.commandName === "cortar") {
            const member = interaction.options.getMember("quien") as GuildMember;

            if (!member?.voice?.channelId) {
                return interaction.reply({
                    content: "no esta en vc",
                    ephemeral: true,
                });
            }

            if (!isUserAdmin(interaction.member as GuildMember)) {
                return interaction.reply({
                    content: "no tenes permisos",
                    ephemeral: true,
                });
            }

            await interaction.reply({ content: "ahi va", ephemeral: true });

            for (let i = 0; i < 5; i++) {
                await member.voice.setMute(true);
                await member.voice.setMute(false);
            }

        }

        if (interaction.commandName === "despertar") {
            const [member, channel] = [
                interaction.options.getMember("quien"),
                interaction.options.getChannel("vc"),
            ] as [GuildMember, VoiceChannel]


            if (!member?.voice?.channelId) {
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

            if (member.voice.channelId !== (interaction.member as GuildMember)?.voice.channelId) {
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
            executeCommand(message);
        }
    });
} catch (error) {
    console.error(error);
}

client.login(TOKEN);
