import { Message, TextChannel } from "discord.js";
import { isUserAdmin } from "../funcs/discord.utils.ts";
import { casinoDB } from "../database/manager.ts";

export function commsync(message: Message, _: string[]) {
    if (!isUserAdmin(message.member!)) {
        return (message.channel as TextChannel).send("No tenes permiso para hacer esto");
    }

    const casino = casinoDB.get();

    casino.commissions = {}

    casinoDB.set(casino);

    (message.channel as TextChannel).send("Comisiones reseteadas");
}
