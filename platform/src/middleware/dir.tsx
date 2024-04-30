import { Elysia } from "elysia";
import path from "node:path";
import describeModules, { type ModuleDescription } from "../util/describe-modules";

/**
 * Generates a listing of the available services
 */
export default async (app: Elysia) => {
  // jsx templates!
  // https://elysiajs.com/patterns/mvc.html#view

  const modules = await describeModules(path.resolve("./services"));
  console.log(modules)
  app.get("/", () => {
    return (
      <html lang="en">
        <head>
          <title>Apollo Service Listing</title>
        </head>
        <body>
          <h1>Apollo Service Listing</h1>
          <div>
            <ul>
              {modules.map((m) => service(m))}
            </ul>
          </div>
        </body>
      </html>
    );
  });
};

function service(srv: ModuleDescription) {
  return <li>{srv.name}</li>
}