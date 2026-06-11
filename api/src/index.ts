import { Hono } from "hono";
import type { Bindings, Variables } from "./types";
import { authMiddleware } from "./middleware/auth";
import auth from "./routes/auth";
import health from "./routes/health";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>({
    strict: false,
});

app.use("*", authMiddleware);


const routes = [auth, health] as const;

const api = app.basePath("/api");

routes.forEach((route) => {
    api.route("/", route);
});

export default app;
