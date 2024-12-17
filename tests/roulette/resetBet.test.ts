import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { replaceCasinoWithMock } from "../jsonmanager.mock.ts";
import { addBetsToPlayer, addPlayerToRoulette, getBet, isPlayerInRoulette, parseBet, resetBetAndRefund, resetBets, startRoulette } from "../../funcs/rula.utils.ts";
import { assertEquals } from "jsr:@std/assert@^1.0.9/equals";
import { addBalance, getBalance } from "../../funcs/casino.utils.ts";
import { RouletteRed } from "../../models/roulette.ts";
import { onePlayerBalance2000 } from "./utils.ts";

replaceCasinoWithMock(structuredClone(onePlayerBalance2000))

describe("using rreset to reset a bet with", () => {
    beforeAll(() => {
        startRoulette("0");
        addPlayerToRoulette("0", "1", "test");
    })

    it("a number should refund the amount", () => {
        addBetsToPlayer("0", "1", parseBet(["10:100"], 0));
        resetBetAndRefund("0", "1");
        assertEquals(getBalance("1"), 2000);
        assertEquals(getBet("0", "1"), []);
    })

    it("a color should refund the amount", () => {
        addBetsToPlayer("0", "1", parseBet(["red:100"], 0));
        resetBetAndRefund("0", "1");
        assertEquals(getBalance("1"), 2000);
        assertEquals(getBet("0", "1"), []);
    })

    it("a mixd bet should refund the amount", () => {
        addBetsToPlayer("0", "1", parseBet(["10:100", "red:100"], 0));
        resetBetAndRefund("0", "1");
        assertEquals(getBalance("1"), 2000);
        assertEquals(getBet("0", "1"), []);
    })

    it("a number specifying that number should refund the amount", () => {
        addBetsToPlayer("0", "1", parseBet(["10:100"], 0));
        resetBetAndRefund("0", "1", ["10"]);
        assertEquals(getBalance("1"), 2000);
        assertEquals(getBet("0", "1"), []);
    })

    it("a color specifying that color should refund the amount", () => {
        addBetsToPlayer("0", "1", parseBet(["red:100"], 0));
        resetBetAndRefund("0", "1", ["red"]);
        assertEquals(getBalance("1"), 2000);
        assertEquals(getBet("0", "1"), []);
    })

    it("a mixd bet specifying a slot should refund that slot only", () => {
        addBetsToPlayer("0", "1", parseBet(["10:100", "red:100"], 0));
        // console.log(getBet("0", "1"));
        resetBetAndRefund("0", "1", ["10"]);
        assertEquals(getBalance("1"), 1900);
        assertEquals(getBet("0", "1"), [ { slot:new RouletteRed(), amount: 100 } ]);
    })
})

describe("after a roll, when the bets reset", () => {
    beforeAll(() => {
        startRoulette("0");
        addPlayerToRoulette("0", "1", "test");
    })

    it("players with no balance should be removed", () => {
        addBalance("1", -2000);
        resetBets("0");
        assertEquals(isPlayerInRoulette("0", "1"), false);
    })
})
