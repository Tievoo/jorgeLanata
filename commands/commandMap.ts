import { sg } from "./sg.ts";
import { givescrap } from "./givescrap.ts";
import { buy } from "./buy.ts";
import { balance } from "./balance.ts";
import { load, loadAll } from "./load.ts";
import { Message } from "discord.js";
import { setgame } from "./setgame.ts";
import { cl } from "./cl.ts";
import { sell } from "./sell.ts";

type Command = (message: Message, args: string[]) => void;

const commandMap : Record<string, Command> = {
    "sg" : sg,
    "givescrap" : givescrap,
    "buy": buy,
    "balance": balance,
    "load": load,
    "setgame": setgame,
    "cl": cl,
    "loadall": loadAll,
    "sell": sell
}

export function executeCommand(message: Message) {
    const msg = message.content.slice(1);
    const [command, ...args] = msg.split(" ");

    if (commandMap[command]) {
        commandMap[command](message, args);
    }
}
