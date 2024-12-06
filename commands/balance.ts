import { Message } from 'discord.js';
import { getBalance } from '../funcs/casino.utils.ts';

export function balance(message : Message, args : string[]) {
    const balance = getBalance(message.author.id);
    message.reply(`Tenes **${balance}** puntos actualmente.`);
}
