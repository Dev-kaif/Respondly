import { createMiddleware } from "hono/factory";
import { createAuth } from "../utils/auth";
import type { Bindings, Variables } from "../types";

export const authMiddleware = createMiddleware<{
    Bindings: Bindings;
    Variables: Variables;
}>(async (c, next) => {

    if (c.req.path.startsWith("/api/auth")) {
        return next();
    }
    
    const authInstance = createAuth(c.env);
    const session = await authInstance.api.getSession({
        headers: c.req.raw.headers,
    });
    c.set("user", session?.user ?? null);
    c.set("session", session?.session ?? null);

    await next();
});