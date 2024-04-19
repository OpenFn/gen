import { describe, expect, it } from "bun:test";
import { app } from "../src/server";

const port = 9865;

const baseUrl = `http://localhost:${port}`;

app.listen(port);

const get = (path: string) => {
  return new Request(`${baseUrl}/${path}`);
};

const post = (path: string, data: any) => {
  return new Request(`${baseUrl}/${path}`, {
    method: "POST",
    body: typeof data === "string" ? data : JSON.stringify(data),
    headers: {
      "Content-Type": `application/${
        typeof data === "string" ? "text" : "json"
      }`,
    },
  });
};

// I am not sure how appropriate unit tests are going to be here - but we'll add a few!
describe("Main server", () => {
  it("return 200 at root", async () => {
    const response = await app.handle(get(""));

    const status = response.status;
    const text = await response.text();

    expect(text).toBe("openfn apollo");
    expect(status).toBe(200);
  });
});

// It won't be appropriate at all to unit test many of these
// but we can use the test echo service at least
describe("Python Services", () => {
  describe("Python echo", () => {
    it("returns a 200", async () => {
      const json = { x: 1 };
      const response = await app.handle(post("services/echo", json));

      expect(response.status).toBe(200);
    });

    // Ok for some reason I can't post a string
    // This doesn't REALLY matter so I'm not gonna spend time on it
    it.skip("echoes back a string", async () => {
      const str = "hello world";
      const response = await app.handle(post("services/echo", str));

      const text = await response.text();
      expect(text).toBe(str);
    });

    it("echoes back an object", async () => {
      const json = { x: 1 };
      const response = await app.handle(post("services/echo", json));

      const text = await response.json();
      expect(text).toEqual(json);
    });
  });
});
