import { Message } from "discord.js";
import { findGameById } from "../funcs/find.utils.ts";
import { setActualGame } from "./givescrap.ts";
import { isUserAdmin } from "../funcs/discord.utils.ts";

const ARGS = 1;

export async function setgame(message: Message, args: string[]) {
    const id = args[0];

    if (!isUserAdmin(message.member!)) {
        return message.reply("`setgame` es para administradores");
    }
    
    if (args.length !== ARGS) {
        return message.reply("Sintaxis: $sg **<id | 'none'>** (id del juego)\nEste comando cambia el juego actual para dar kakera.\nSi se pone 'none', se desactiva la función.");
    }

    const game = findGameById(id);

    if (!game && id !== "none") {
        return message.reply("No se encontró el juego");
    }

    setActualGame(game?.id || null);
    await message.react("✅");
}
