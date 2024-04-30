import { describe, expect, it } from "bun:test";
import path from "node:path";
import findModules from "../../src/util/describe-modules";

describe("utils.findModules", () => {
  it("returns a list of folders, ignoring names and underscores", async () => {
    const fixtures = path.resolve("./platform/test/fixtures/services");
    const list = await findModules(fixtures);

    const orderedNames = list.map((s) => s.name);

    expect(orderedNames).toEqual(["echo", "hello"]);
  });

  it("includes the readme content", async () => {
    const fixtures = path.resolve("./platform/test/fixtures/services");
    const [echo] = await findModules(fixtures);

    const readme = Bun.file(`${fixtures}/echo/README.md`);
    const content = await readme.text();

    expect(echo.readme).toEqual(content);
  });

  it("includes a summary of the readme", async () => {
    const fixtures = path.resolve("./platform/test/fixtures/services");
    const [echo] = await findModules(fixtures);

    expect(echo.summary).toEqual(
      'This is a test "echo" service. It is dumb as rocks.'
    );
  });
});
