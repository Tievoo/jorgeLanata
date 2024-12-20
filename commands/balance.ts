import { Message } from 'discord.js';
import { getBalance } from '../funcs/casino.utils.ts';

export function balance(message : Message, _: string[]) {
    const balance = getBalance(message.author.id);
    message.reply(
        `Tenes **${balance}** puntos actualmente.\n${ balance === 0 ? "Podes comprar fichas con `$buy <cantidad>`. Un moderador hará la transacción." :
            "Podes jugar tus fichas usando `$rula`" }
        `);
}
