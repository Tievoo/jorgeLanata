import { describe, it } from "jsr:@std/testing/bdd";
import { replaceCasinoWithMock } from "../jsonmanager.mock.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { RouletteEven, RouletteMiddle, RouletteNumber, RouletteRed } from "../../models/RouletteManager.ts";
import { emptyCasino } from "./utils.ts";
import { BetConverter } from "../../models/BetConverter.ts";

replaceCasinoWithMock(emptyCasino)

describe("parsing a bet with", () => {
    it("a number should return a number bet", () => {
        const bet = BetConverter.parseBet(["10:100"], 0);
        assertEquals(bet, [{ slot: new RouletteNumber(10), amount: 100 }]);
    })

    it("a color should return a color bet", () => {
        const bet = BetConverter.parseBet(["red:100"], 0);
        assertEquals(bet, [{ slot: new RouletteRed(), amount: 100 }]);
    })

    it("a mixd bet should add both", () => {
        const bet = BetConverter.parseBet(["10:100", "red:100"], 0);
        assertEquals(bet, [{ slot: new RouletteNumber(10), amount: 100 }, { slot: new RouletteRed(), amount: 100 }]);
    })

    it("a bet with no amount should throw an error", () => {
        assertThrows(() => BetConverter.parseBet(["10"], 0), "Invalid bet");
    })

    it("a bet with no slot should throw an error", () => {
        assertThrows(() => BetConverter.parseBet([":100"], 0), "Invalid bet");
    })

    it("an all in bet should return the max bet", () => {
        const bet = BetConverter.parseBet(["red:all"], 100);
        assertEquals(bet, [{ slot: new RouletteRed(), amount: 100 }]);
    })

    it("an all in bet with a number should return the max bet", () => {
        const bet = BetConverter.parseBet(["10:all"], 100);
        assertEquals(bet, [{ slot: new RouletteNumber(10), amount: 100 }]);
    })

    it("an over bet should cap to the max bet", () => {
        const bet = BetConverter.parseBet(["10:500"], 100);
        const s = new RouletteNumber(10);
        assertEquals(bet, [{ slot:s, amount: s.roundToMaxBet(500) }]);
    })

    it("an over bet with all in should cap to the max bet", () => {
        const bet = BetConverter.parseBet(["red:all"], 2000);
        const s = new RouletteRed();
        assertEquals(bet, [{ slot:s, amount: s.roundToMaxBet(2000) }]);
    })

    it("a compound bet should return correct bets", () => {
        const bet = BetConverter.parseBet(["[0,1,2,3,4]:100"], 100)
        assertEquals(bet, [
            { slot: new RouletteNumber(0), amount: 100 },
            { slot: new RouletteNumber(1), amount: 100 },
            { slot: new RouletteNumber(2), amount: 100 },
            { slot: new RouletteNumber(3), amount: 100 },
            { slot: new RouletteNumber(4), amount: 100 },
        ])
    })

    it("a compound mixed bet should return correct bets", () => {
        const bet = BetConverter.parseBet(["[0,1,2,3,red,even,1.2]:100"], 100)
        assertEquals(bet, [
            { slot: new RouletteNumber(0), amount: 100 },
            { slot: new RouletteNumber(1), amount: 100 },
            { slot: new RouletteNumber(2), amount: 100 },
            { slot: new RouletteNumber(3), amount: 100 },
            { slot: new RouletteRed(), amount: 100 },
            { slot: new RouletteEven(), amount: 100 },
            { slot: new RouletteMiddle(1,2), amount: 100 },
        ])
    })
})
