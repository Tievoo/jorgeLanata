import {
    RouletteSlot,
    RouletteRed,
    RouletteBlack,
    RouletteOdd,
    RouletteEven,
    RouletteLow,
    RouletteHigh,
    RouletteFirstDozen,
    RouletteSecondDozen,
    RouletteThirdDozen,
    RouletteNumber,
    RouletteMiddle,
    ROULETTE_MIN
} from "../models/roulette.ts";
import { Bet, Roulette } from "../types/casino.types.ts";
import { addBalance, hasNoBalance } from "./casino.utils.ts";

export const rouletteState: Map<string, Roulette> = new Map<string, Roulette>();

const validRouletteSlots = ["red", "black", "odd", "even", "low", "high", "first", "second", "third"];
const validRouletteNumbers = Array.from({ length: 37 }, (_, i) => i).map(String);

const rouletteSlotMap: Record<string, new () => RouletteSlot> = {
    red: RouletteRed,
    black: RouletteBlack,
    odd: RouletteOdd,
    even: RouletteEven,
    low: RouletteLow,
    high: RouletteHigh,
    first: RouletteFirstDozen,
    second: RouletteSecondDozen,
    third: RouletteThirdDozen,
};

export function getPerpendicularNumbers(num: number): number[] {
    const columns = 3;

    const row = Math.ceil(num / columns);
    const col = (num - 1) % columns + 1;

    const neighbors: number[] = [];

    if (num === 0) {
        return [1,2,3]
    }

    if (row > 1) {
        neighbors.push(num - columns);
    }

    if (row < 12) {
        neighbors.push(num + columns);
    }

    if (col > 1) {
        neighbors.push(num - 1);
    }

    if (col < columns) {
        neighbors.push(num + 1);
    }

    if (num < 4) {
        neighbors.push(0);
    }

    return neighbors;
}

export function startRoulette(channelId: string) {
    rouletteState.set(channelId, {
        channelId,
        players: {},
    });
}

export function addPlayerToRoulette(channelId: string, playerId: string, name: string) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return;

    roulette.players[playerId] = {
        id: playerId,
        name: name,
        bets: [],
        prevBets: [],
    }
}

export function addBetsToPlayer(channelId: string, playerId: string, bets: Bet[]) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return;

    const prevAmount = roulette.players[playerId].bets.reduce((acc, bet) => acc + bet.amount, 0);

    for (const bet of bets) {
        const existingBet = roulette.players[playerId].bets.findIndex(b => b.slot.toString() === bet.slot.toString());
        if (existingBet !== -1) {
            const actualAmount = roulette.players[playerId].bets[existingBet].amount
            roulette.players[playerId].bets[existingBet].amount = bet.slot.roundToMaxBet(bet.amount + actualAmount);
        } else {
            roulette.players[playerId].bets.push(bet);
        }
    }

    const newAmount = roulette.players[playerId].bets.reduce((acc, bet) => acc + bet.amount, 0);

    addBalance(playerId, prevAmount - newAmount);
}

export function isPlayerInRoulette(channelId: string, playerId: string) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return false;

    return playerId in roulette.players;
}

export function convertToRouletteSlot(slot: string): RouletteSlot {
    if (validRouletteSlots.includes(slot)) {
        return new rouletteSlotMap[slot]();
    }

    if (validRouletteNumbers.includes(slot)) {
        return new RouletteNumber(parseInt(slot));
    }

    if (slot.includes(".")) {
        const [first, second] = slot.split(".");
        const [firstN, secondN] = [parseInt(first), parseInt(second)];
        if (validRouletteNumbers.includes(first) && validRouletteNumbers.includes(second) 
            && getPerpendicularNumbers(firstN).includes(secondN)) {
            return new RouletteMiddle(firstN, secondN);
        }
    }

    throw new Error("Invalid slot");
}

export function hasRoulette(channelId: string) {
    return rouletteState.has(channelId);
}

export function usersWithoutBet(channelId: string) {
    const roulette = rouletteState.get(channelId);

    return Object.values(roulette!.players).filter(player => player.bets.length === 0);
}

export function parseBet(bets: string[], allIn: number): Bet[] {

    const multiBets : string[] = [];

    const parsed : Bet[] = bets.map(bet => {
        let [slot, amount] = bet.split(":");
        if (amount === "all") amount = allIn.toString();
        
        if (/^\[.+\]$/.test(slot)) {
            const numbers = slot.slice(1, -1).replace(/ /g, "").split(",");
            multiBets.push(...numbers.map(num => `${num}:${amount}`));
            return;
        }

        const rouletteSlot = convertToRouletteSlot(slot);
        const amountNumber = parseInt(amount);

        if (isNaN(amountNumber)) throw new Error("Invalid amount");

        if (amountNumber < ROULETTE_MIN) throw new Error("Low bet");
        return {
            amount: rouletteSlot.roundToMaxBet(amountNumber),
            slot: rouletteSlot,
        }
    }).filter((bet): bet is Bet => !!bet);

    if (multiBets.length) {
        parsed.push(...parseBet(multiBets, allIn))
    }

    return parsed;
}

export function getBet(channelId: string, playerId: string) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return [];

    return roulette.players[playerId].bets;
}

export function getPrevBet(channelId: string, playerId: string) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return [];

    return roulette.players[playerId].prevBets;
}

export function resetBet(channelId: string, playerId: string) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return;

    roulette.players[playerId].bets = [];
}

export function resetBetAndRefund(channelId: string, playerId: string, args: string[] = []) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return;

    const player = roulette.players[playerId];
    const actualValue = player.bets.reduce((acc, bet) => acc + bet.amount, 0);

    const newBets = args.length ? player.bets.filter(bet => !args.some(arg => bet.slot.isOfType(arg))) : []

    const newValue = newBets.reduce((acc, bet) => acc + bet.amount, 0);

    addBalance(playerId, actualValue - newValue);

    player.bets = newBets;
}

export function resetBets(channelId: string) {
    const roulette = rouletteState.get(channelId);
    if (!roulette) return;

    for (const userId in roulette.players) {
        const player = roulette.players[userId];
        if (hasNoBalance(userId)) {
            delete roulette.players[userId];
            continue;
        };
        player.prevBets = player.bets;
        player.bets = [];

    }
}

export function getBetAmount(bet: Bet[]) {
    return bet.reduce((acc, bet) => acc + bet.amount, 0);
}

export function displayBet(bets: Bet[]) {
    const amount = bets.reduce((acc, bet) => acc + bet.amount, 0);
    return `${bets.map(bet => `**${bet.amount}** en ${bet.slot}`).join("\n")}\nTotal apostado: **${amount}**`;
}

export const RouletteNumberEmojis : Record<number, string> = {
    0: "<:0_:1315196027128643584>",
    1: "<:1_:1315196029045444678>",
    2: "<:2_:1315196030521839677>",
    3: "<:3_:1315196032312934400>",
    4: "<:4_:1315196033801654312>",
    5: "<:5_:1315196035513188464>",
    6: "<:6_:1315196036985393174>",
    7: "<:7_:1315196038562447401>",
    8: "<:8_:1315196040017874978>",
    9: "<:9_:1315196041452191846>",
    10: "<:10:1315196237372330005>",
    11: "<:11:1315196044795183166>",
    12: "<:12:1315196239117029396>",
    13: "<:13:1315196049148874802>",
    14: "<:14:1315196240518053989>",
    15: "<:15:1315196053049315328>",
    16: "<:16:1315196241768087583>",
    17: "<:17:1315196056681844787>",
    18: "<:18:1315196243751993397>",
    19: "<:19:1315196060054065182>",
    20: "<:20:1315196062327373926>",
    21: "<:21:1315196646300057642>",
    22: "<:22:1315196066144063498>",
    23: "<:23:1315196647810142218>",
    24: "<:24:1315196069642240051>",
    25: "<:25:1315196649403973632>",
    26: "<:26:1315196073421045811>",
    27: "<:27:1315196650981167104>",
    28: "<:28:1315196077246517308>",
    29: "<:29:1315196652893507594>",
    30: "<:30:1315196080950083614>",
    31: "<:31:1315196654286274601>",
    32: "<:32:1315235260237086811>",
    33: "<:33:1315196655490044007>",
    34: "<:34:1315235262468591697>",
    35: "<:35:1315196657121628211>",
    36: "<:36:1315196092576436304>",
}
