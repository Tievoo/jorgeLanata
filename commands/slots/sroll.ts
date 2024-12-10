import { Message, TextChannel } from "discord.js";
import { SlotGame } from "../../models/slot.ts";
import { addBalance, getBalance } from "../../funcs/casino.utils.ts";
import { isTievo } from "../../funcs/discord.utils.ts";

export function sroll(message: Message, args: string[]) {
    if (!isTievo(message.author.id)) {
        return (message.channel as TextChannel).send("ESTO ESTÁ EN ETAPA DE PRUEBA");
    }

    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
        return (message.channel as TextChannel).send("Pone un numero gilazo");
    }

    if (![100, 500].includes(bet)) {
        return (message.channel as TextChannel).send("Solo podes apostar 100 o 500");
    }

    if (getBalance(message.author.id) < bet) {
        return (message.channel as TextChannel).send("No tenes suficiente plata");
    }

    addBalance(message.author.id, -bet);

    SlotGame.run(parseInt(args[0]), message);
}
