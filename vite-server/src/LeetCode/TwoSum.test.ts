// sum.test.js
import { assert, describe, it } from "vitest";
import * as solution from "./TwoSum-object.js";

describe("solution", function () {
  it("BasicTests", function () {
    const cases: [number[], number, number[]][] = [
      [[2, 7, 11, 15], 9, [0, 1]],
      [[3, 2, 4], 6, [1, 2]],
      [[3, 3], 6, [0, 1]],
      [[500000000, 2, 4, 500000000], 1000000000, [0, 3]],
    ];

    for (const cs of cases) {
      assert.deepEqual(solution.twoSum(cs[0], cs[1]), cs[2]);
    }
  });
});
