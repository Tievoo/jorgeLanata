import { sg } from "./sg.js";
import { givescrap } from "./givescrap.js";
import { buy } from "./buy.js";
import { balance } from "./balance.js";
import { load } from "./load.js";

const commandMap = {
    "sg" : sg,
    "givescrap" : givescrap,
    "buy": buy,
    "balance": balance,
    "load": load
}

export function executeCommand(message) {
    const msg = message.content.slice(1);
    const [command, ...args] = msg.split(" ");

    if (commandMap[command]) {
        commandMap[command](message, args);
    }
}
