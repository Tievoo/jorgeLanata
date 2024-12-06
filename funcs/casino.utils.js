import { readFileSync, writeFileSync } from 'fs';

export function addBalance(userId, amount) {
    // Aca cargaríamos la guita
    const casino = JSON.parse(readFileSync('./database/casino.json'));
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

export function getBalance(userId) {
    const casino = JSON.parse(readFileSync('./database/casino.json'));
    const user = casino.users[userId];

    if (!user) {
        return 0;
    }

    return user.balance;
}
