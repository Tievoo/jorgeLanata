import { scraptop } from "./commands/scraptop.ts";
import { givescrap } from "./commands/givescrap.ts";
import { buy } from "./commands/buy.ts";
import { balance } from "./commands/balance.ts";
import { load, loadAll } from "./commands/load.ts";
import { Message } from "discord.js";
import { setgame } from "./commands/setgame.ts";
import { commissionlist } from "./commands/commissionlist.ts";
import { sell } from "./commands/sell.ts";
import { help } from "./commands/help.ts";

type Command = (message: Message, args: string[]) => void;

const commandMap : Record<string, Command> = {
    "st" : scraptop,
    "scraptop" : scraptop,

    "givescrap" : givescrap,
    "givescraps" : givescrap,

    "buy": buy,

    "bl": balance,
    "balance": balance,

    "sg": setgame,
    "setgame": setgame,

    "cl": commissionlist,
    "commissionlist": commissionlist,

    "lo": load,
    "load": load,

    "la": loadAll,
    "loadall": loadAll,

    "sell": sell,

    "lh": help,
    "lhelp": help,
}

export function executeCommand(message: Message) {
    const msg = message.content.slice(1);
    const [command, ...args] = msg.split(" ");

    if (commandMap[command]) {
        commandMap[command](message, args);
    }
}
