import { Casino } from "../../types/db.types.ts";

export const emptyCasino : Casino = { users: {}, commissions: {}, roulettes: {} };
export const onePlayerBalance2000 : Casino = ({ users:{ "1": { balance: 2000 }}, roulettes:{}, commissions:{} })
