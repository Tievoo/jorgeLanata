import { StringSelectMenuBuilder } from "discord.js";
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
        .addOptions(data.map((game) => {
            return {
                label: game.name,
                value: game.id,
            }
        }));

    return select;
}
    