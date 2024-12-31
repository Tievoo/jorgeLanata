import { Bet } from "../types/casino.types.ts";
import { RouletteNumberEmojis, ROULETTE_MIN } from "../types/consts.ts";
import { BetDisplay, Coord } from "./BetDisplay.ts";

export abstract class RouletteSlot {
    abstract readonly name : string;
    abstract readonly payout : number;
    readonly maxBet = ROULETTE_MIN*50;
    readonly id: string | undefined;
    constructor() {}
    abstract shouldPay(number: number): boolean
    abstract displayCoords(): Coord

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

    override displayCoords(): Coord {
        if (this.number === 0) {
            return { x: 151, y: 206 }
        }

        const x = BetDisplay.BASE_NUMBER_POS.x + Math.floor((this.number - 1) / 3) * BetDisplay.X_NUMBER_JUMP;
        const y = BetDisplay.BASE_NUMBER_POS.y + this.number % 3 * BetDisplay.Y_NUMBER_JUMP;
        return { x, y };
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

    override displayCoords(): Coord {
        const first = new RouletteNumber(this.firstNumber).displayCoords();
        const second = new RouletteNumber(this.secondNumber).displayCoords();
        return { x: (first.x + second.x) / 2, y: (first.y + second.y ) / 2 };
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

    displayCoords(): Coord {
        return { x: 609, y: 463 }
    }
}

export class RouletteBlack extends RouletteSlot {
    override readonly name = "Negro";
    override readonly id = "black";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isBlack(number);
    }
    displayCoords(): Coord {
        return { x: 772, y: 463 }
    }
}

export class RouletteOdd extends RouletteSlot {
    override readonly name = "Impar";
    override readonly id = "odd";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isOdd(number);
    }

    displayCoords(): Coord {
        return { x: 935, y: 463 }
    }
}

export class RouletteEven extends RouletteSlot {
    override readonly name = "Par";
    override readonly id = "even";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isEven(number);
    }

    displayCoords(): Coord {
        return { x: 446, y: 463 }
    }
}

export class RouletteLow extends RouletteSlot {
    override readonly name = "1 a 18";
    override readonly id = "low";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isLow(number);
    }

    displayCoords(): Coord {
        return { x: 283, y: 463 }
    }
}

export class RouletteHigh extends RouletteSlot {
    override readonly name = "19 a 36";
    override readonly id = "high";
    override readonly payout = 2;

    shouldPay(number: number): boolean {
        return RouletteManager.isHigh(number);
    }

    displayCoords(): Coord {
        return { x: 1098, y: 463 }
    }
}

export class RouletteFirstDozen extends RouletteSlot {
    override readonly name = "Primera docena";
    override readonly id = "first";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isDozen(1, number);
    }

    displayCoords(): Coord {
        return { x: 364, y: 376 }
    }
}

export class RouletteSecondDozen extends RouletteSlot {
    override readonly name = "Segunda docena";
    override readonly id = "second";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isDozen(2, number);
    }

    displayCoords(): Coord {
        return { x: 690, y: 376 }
    }
}


export class RouletteThirdDozen extends RouletteSlot {
    override readonly name = "Tercera docena";
    override readonly id = "third";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isDozen(3, number);
    }

    displayCoords(): Coord {
        return { x: 1016, y: 376 }
    }
}

export class RouletteFirstColumn extends RouletteSlot {
    override readonly name = "Primera columna";
    override readonly id = "firstcol";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isColumn(1, number);
    }

    displayCoords(): Coord {
        return { x: 1241, y: 131 }
    }
}

export class RouletteSecondColumn extends RouletteSlot {
    override readonly name = "Segunda columna";
    override readonly id = "secondcol";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isColumn(2, number);
    }

    displayCoords(): Coord {
        return { x: 1241, y: 212 }
    }
}

export class RouletteThirdColumn extends RouletteSlot {
    override readonly name = "Tercera columna";
    override readonly id = "thirdcol";
    override readonly payout = 3;

    shouldPay(number: number): boolean {
        return RouletteManager.isColumn(0, number);
    }

    displayCoords(): Coord {
        return { x: 1241, y: 293 }
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

    static isDozen(dozen: number, number: number): boolean {
        return number >= (dozen - 1) * 12 + 1 && number <= dozen * 12;
    }

    static isColumn(column: number, number: number): boolean {
        return number % 3 === column;
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

