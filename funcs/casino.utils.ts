import { casinoDB } from '../database/manager.ts';

const TIEVO_USER_ID = "279775093142323210"

export const TIEVO_COMM = 0.02;
export const CASHIR_COMM = 0.05;

export function addBalance(userId: string, amount: number) {
    // Aca cargaríamos la guita
    const casino = casinoDB.get();
    const user = casino.users[userId];

    if (!user) {
        casino.users[userId] = {
            balance: amount
        };
    } else {
        casino.users[userId].balance += amount;
    }

    casinoDB.set(casino);
}

export function addCommissions(userId: string, amount: number, buyerId: string) {
    if (amount <= 0) return;

    const casino = casinoDB.get();
    
    if (!casino.commissions[TIEVO_USER_ID]) casino.commissions[TIEVO_USER_ID] = 0;
    if (!casino.commissions[userId]) casino.commissions[userId] = 0;

    if (buyerId !== TIEVO_USER_ID) {
        casino.commissions[TIEVO_USER_ID] += Math.round(amount * TIEVO_COMM);
    }

    if (buyerId !== userId) {
        casino.commissions[userId] += Math.round(amount * CASHIR_COMM);
    }

    casinoDB.set(casino);
}

export function getBalance(userId: string) {
    const casino = casinoDB.get();
    const user = casino.users[userId];

    if (!user) {
        return 0;
    }

    return user.balance;
}

export function hasNoBalance(userId: string) {
    return getBalance(userId) <= 0;
}

export function getCommissions() {
    return casinoDB.get().commissions;
}

export function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
