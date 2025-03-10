import { Message, MessageReaction, TextChannel, User } from "discord.js";
import { rouletteState } from "../../funcs/rula.utils.ts";
import { hasNoBalance } from "../../funcs/casino.utils.ts";
import { ROULETTE_MIN } from "../../types/consts.ts";

export async function rula(message: Message, _: string[]) {
    if (rouletteState.hasRoulette(message.channel.id)) {
        return message.reply("Ya hay una rula en este canal");
    }

    rouletteState.startRoulette(message.channel.id);
    const response = await (message.channel as TextChannel).send({ embeds: [embed()] });
    await response.react("👍")
    
    const filter = (reaction: MessageReaction, user: User) => {
        return reaction.emoji.name === '👍' && !user.bot;
    };

    const collector = response.createReactionCollector({ filter, time: 20000 });

    collector.on('collect', async (_, user) => {
        if (hasNoBalance(user.id)) {
            return (message.channel as TextChannel).send("No se puede anotar un usuario sin guita");
        }
        rouletteState.addPlayer(message.channel.id, user.id, user.username);
        await (message.channel as TextChannel).send("Se anoto " + user.username);
    });

    collector.on('end', _ => {
        const roulette = rouletteState.getRoulette(message.channel.id);
        const playerNames = Object.values(roulette!.players).map(player => player.name);

        if (playerNames.length === 0) {
            return (message.channel as TextChannel).send("No se anoto nadie");
        }
    });

}

export function rhelp(message: Message, _: string[]) {
    return (message.channel as TextChannel).send({ embeds: [embed(true)] });
}


function embed(help: boolean = false) {
    return {
        title: "Juego de Ruleta",
        description: "Juego de ruleta americana de 37 numeros. Comandos:\n" +
            "**$rula** - Inicia una ruleta en el canal\n" +
            "**$rjoin** - Se une a la ruleta\n" +
            "**$rexit** - Salirse de la ruleta\n" +
            "**$rbet** - Realiza una apuesta. Sintaxis: $rbet **<apuesta>**:**<valor>**\n" +
            "Los valores son **red**, **black**, **even**, **odd**, **first**, **second**, **third** (primera, segunda y tercera docena), **firstcol**, **secondcol**, **thirdcol**" +
            " (columnas, ver donde dice **2 to 1** en la foto) " +
            " **low** (1-18), **high** (19-36), y <0-36> para numero.\nPara apostar en el medio entre dos numeros, se usa **<numero>.<numero>**\n" +
            `La apuesta minima es de ${ROULETTE_MIN}, y el maximo es ${ROULETTE_MIN*50} para los numeros y ${ROULETTE_MIN*500} para las otras apuestas.\n`+
            "**$rroll** - Gira la ruleta y muestra el resultado\n" +
            "**$rreset** - Cancela tu apuesta y devuelve el valor a tu balance\n" +
            "**$rbetd** - Duplica tu apuesta actual\n" +
            "**$rbetr** - Repite tu apuesta anterior\n\n\n"+
            (help ? "" : "Para unirse a la ruleta, usa el comando $rjoin o reacciona con 👍 en este mensaje."),
        color: 0x00ff00,
        image: {
            url: "https://i.imgur.com/qbIX9FQ.png"
        }
    }
}
