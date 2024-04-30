// middleware to route to python services
import { Elysia } from "elysia";
import path from "node:path";

import { run } from "../bridge";
import describeModules from "../util/describe-modules";

export default async (app: Elysia) => {
  console.log("Loading routes:");
  const modules = await describeModules(path.resolve("./services"));
  app.group("/services", (app) => {
    modules.forEach(({ name, readme }) => {
      console.log(" - mounted /services/" + name);
      app.post(name, async (ctx) => {
        // Note that elysia handles json parsing for me - neat!
        const payload = ctx.body;
        const result = await run(name, payload as any);

        // elysia will also stringify and set the headers if I return json
        return result;
      });

      // TODO: it would be lovely to render the markdown into nice rich html
      app.get(`/${name}/README.md`, async (ctx) => readme);
    });

    return app;
  });

  return app;
};
