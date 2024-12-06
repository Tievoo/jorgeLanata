import { getBalance } from '../funcs/casino.utils.js';

export function balance(message, args) {
    const balance = getBalance(message.author.id);
    message.reply(`Tenes **${balance}** puntos actualmente.`);
}
