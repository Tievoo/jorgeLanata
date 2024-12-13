import { getPerpendicularNumbers } from "../../funcs/rula.utils.ts"
import { assertArrayIncludes } from "jsr:@std/assert"

Deno.test("perpendicular numbers are found for zero", () => {
    assertArrayIncludes(getPerpendicularNumbers(0), [1,2,3]);
})

Deno.test("perpendicular for 1, 2 and 3 include zero", () => {
    assertArrayIncludes(getPerpendicularNumbers(1), [0,2,4]);
    assertArrayIncludes(getPerpendicularNumbers(2), [0,1,3,5]);
    assertArrayIncludes(getPerpendicularNumbers(3), [0,2,6]);
})

Deno.test("perpendicular for middle number includes all neighbors", () => {
    assertArrayIncludes(getPerpendicularNumbers(5), [2,4,6,8]);
})

Deno.test("perpendicular for top number doesn include next", () => {
    assertArrayIncludes(getPerpendicularNumbers(9), [6,8,12]);
})

Deno.test("perpendicular for bottom number doesn include previous", () => {
    assertArrayIncludes(getPerpendicularNumbers(7), [8,10,4]);
})
