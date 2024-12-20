import { Bet } from "../types/casino.types.ts";
import { ROULETTE_MIN } from "../types/consts.ts";
import { JsonBet } from "../types/db.types.ts";
import { 
    RouletteBlack,
    RouletteEven,
    RouletteFirstDozen,
    RouletteHigh,
    RouletteLow,
    RouletteMiddle,
    RouletteNumber,
    RouletteRed,
    RouletteSecondDozen,
    RouletteSlot,
    RouletteThirdDozen,
    RouletteFirstColumn,
    RouletteSecondColumn,
    RouletteThirdColumn,
    RouletteOdd
} from "./RouletteManager.ts";

export class BetConverter {
    static validRouletteNumbers = Array.from({ length: 37 }, (_, i) => i).map(String);
    static rouletteSlotMap: Record<string, new () => RouletteSlot> = {
        red:       RouletteRed,
        black:     RouletteBlack,
        odd:       RouletteOdd,
        even:      RouletteEven,
        low:       RouletteLow,
        high:      RouletteHigh,
        first:     RouletteFirstDozen,
        second:    RouletteSecondDozen,
        third:     RouletteThirdDozen,
        firstcol:  RouletteFirstColumn,
        secondcol: RouletteSecondColumn,
        thirdcol:  RouletteThirdColumn
    };

    static convertToRouletteSlot(slot: string): RouletteSlot {
        if (slot in this.rouletteSlotMap) {
            return new this.rouletteSlotMap[slot]();
        }

        if (this.validRouletteNumbers.includes(slot)) {
            return new RouletteNumber(parseInt(slot));
        }

        if (slot.includes(".")) {
            const [first, second] = slot.split(".");
            const [firstN, secondN] = [parseInt(first), parseInt(second)];
            if (this.validRouletteNumbers.includes(first) && this.validRouletteNumbers.includes(second) && this.getPerpendicularNumbers(firstN).includes(secondN)) {
                return new RouletteMiddle(firstN, secondN);
            }
        }

        throw new Error("Invalid slot");
    }

    static getPerpendicularNumbers(num: number): number[] {
        const columns = 3;

        const row = Math.ceil(num / columns);
        const col = (num - 1) % columns + 1;

        const neighbors: number[] = [];

        if (num === 0) {
            return [1, 2, 3]
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

    static convertJsonBets(bets: JsonBet[]) {
        return bets.map(bet => {
            return {
                amount: bet.amount,
                slot: this.convertToRouletteSlot(bet.slot)
            }
        });
    }

    static parseBet(bets: string[], allIn: number): Bet[] {
        const multiBets : string[] = [];
    
        const parsed : Bet[] = bets.map(bet => {
            let [slot, amount] = bet.split(":");
            if (amount === "all") amount = allIn.toString();
            
            if (/^\[.+\]$/.test(slot)) {
                const numbers = slot.slice(1, -1).replace(/ /g, "").split(",");
                multiBets.push(...numbers.map(num => `${num}:${amount}`));
                return;
            }
    
            const rouletteSlot = BetConverter.convertToRouletteSlot(slot);
            const amountNumber = parseInt(amount);
    
            if (isNaN(amountNumber)) throw new Error("Invalid amount");
    
            if (amountNumber < ROULETTE_MIN) throw new Error("Low bet");
            return {
                amount: rouletteSlot.roundToMaxBet(amountNumber),
                slot: rouletteSlot,
            }
        }).filter((bet): bet is Bet => !!bet);
    
        if (multiBets.length) {
            parsed.push(...this.parseBet(multiBets, allIn))
        }
    
        return parsed;
    }
}
