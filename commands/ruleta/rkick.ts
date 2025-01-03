import { Message } from "discord.js";
import { rouletteState } from "../../funcs/rula.utils.ts";
import { isUserAdmin } from "../../funcs/discord.utils.ts";

export function rkick(message: Message, _: string[]) {
    const member = message.mentions.members?.first();

    if (!isUserAdmin(message.member!)) {
        message.reply("No tienes permisos para hacer eso");
        return;
    }

    if (!member) {
        message.reply("No se ha mencionado a un usuario");
        return;
    }

    if (member.id === message.author.id) {
        message.reply("Tira rexit para eso boludazo");
        return;
    }
    
    if (!rouletteState.isPlayerInRoulette(message.channel.id, member.id)) {
        message.reply("El usuario no está en la ruleta");
        return;
    }

    rouletteState.removePlayer(message.channel.id, member.id);
    message.reply("El usuario ha sido expulsado de la ruleta");
}
