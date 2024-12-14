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
import { rhelp, rula } from "./commands/ruleta/rula.ts";
import { rbet } from "./commands/ruleta/rbet.ts";
import { rroll } from "./commands/ruleta/rroll.ts";
import { rjoin } from "./commands/ruleta/rjoin.ts";
import { rexit } from "./commands/ruleta/rexit.ts";
import { rbetd } from "./commands/ruleta/rbetd.ts";
import { rbetr } from "./commands/ruleta/rbetr.ts";
import { rreset } from "./commands/ruleta/rreset.ts";
import { rnext } from "./commands/ruleta/rnext.ts";
import { rinfo } from "./commands/ruleta/rinfo.ts";
import { sroll } from "./commands/slots/sroll.ts";
import { commsync } from "./commands/commsync.ts";
import { rkick } from "./commands/ruleta/rkick.ts";
import { shelp } from "./commands/slots/shelp.ts";

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

    "cs": commsync,
    "commsync": commsync,

    "lo": load,
    "load": load,

    "la": loadAll,
    "loadall": loadAll,

    "sell": sell,

    "lh": help,
    "lhelp": help,

    "rula": rula,
    "rbet": rbet,
    "rroll": rroll,
    "rjoin": rjoin,
    "rexit": rexit,
    "rbetd": rbetd,
    "rbetr": rbetr,
    "rreset": rreset,
    "rhelp": rhelp,
    "rinfo": rinfo,
    "rkick": rkick,

    "sroll": sroll,
    "shelp": shelp,

    "ctest": test,
    "rnext": rnext
}

function test(message: Message, _: string[]) {
    message.reply("<:0_:1315196027128643584>");
}

export function executeCommand(message: Message) {
    const msg = message.content.slice(1);
    const [command, ...args] = msg.split(" ");

    // if (commandMap[command] && message.author.id === "279775093142323210") {
    if (commandMap[command]) {
        commandMap[command](message, args);
    }
}
