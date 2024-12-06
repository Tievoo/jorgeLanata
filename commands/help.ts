import { Message, TextChannel } from "discord.js";

const commandDescriptions = {
    "$scraptop ($st)": "Muestra el top de puntos de los usuarios. Se puede mandar con un argumento para ver el top de un juego en específico",
    "$commissionlist ($cl)": "Muestra las comisiones de los usuarios",
    "$buy": "Compra fichas de casino por kakera",
    "$sell": "Vende fichas de casino por kakera",
    "$balance ($bl)": "Muestra tu balance de fichas de casino",
    "$setgame ($sg)": "(ADMIN-ONLY) Cambia el juego actual para dar kakera",
    "$load ($lo)": "(ADMIN-ONLY) Carga las transacciones de un usuario",
    "$loadall ($la)": "(ADMIN-ONLY) Carga todas las transacciones pendientes",
}

export function help(message: Message, args: string[]) {
    let ans = "**Comandos disponibles:**\n";
    for (const key in commandDescriptions) {
        ans += `**${key}**: ${commandDescriptions[key]}\n`;
    }
    (message.channel as TextChannel).send(ans);
}
