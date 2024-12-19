import { casinoDB } from "../database/manager.ts";
import { addBalance, hasNoBalance } from "../funcs/casino.utils.ts";
import { Bet, Roulette } from "../types/casino.types.ts";
import { JsonRoulette } from "../types/db.types.ts";
import { BetConverter } from "./BetConverter.ts";
import { Queue } from "./Queue.ts";

export class RouletteState {
    private roulettes: Record<string, Roulette> = {};

    constructor(json: Record<string, JsonRoulette> ) {
        this.fromJson(json);
    }

    startRoulette(channelId: string) {
        this.roulettes[channelId] = {
            channelId,
            players: {},
            lastResults: new Queue()
        }
        this.sync();
    }

    getRoulette(channelId: string) {
        return this.roulettes[channelId];
    }

    addPlayer(channelId: string, id: string, name: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return;
    
        roulette.players[id] = {
            id: id,
            name: name,
            bets: [],
            prevBets: [],
        }
    
        this.sync();
    }

    addBetsToPlayer(channelId: string, playerId: string, bets: Bet[]) {
        const roulette = this.getRoulette(channelId);
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
    
        this.sync();
    }

    isPlayerInRoulette(channelId: string, playerId: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return false;
    
        return playerId in roulette.players;
    }

    removePlayer(channelId: string, playerId: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return;
    
        delete roulette.players[playerId];

        this.sync();
    }

    hasRoulette(channelId: string) {
        return channelId in this.roulettes;
    }

    usersWithoutBet(channelId: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return [];
    
        return Object.values(roulette.players).filter(player => player.bets.length === 0);
    }

    getBet(channelId: string, playerId: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return [];
    
        return roulette.players[playerId].bets;
    }

    getPrevBet(channelId: string, playerId: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return [];
    
        return roulette.players[playerId].prevBets;
    }

    resetBet(channelId: string, playerId: string) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return;
    
        roulette.players[playerId].bets = [];

        this.sync();
    }

    resetBetAndRefund(channelId: string, playerId: string, slots: string[] = []) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return;
    
        const player = roulette.players[playerId];
        const actualValue = player.bets.reduce((acc, bet) => acc + bet.amount, 0);
    
        const newBets = slots.length ? player.bets.filter(bet => !slots.some(arg => bet.slot.isOfType(arg))) : []
    
        const newValue = newBets.reduce((acc, bet) => acc + bet.amount, 0);
    
        addBalance(playerId, actualValue - newValue);
    
        player.bets = newBets;

        this.sync();
    }

    resetBets(channelId: string) {
        const roulette = this.getRoulette(channelId);
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

        this.sync();
    }

    addResult(channelId: string, result: number) {
        const roulette = this.getRoulette(channelId);
        if (!roulette) return;
    
        roulette.lastResults.enqueue(result);
        this.sync();
    }

    sync() {
        casinoDB.setKey("roulettes", this.toJson());
    }

    fromJson(json: Record<string, JsonRoulette>) {
        for (const channelId in json) {
            this.roulettes[channelId] = {
                channelId,
                players: {},
                lastResults: new Queue(json[channelId].lastResults),
            }

            for (const playerId in json[channelId].players) {
                const player = json[channelId].players[playerId];
                this.roulettes[channelId].players[playerId] = {
                    id: player.id,
                    name: player.name,
                    bets: BetConverter.convertJsonBets(player.bets),
                    prevBets: BetConverter.convertJsonBets(player.prevBets),
                }
            }
        }
    }

    toJson() {
        const json: Record<string, JsonRoulette> = {};
        for (const channelId in this.roulettes) {
            json[channelId] = {
                channelId,
                players: {},
                lastResults: this.roulettes[channelId].lastResults.toArray(),
            }

            for (const playerId in this.roulettes[channelId].players) {
                const player = this.roulettes[channelId].players[playerId];
                json[channelId].players[playerId] = {
                    id: player.id,
                    name: player.name,
                    bets: player.bets.map(bet => ({amount: bet.amount, slot: bet.slot.toJsonString()})),
                    prevBets: player.prevBets.map(bet => ({amount: bet.amount, slot: bet.slot.toJsonString()})),
                }
            }
        }
        return json;
    }
}
