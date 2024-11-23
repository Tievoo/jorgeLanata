import { ChannelType } from "discord-api-types/v10";
import { REST, Routes, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_ID, TOKEN } = process.env;

const commands = [
    {
        name: "hola",
        description: "Saluda al bot",
    },
    new SlashCommandBuilder()
        .setName("despertar")
        .setDescription("move un boludo así se saca el deafen")
        .addUserOption(option =>
            option
                .setName("quien")
                .setDescription("El usuario al que se le voy a revolver el avispero")
                .setRequired(true)
        )
        .addChannelOption( option =>
            option.setName("vc")
                .setDescription("Donde lo voy rebotando")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        )
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}
