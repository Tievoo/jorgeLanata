import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import fs from "fs";

export function findGameById(id) {
    const data = JSON.parse(fs.readFileSync("./games.json"));
    return data.find((game) => game.id === id.toLowerCase());
}

export function stringSelectForGames() {
    const data = JSON.parse(fs.readFileSync("./games.json"));
    const select = new StringSelectMenuBuilder()
        .setCustomId("gamelist")
        .setPlaceholder("Selecciona un juego")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            [
                ...data.map((game) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(game.name)
                        .setValue(game.id)
                ),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Otro")
                    .setValue("other")
                    .setDescription("(no anda esto todavia)")
            ]
        );

    return new ActionRowBuilder().addComponents(select);
}
    