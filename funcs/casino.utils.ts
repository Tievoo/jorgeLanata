import { readFileSync, writeFileSync } from 'node:fs';

export function addBalance(userId: string, amount: number) {
    // Aca cargaríamos la guita
    const casino = JSON.parse(readFileSync('./database/casino.json', 'utf-8'));
    const user = casino.users[userId];

    if (!user) {
        casino.users[userId] = {
            balance: amount
        };
    } else {
        casino.users[userId].balance += amount;
    }

    writeFileSync('./database/casino.json', JSON.stringify(casino, null, 4));
}

export function getBalance(userId: string) {
    const casino = JSON.parse(readFileSync('./database/casino.json', 'utf-8'));
    const user = casino.users[userId];

    if (!user) {
        return 0;
    }

    return user.balance;
}
