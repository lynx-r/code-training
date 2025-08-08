import { assert, describe, it } from "vitest";
import { alphanumeric } from "./solution";

describe("Tests", () => {
  it("test", () => {
    doTest("Mazinkaiser", true);
    doTest("hello world_", false);
    doTest("PassW0rd", true);
    doTest("     ", false);
    doTest("", false);
    doTest("_YHsZetN", false);
  });
});

function doTest(inp: string, exp: boolean) {
  const msg = `Input = ${JSON.stringify(inp)}`;
  const res = alphanumeric(inp);
  assert.strictEqual(res, exp, msg);
}
