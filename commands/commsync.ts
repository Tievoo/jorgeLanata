import { Message, TextChannel } from "discord.js";
import { isUserAdmin } from "../funcs/discord.utils";
import { getCasino, saveCasino } from "../funcs/casino.utils";

export function commsync(message: Message, args: string[]) {
    if (!isUserAdmin(message.member!)) {
        return (message.channel as TextChannel).send("No tenes permiso para hacer esto");
    }

    const casino = getCasino();

    casino.commissions = {}

    saveCasino(casino);

    (message.channel as TextChannel).send("Comisiones reseteadas");
}
