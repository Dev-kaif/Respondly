import { Hono } from "hono";
import { createAuth } from "../utils/auth";
import type { Bindings } from "../types";

const router = new Hono<{ Bindings: Bindings }>({ strict: false });

router.on(["POST", "GET"], "/auth/*", (c) => {
    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
});

export default router;