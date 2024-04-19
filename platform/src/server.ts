import { Elysia } from "elysia";

import setupServices from "./middleware/services";

export const app = new Elysia();

// This is bit of an elysia tutorial for now
app.get("/", (ctx) => {
  ctx.set.status = 200; // set the return status

  // set headers through context
  ctx.set.headers["Content-Type"] = "application/text";

  return "openfn apollo";
});

await setupServices(app);

export default (port: number | string = 3000) => {
  console.log("Apollo Server listening on ", port);
  app.listen(port);
};
