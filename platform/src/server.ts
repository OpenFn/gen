import { Elysia } from "elysia";

import { run } from "./bridge";

const app = new Elysia();

// This is bit of an elysia tutorial for now
app.get("/", (ctx) => {
  ctx.set.status = 200; // set the return status

  // set headers through context
  ctx.set.headers["Content-Type"] = "application/text";

  return "hello world!";
});

app.group("/services", (app) => {
  // TODO: autogenerate these routes
  app.post("echo", async (ctx) => {
    // Note that elysia handles json parsing for me - neat!
    const payload = ctx.body;

    const result = await run("echo", payload);

    // elysia will also stringify and set the headers if I return json
    return result;
  });

  return app;
});

const port = process.env.PORT || 3000;
console.log("Apollo Server listening on ", port);
app.listen(port);