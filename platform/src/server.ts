import { Elysia } from "elysia";

import setupDir from "./middleware/dir";
import setupServices from "./middleware/services";
import { html } from "@elysiajs/html";

export const app = new Elysia();

app.use(html());

setupDir(app);
await setupServices(app);

export default (port: number | string = 3000) => {
  console.log("Apollo Server listening on ", port);
  app.listen(port);
};
