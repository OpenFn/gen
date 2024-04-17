import { Elysia } from "elysia";

const app = new Elysia();

// This is bit of an elysia tutorial for now
app.get("/", (ctx) => {
  ctx.set.status = 200; // set the return status

  // set headers through context
  ctx.set.headers["Content-Type"] = "application/text";

  return "hello world!";
});

app.group("/services", (app) =>
  // Create service routes here
  app
    .post("/sign-in", () => "Sign in")
    .post("/sign-up", () => "Sign up")
    .post("/profile", () => "Profile")
);

const port = process.env.PORT || 3000;
console.log("Apollo Server listening on ", port);
app.listen(port);
