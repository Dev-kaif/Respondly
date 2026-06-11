import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { createDb } from "../db/index";
import { forms, questions } from "../db/schema";
import type { Bindings, Variables } from "../types";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Create Question
router.post("/forms/:id/questions", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<{
        type: "text" | "multiple_choice" | "rating";
        title: string;
        placeholder?: string;
        required?: boolean;
        options?: string[];
    }>();

    if (!body.title.trim()) {
        return c.json({ error: "Title is required" }, 400);
    }
    

    const db = createDb(c.env);

    const form = await db
        .select()
        .from(forms)
        .where(
            and(
                eq(forms.id, c.req.param("id")),
                eq(forms.userId, user.id)
            )
        )
        .get();

    if (!form) {
        return c.json({ error: "Form not found" }, 404);
    }

    const lastQuestion = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, form.id))
        .orderBy(desc(questions.position))
        .get();

    const position = (lastQuestion?.position ?? -1) + 1;

    const [question] = await db
        .insert(questions)
        .values({
            id: crypto.randomUUID(),
            formId: form.id,
            type: body.type,
            title: body.title,
            placeholder: body.placeholder ?? null,
            required: body.required ?? false,
            position,
            optionsJson: body.options
                ? JSON.stringify(body.options)
                : null,
        })
        .returning();

    return c.json(question, 201);
});

// Update Question
router.put("/questions/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();

    const db = createDb(c.env);

    const question = await db
        .select({
            question: questions,
            formUserId: forms.userId,
        })
        .from(questions)
        .innerJoin(forms, eq(forms.id, questions.formId))
        .where(eq(questions.id, c.req.param("id")))
        .get();

    if (!question) {
        return c.json({ error: "Question not found" }, 404);
    }

    if (question.formUserId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const [updated] = await db
        .update(questions)
        .set({
            ...(body.title !== undefined && {
                title: body.title,
            }),
            ...(body.placeholder !== undefined && {
                placeholder: body.placeholder,
            }),
            ...(body.required !== undefined && {
                required: body.required,
            }),
            ...(body.type !== undefined && {
                type: body.type,
            }),
            ...(body.options !== undefined && {
                optionsJson: JSON.stringify(body.options),
            }),
        })
        .where(eq(questions.id, c.req.param("id")))
        .returning();

    return c.json(updated);
});

// Delete Question
router.delete("/questions/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);

    const question = await db
        .select({
            question: questions,
            formUserId: forms.userId,
        })
        .from(questions)
        .innerJoin(forms, eq(forms.id, questions.formId))
        .where(eq(questions.id, c.req.param("id")))
        .get();

    if (!question) {
        return c.json({ error: "Question not found" }, 404);
    }

    if (question.formUserId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    await db
        .delete(questions)
        .where(eq(questions.id, c.req.param("id")));

    return c.json({ success: true });
});

// Reorder Question
router.patch("/questions/:id/reorder", async (c) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json<{
        position: number;
    }>();

    const db = createDb(c.env);

    const question = await db
        .select({
            formUserId: forms.userId,
        })
        .from(questions)
        .innerJoin(forms, eq(forms.id, questions.formId))
        .where(eq(questions.id, c.req.param("id")))
        .get();

    if (!question) {
        return c.json({ error: "Question not found" }, 404);
    }

    if (question.formUserId !== user.id) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const [updated] = await db
        .update(questions)
        .set({
            position: body.position,
        })
        .where(eq(questions.id, c.req.param("id")))
        .returning();

    return c.json(updated);
});

export default router;

