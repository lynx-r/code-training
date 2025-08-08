import { isInteresting } from "./solution";
import { assert, describe, it } from "vitest";

function test(n: number, awesome: number[], expected: number) {
  assert.strictEqual(isInteresting(n, awesome), expected);
}

describe("solution", function () {
  it("should work, dangit!", function () {
    test(12318, [1337, 256], 0);
    test(123318, [1337, 256], 0);
    test(12319, [1337, 256], 1);
    test(123319, [1337, 256], 1);
    test(12320, [1337, 256], 1);
    test(12321, [1337, 256], 2);
    test(123321, [1337, 256], 2);
    test(4321, [1337, 256], 2);
    test(43210, [1337, 256], 2);
    test(123456789, [1337, 256], 2);
    test(567890, [1337, 256], 2);
    test(1234567890, [1337, 256], 0);
    test(1110, [1337, 256], 1);
    test(1111, [1337, 256], 2);
    test(222220, [1337, 256], 1);
    test(199, [1337, 256], 1);
    test(1000, [1337, 256], 2);
    test(3, [1337, 256], 0);
    test(1336, [1337, 256], 1);
    test(1337, [1337, 256], 2);
    test(11208, [1337, 256], 0);
    test(11209, [1337, 256], 1);
    test(11211, [1337, 256], 2);
    test(999999999, [1337, 256], 2);
    test(11211, [1337, 256], 2);
    test(98, [1337, 256], 1);
    test(99, [1337, 256], 1);
    test(119, [1337, 256], 1);
    test(120, [1337, 256], 1);
    test(3208, [1337, 256], 1);
    test(3209, [1337, 256], 1);
    test(987654319, [1337, 256], 1);
    test(987654320, [1337, 256], 1);
  });
});
