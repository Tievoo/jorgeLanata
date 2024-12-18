import { Bet } from "../types/casino.types.ts";
import { RouletteNumberEmojis, ROULETTE_MIN } from "../types/consts.ts";

export abstract class RouletteSlot {
    abstract readonly name : string;
    abstract readonly payout : number;
    readonly maxBet = ROULETTE_MIN*50;
    readonly id: string | undefined;
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

    toJsonString(): string {
        return this.id || "";
    }
}

export class RouletteNumber extends RouletteSlot {
    override readonly name = "Numero";
    override readonly id = "num";
    override readonly payout = 36;
    override readonly maxBet: number = ROULETTE_MIN*10;
    number: number;
    constructor(number: number) {
        super();
        this.number = number;
    }

    shouldPay(number: number): boolean {
        return this.number === number;
    }

    override toString() {
        return RouletteNumberEmojis[this.number];
    }

    override isOfType(slot: string): boolean {
        return slot === this.number.toString();
    }

    override toJsonString(): string {
        return this.number.toString();
    }
}

export class RouletteMiddle extends RouletteSlot {
    firstNumber: number;
    secondNumber: number;
    override readonly payout = 18;
    override readonly name = "Mitad";
    override readonly id = "middle";
    constructor(firstNumber: number, secondNumber: number) {
        super();
        this.firstNumber = firstNumber;
        this.secondNumber = secondNumber;
    }

    shouldPay(number: number): boolean {
        return this.firstNumber === number || this.secondNumber === number;
    }

    override toString() {
        return `Entre ${RouletteNumberEmojis[this.firstNumber]} y ${RouletteNumberEmojis[this.secondNumber]}`;
    }

    override isOfType(slot: string): boolean {
        return slot === `${this.firstNumber}.${this.secondNumber}`;
    }

    override toJsonString(): string {
        return `${this.firstNumber}.${this.secondNumber}`;
    }
}

export class RouletteRed extends RouletteSlot {
    override readonly name = "Rojo";
    override readonly id = "red"
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isRed(number);
    }
}

export class RouletteBlack extends RouletteSlot {
    override readonly name = "Negro";
    override readonly id = "black";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isBlack(number);
    }
}

export class RouletteOdd extends RouletteSlot {
    override readonly name = "Impar";
    override readonly id = "odd";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isOdd(number);
    }
}

export class RouletteEven extends RouletteSlot {
    override readonly name = "Par";
    override readonly id = "even";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isEven(number);
    }
}

export class RouletteLow extends RouletteSlot {
    override readonly name = "1 a 18";
    override readonly id = "low";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isLow(number);
    }
}

export class RouletteHigh extends RouletteSlot {
    override readonly name = "19 a 36";
    override readonly id = "high";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isHigh(number);
    }
}

export class RouletteFirstDozen extends RouletteSlot {
    override readonly name = "Primera docena";
    override readonly id = "first";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isFirstDozen(number);
    }
}

export class RouletteSecondDozen extends RouletteSlot {
    override readonly name = "Segunda docena";
    override readonly id = "second";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isSecondDozen(number);
    }
}


export class RouletteThirdDozen extends RouletteSlot {
    override readonly name = "Tercera docena";
    override readonly id = "third";
    override readonly payout = 3;

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
