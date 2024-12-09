import { RouletteNumberEmojis } from "../funcs/rula.utils.ts";
import { Bet } from "../types/casino.types.ts";

export const ROULETTE_MIN = 20;


export abstract class RouletteSlot {
    readonly name : string;
    readonly payout : number;
    readonly maxBet = ROULETTE_MIN*50;
    readonly id: string;
    constructor() {}
    abstract shouldPay(number: number): boolean

    toString() {
        return this.name;
    }

    roundToMaxBet(amount: number): number {
        return Math.min(this.maxBet, amount);
    }

    isOfType(slot: string): boolean {
        return slot === this.id;
    }
}

export class RouletteNumber extends RouletteSlot {
    readonly payout = 36;
    readonly maxBet: number = ROULETTE_MIN*10;
    number: number;
    constructor(number: number) {
        super();
        this.number = number;
    }

    shouldPay(number: number): boolean {
        return this.number === number;
    }

    toString() {
        return RouletteNumberEmojis[this.number];
    }

    isOfType(slot: string): boolean {
        return slot === this.number.toString();
    }
}

export class RouletteMiddle extends RouletteSlot {
    firstNumber: number;
    secondNumber: number;
    readonly payout = 18;
    constructor(firstNumber: number, secondNumber: number) {
        super();
        this.firstNumber = firstNumber;
        this.secondNumber = secondNumber;
    }

    shouldPay(number: number): boolean {
        return this.firstNumber === number || this.secondNumber === number;
    }

    toString() {
        return `Entre ${RouletteNumberEmojis[this.firstNumber]} y ${RouletteNumberEmojis[this.firstNumber]}`;
    }

    isOfType(slot: string): boolean {
        return slot === `${this.firstNumber}.${this.secondNumber}`;
    }
}

export class RouletteRed extends RouletteSlot {
    readonly name = "Rojo";
    readonly id = "red"
    readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isRed(number);
    }
}

export class RouletteBlack extends RouletteSlot {
    readonly name = "Negro";
    readonly id = "black";
    readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isBlack(number);
    }
}

export class RouletteOdd extends RouletteSlot {
    readonly name = "Impar";
    readonly id = "odd";
    readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isOdd(number);
    }
}

export class RouletteEven extends RouletteSlot {
    readonly name = "Par";
    readonly id = "even";
    readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isEven(number);
    }
}

export class RouletteLow extends RouletteSlot {
    readonly name = "1 a 18";
    readonly id = "low";
    readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isLow(number);
    }
}

export class RouletteHigh extends RouletteSlot {
    readonly name = "19 a 36";
    readonly id = "high";
    readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isHigh(number);
    }
}

export class RouletteFirstDozen extends RouletteSlot {
    readonly name = "Primera docena";
    readonly id = "first";
    readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isFirstDozen(number);
    }
}

export class RouletteSecondDozen extends RouletteSlot {
    readonly name = "Segunda docena";
    readonly id = "second";
    readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isSecondDozen(number);
    }
}


export class RouletteThirdDozen extends RouletteSlot {
    readonly name = "Tercera docena";
    readonly id = "third";
    readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isThirdDozen(number);
    }
}

export class RouletteManager {
    static readonly REDS = [
        1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    ];

    static readonly BLACK = [
        2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35
    ];

    static isRed(number: number): boolean {
        return this.REDS.includes(number);
    }

    static isBlack(number: number): boolean {
        return this.BLACK.includes(number);
    }

    static isOdd(number: number): boolean {
        return number % 2 !== 0;
    }

    static isEven(number: number): boolean {
        return number % 2 === 0 && number !== 0;
    }

    static isLow(number: number): boolean {
        return number >= 1 && number <= 18;
    }

    static isHigh(number: number): boolean {
        return number >= 19 && number <= 36;
    }

    static isNumber(number: number): boolean {
        return number >= 0 && number <= 36;
    }

    static isFirstDozen(number: number): boolean {
        return number >= 1 && number <= 12;
    }

    static isSecondDozen(number: number): boolean {
        return number >= 13 && number <= 24;
    }

    static isThirdDozen(number: number): boolean {
        return number >= 25 && number <= 36;
    }

    static isSlot(slot: RouletteSlot, number: number): boolean {
        return slot.shouldPay(number);
    }

    static getFullPayout(bets: Bet[], number: number): number {
        return bets.reduce((acc, bet) => {
            if (this.isSlot(bet.slot, number)) {
                acc += bet.amount * bet.slot.payout;
            }
            return acc;
        }, 0);
    }
}
