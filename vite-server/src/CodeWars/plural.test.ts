// sum.test.js
import { assert, describe, it } from "vitest";
import * as solution from "./plural.js";

describe("solution", function () {
  it("BasicTests", function () {
    assert.equal(solution.plural(0), true, "Plural for 0");
    assert.equal(solution.plural(0.5), true, "Plural for 0.5");
    assert.equal(solution.plural(1), false, "Plural for 1");
    assert.equal(solution.plural(100), true, "Plural for 100");
    assert.equal(solution.plural(Infinity), true, "Plural for Infinity");
  });
});
