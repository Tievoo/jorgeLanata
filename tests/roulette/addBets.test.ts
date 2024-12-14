import { afterEach, beforeAll, describe, it } from "jsr:@std/testing/bdd"
import { assertEquals } from "jsr:@std/assert";
import { addBetsToPlayer, addPlayerToRoulette, parseBet, rouletteState, startRoulette } from "../../funcs/rula.utils.ts";
import { replaceCasinoWithMock } from "../jsonmanager.mock.ts";
import { Roulette } from "../../types/casino.types.ts";
import { getBalance } from "../../funcs/casino.utils.ts";
import { casinoDB } from "../../database/manager.ts";
import { Casino } from "../../types/db.types.ts";

const onePlayerBalance2000 : Casino = ({ users:{ "1": { balance: 2000 }}, commissions:{} })

replaceCasinoWithMock(structuredClone(onePlayerBalance2000))

describe("adding bets", () => {
    let roulette: Roulette;

    beforeAll(() => {
        startRoulette("0");
        roulette = rouletteState.get("0")!;
        addPlayerToRoulette("0", "1", "test");
    })

    afterEach(() => {
        delete roulette.players["1"]
        addPlayerToRoulette("0", "1", "test");
        casinoDB.set(structuredClone(onePlayerBalance2000));
    })

    it("should add bets to player", () => {
        const bets = parseBet(["10:100", "20:100"], 0);
        addBetsToPlayer("0", "1", bets);
        assertEquals(roulette?.players["1"].bets, bets);
        assertEquals(roulette?.players["1"].prevBets, []);
        assertEquals(getBalance("1"), 1800);
    })

    it("should not add over the max bet (number)", () => {
        const bets = parseBet(["10:500"], 0);
        addBetsToPlayer("0", "1", bets);
        assertEquals(roulette?.players["1"].bets, parseBet(["10:200"], 0));
        assertEquals(getBalance("1"), 1800);      
    })

    it("should not add over the max bet (simple)", () => {
        const bets = parseBet(["red:1900"], 0);
        addBetsToPlayer("0", "1", bets);
        assertEquals(roulette?.players["1"].bets, parseBet(["red:1000"], 0));
        assertEquals(getBalance("1"), 1000);     
    })
})
