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

      // simple post
      app.post(name, async (ctx) => {
        console.log(` >> POST to /services/${name}`);
        // Note that elysia handles json parsing for me - neat!
        const payload = ctx.body;
        const result = await run(name, payload as any);
        console.log("> RESULT", result);
        // elysia will also stringify and set the headers if I return json
        return result;
      });

      // websocket
      // TODO in the web socket API, does it make more sense to open a socket at root
      // and then pick the service you want? So you'd connect to /ws an send { call: 'echo', payload: {} }
      app.ws(name, {
        open() {
          console.log(` >> CONNECT at /services/${name}`);
        },
        message(ws, message) {
          try {
            if (message.event === "start") {
              const onLog = (log: string) => {
                ws.send({
                  event: "log",
                  data: log,
                });
              };

              run(name, message.data as any, onLog).then((result) => {
                ws.send({
                  event: "complete",
                  data: result,
                });
              });
            }
          } catch (e) {
            console.log(e);
          }
        },
      });

      // TODO: it would be lovely to render the markdown into nice rich html
      app.get(`/${name}/README.md`, async (ctx) => readme);
    });

    return app;
  });

  return app;
};
