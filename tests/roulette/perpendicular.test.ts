import { getPerpendicularNumbers } from "../../funcs/rula.utils.ts"
import { assertArrayIncludes } from "jsr:@std/assert"
import { describe, it } from "jsr:@std/testing/bdd";
import { replaceCasinoWithMock } from "../jsonmanager.mock.ts";
import { emptyCasino } from "./utils.ts";

replaceCasinoWithMock(emptyCasino)
describe("perpendicular numbers", () => {
    it("are found for zero", () => {
        assertArrayIncludes(getPerpendicularNumbers(0), [1,2,3]);
    });

    it("for 1, 2 and 3 include zero", () => {
        assertArrayIncludes(getPerpendicularNumbers(1), [0,2,4]);
        assertArrayIncludes(getPerpendicularNumbers(2), [0,1,3,5]);
        assertArrayIncludes(getPerpendicularNumbers(3), [0,2,6]);
    });

    it("for middle number includes all neighbors", () => {
        assertArrayIncludes(getPerpendicularNumbers(5), [2,4,6,8]);
    });

    it("for top number doesn't include next", () => {
        assertArrayIncludes(getPerpendicularNumbers(9), [6,8,12]);
    });

    it("for bottom number doesn't include previous", () => {
        assertArrayIncludes(getPerpendicularNumbers(7), [8,10,4]);
    });
});
