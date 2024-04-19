import { describe, expect, it } from "bun:test";
import path from "node:path";
import findModules from "../../src/util/describe-modules";

describe("utils.findModules", () => {
  it("returns a list of modules", async () => {
    // TODO is this the bun way?
    const fixtures = path.resolve("./platform/test/fixtures/services");
    const list = await findModules(fixtures);

    expect(list).toEqual([{ name: "echo" }, { name: "hello" }]);
  });
});
