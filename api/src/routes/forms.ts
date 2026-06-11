import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { createDb } from "../db/index";
import { forms, questions } from "../db/schema";
import type { Bindings, Variables } from "../types";
import { nanoid } from "nanoid";
import slugify from "slugify";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// list user's forms
router.get("/forms", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);
    const userForms = await db
        .select()
        .from(forms)
        .where(eq(forms.userId, user.id));

    return c.json(userForms);
});

// create form
router.post("/forms", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<{ title: string; description?: string }>();
    if (!body.title) return c.json({ error: "Title is required" }, 400);

    const db = createDb(c.env);
    const id = nanoid();
    const slug = `${slugify(body.title, { lower: true, strict: true })}-${nanoid(6)}`;

    const [form] = await db
        .insert(forms)
        .values({
            id,
            userId: user.id,
            title: body.title,
            description: body.description ?? null,
            slug,
        })
        .returning();

    return c.json(form, 201);
});

// get form with questions
router.get("/forms/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);
    const form = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!form) return c.json({ error: "Form not found" }, 404);

    const formQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, form.id))
        .orderBy(questions.position);

    return c.json({ ...form, questions: formQuestions });
});

// update form
router.put("/forms/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<{
        title?: string;
        description?: string;
        primaryColor?: string;
        logoUrl?: string;
        backgroundUrl?: string;
        isPublished?: boolean;
    }>();

    const db = createDb(c.env);

    const existing = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!existing) return c.json({ error: "Form not found" }, 404);

    const [updated] = await db
        .update(forms)
        .set({
            ...(body.title && { title: body.title }),
            ...(body.description !== undefined && { description: body.description }),
            ...(body.primaryColor && { primaryColor: body.primaryColor }),
            ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
            ...(body.backgroundUrl !== undefined && {
                backgroundUrl: body.backgroundUrl,
            }),
            ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
            updatedAt: new Date(),
        })
        .where(eq(forms.id, c.req.param("id")))
        .returning();

    return c.json(updated);
});

// delete form
router.delete("/forms/:id", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);

    const existing = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!existing) return c.json({ error: "Form not found" }, 404);

    await db.delete(forms).where(eq(forms.id, c.req.param("id")));

    return c.json({ success: true });
});

// Publish Form
router.post("/forms/:id/publish", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);

    const [form] = await db
        .update(forms)
        .set({
            isPublished: true,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(forms.id, c.req.param("id")),
                eq(forms.userId, user.id)
            )
        )
        .returning();

    if (!form) {
        return c.json({ error: "Form not found" }, 404);
    }

    return c.json(form);
});

// Unpublish Form
router.post("/forms/:id/unpublish", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const db = createDb(c.env);

    const [form] = await db
        .update(forms)
        .set({
            isPublished: false,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(forms.id, c.req.param("id")),
                eq(forms.userId, user.id)
            )
        )
        .returning();

    if (!form) {
        return c.json({ error: "Form not found" }, 404);
    }

    return c.json(form);
});

// Rename Form
router.patch("/forms/:id/rename", async (c) => {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<{ title: string }>();

    if (!body.title) {
        return c.json({ error: "Title is required" }, 400);
    }

    const db = createDb(c.env);

    const [form] = await db
        .update(forms)
        .set({
            title: body.title,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(forms.id, c.req.param("id")),
                eq(forms.userId, user.id)
            )
        )
        .returning();

    if (!form) {
        return c.json({ error: "Form not found" }, 404);
    }

    return c.json(form);
});

// Public Form Route
router.get("/survey/:slug", async (c) => {
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

    const formQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, form.id))
        .orderBy(questions.position);

    return c.json({
        ...form,
        questions: formQuestions,
    });
});

export default router;