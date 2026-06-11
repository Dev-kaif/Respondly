import { Hono } from "hono";
import type { Bindings } from "../types";
import { createDb } from "../db";
import { user } from "../db/auth-schema";

const router = new Hono<{ Bindings: Bindings }>({ strict: false });


router.get("/health", async (c) => {
    const db = createDb(c.env.survey_builder);

    const result = await db.select().from(user);

    return c.json({
        result,
        success: true,
        status: "ok",
    });
});

export default router;