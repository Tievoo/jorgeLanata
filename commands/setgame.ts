import { Message } from "discord.js";
import { findGameById } from "../funcs/find.utils.ts";
import { setActualGame } from "./givescrap.ts";

export async function setgame(message: Message, args: string[]) {
    const id = args[0];

    if (!id) {
        return message.reply("Falta el ID del juego");
    }

    const game = findGameById(id);

    if (!game && id !== "none") {
        return message.reply("No se encontró el juego");
    }

    setActualGame(game?.id || null);
    await message.react("✅");
}
