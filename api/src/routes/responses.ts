import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { createDb } from "../db/index";
import { forms, responses, answers, questions } from "../db/schema";
import type { Bindings, Variables } from "../types";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Submit Route
router.post("/survey/:slug/submit", async (c) => {
    const db = createDb(c.env);

    const form = await db
        .select()
        .from(forms)
        .where(
            and(
                eq(forms.slug, c.req.param("slug")),
                eq(forms.isPublished, true)
            )
        )
        .get();

    if (!form) {
        return c.json({ error: "Form not found" }, 404);
    }

    const body = await c.req.json<{
        answers: {
            questionId: string;
            value: string;
        }[];
    }>();

    const responseId = crypto.randomUUID();

    await db.insert(responses).values({
        id: responseId,
        formId: form.id,
    });

    if (body.answers.length) {
        await db.insert(answers).values(
            body.answers.map((answer) => ({
                id: crypto.randomUUID(),
                responseId,
                questionId: answer.questionId,
                value: answer.value,
            }))
        );
    }

    return c.json({
        success: true,
        responseId,
    });
});

// List Responses
router.get("/forms/:id/responses", async (c) => {
    const user = c.get("user");

    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
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

    const result = await db
        .select()
        .from(responses)
        .where(eq(responses.formId, form.id));

    return c.json(result);
});

// Response Details
router.get("/forms/:id/responses/:responseId", async (c) => {
    const user = c.get("user");

    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
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

    const result = await db
        .select({
            answer: answers.value,
            questionId: answers.questionId,
            questionTitle: questions.title,
        })
        .from(answers)
        .innerJoin(
            questions,
            eq(questions.id, answers.questionId)
        )
        .where(eq(answers.responseId, c.req.param("responseId")));

    return c.json(result);
});

// Simple Analytics
router.get("/forms/:id/analytics", async (c) => {
    const user = c.get("user");

    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const db = createDb(c.env);

    const totalResponses = await db
        .select()
        .from(responses)
        .where(eq(responses.formId, c.req.param("id")));

    return c.json({
        totalResponses: totalResponses.length,
    });
});

export default router;