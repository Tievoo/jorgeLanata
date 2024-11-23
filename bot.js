import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { buildEmbedGeneral, buildEmbedForGame } from "./commands/sg.js";
dotenv.config();
export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
const { TOKEN } = process.env;

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
    
            await interaction.reply({content:`ahi va`, ephemeral: true});
    
            // Move user between it's actual channel and the target channel
            const times = 5;
            const prevId = member.voice.channelId;
            for (let i = 0; i < times; i++) {
                
                if(member.voice) await member.voice.setChannel(channel.id);
                if(member.voice) await member.voice.setChannel(prevId);
            }
        }
    });

    client.on('messageCreate', async (message) => {
        if (message.content.startsWith("$")) {
            const msg = message.content.slice(1);
            const [command, arg] = msg.split(" ");

            const rawData = readFileSync('./leaderboard.json');
            const top = JSON.parse(rawData);

            if (command === "sg") {
                
                if (arg) {
                    const embed = await buildEmbedForGame(top, arg);
                    await message.channel.send(embed);
                } else {
                    const embed = await buildEmbedGeneral(top);
                    await message.channel.send(embed);
                }
                
            }

            if (command === "sgl") {

            }
        }
    });
} catch (error) {
    console.error(error);
}

client.login(TOKEN);
