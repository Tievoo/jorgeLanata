import { replaceCasinoWithMock } from "../jsonmanager.mock.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert"
import { describe, it } from "jsr:@std/testing/bdd";
import { convertToRouletteSlot } from "../../funcs/rula.utils.ts";
import { RouletteEven, RouletteMiddle, RouletteNumber, RouletteRed } from "../../models/roulette.ts";
import { emptyCasino } from "./utils.ts";

replaceCasinoWithMock(emptyCasino)

describe("converting to roulette slot a", () => {
    it("number should return a RouletteNumber", () => {
        const slot = convertToRouletteSlot("1");
        assertEquals(slot, new RouletteNumber(1));
    })

    it("color should return a Roulette color", () => {
        const slot = convertToRouletteSlot("red");
        assertEquals(slot, new RouletteRed());
    })

    it("evenity should return a Roulette evenity", () => {
        const slot = convertToRouletteSlot("even");
        assertEquals(slot, new RouletteEven());
    })

    it("middle should return a Roulette middle", () => {
        const slot = convertToRouletteSlot("1.2");
        assertEquals(slot, new RouletteMiddle(1, 2));
    })

    it("invalid middle should throw an error", () => {
        assertThrows(() => convertToRouletteSlot("1.5"))
    })

    it("invalid slot should throw an error", () => {
        assertThrows(() => convertToRouletteSlot("invalid"))
        assertThrows(() => convertToRouletteSlot("37"))
    })
})
