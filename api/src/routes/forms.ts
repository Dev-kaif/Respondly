import { Hono } from "hono";
import { eq, and, count } from "drizzle-orm";
import { createDb } from "../db/index";
import { forms, questions } from "../db/schema";
import type { Bindings, Variables } from "../types";
import { nanoid } from "nanoid";
import slugify from "slugify";
import {
    createFormSchema,
    updateFormSchema,
    renameFormSchema,
    validationError,
    apiError,
    paginationSchema,
} from "../utils/validators";

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// List User's Forms
router.get("/forms", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const parsed = paginationSchema.safeParse(c.req.query());

    if (!parsed.success) {
        return validationError(c, parsed.error);
    }

    const { page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    const db = createDb(c.env);

    const [data, totalResult] = await Promise.all([
        db
            .select()
            .from(forms)
            .where(eq(forms.userId, user.id))
            .limit(limit)
            .offset(offset),

        db
            .select({ count: count() })
            .from(forms)
            .where(eq(forms.userId, user.id)),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return c.json({
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
});

// Create Form
router.post("/forms", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const parsed = createFormSchema.safeParse(await c.req.json());

    if (!parsed.success) return validationError(c, parsed.error);

    const { title, description } = parsed.data;

    const db = createDb(c.env);
    const id = crypto.randomUUID();
    const slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;

    const [form] = await db
        .insert(forms)
        .values({
            id,
            userId: user.id,
            title,
            description: description ?? null,
            slug,
        })
        .returning();

    return c.json(form, 201);
});

// Get Form With Questions
router.get("/forms/:id", async (c) => {
    const user = c.get("user");

    if (!user) return apiError(c, 401, "Unauthorized");

    const db = createDb(c.env);
    const form = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!form) return apiError(c, 404, "Form not found");

    const formQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, form.id))
        .orderBy(questions.position);

    return c.json({ ...form, questions: formQuestions });
});

// Update Form
router.put("/forms/:id", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const parsed = updateFormSchema.safeParse(await c.req.json());

    if (!parsed.success) return validationError(c, parsed.error);

    const body = parsed.data;

    const db = createDb(c.env);

    const existing = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!existing) return apiError(c, 404, "Form not found");

    const [updated] = await db
        .update(forms)
        .set({
            ...(body.title && { title: body.title }),
            ...(body.description !== undefined && { description: body.description }),
            ...(body.primaryColor && { primaryColor: body.primaryColor }),
            ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
            ...(body.backgroundUrl !== undefined && { backgroundUrl: body.backgroundUrl }),
            ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
            updatedAt: new Date(),
        })
        .where(eq(forms.id, c.req.param("id")))
        .returning();

    return c.json(updated);
});

// Delete Form
router.delete("/forms/:id", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const db = createDb(c.env);

    const existing = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!existing) return apiError(c, 404, "Form not found");

    await db.delete(forms).where(eq(forms.id, c.req.param("id")));

    return c.json({ success: true });
});

// Publish Form
router.post("/forms/:id/publish", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const db = createDb(c.env);

    // Ensure the form exists and belongs to the user
    const form = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .get();

    if (!form) return apiError(c, 404, "Form not found");

    // Must have at least one question before publishing
    const formQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, form.id));

    if (!formQuestions.length) {
        return apiError(c, 400, "Cannot publish a form with no questions");
    }

    const [updated] = await db
        .update(forms)
        .set({ isPublished: true, updatedAt: new Date() })
        .where(eq(forms.id, c.req.param("id")))
        .returning();

    return c.json(updated);
});

// Unpublish Form
router.post("/forms/:id/unpublish", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const db = createDb(c.env);

    const [form] = await db
        .update(forms)
        .set({ isPublished: false, updatedAt: new Date() })
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .returning();

    if (!form) return apiError(c, 404, "Form not found");

    return c.json(form);
});

// Rename Form
router.patch("/forms/:id/rename", async (c) => {
    const user = c.get("user");
    if (!user) return apiError(c, 401, "Unauthorized");

    const parsed = renameFormSchema.safeParse(await c.req.json());

    if (!parsed.success) return validationError(c, parsed.error);

    const db = createDb(c.env);

    const [form] = await db
        .update(forms)
        .set({ title: parsed.data.title, updatedAt: new Date() })
        .where(and(eq(forms.id, c.req.param("id")), eq(forms.userId, user.id)))
        .returning();

    if (!form) return apiError(c, 404, "Form not found");

    return c.json(form);
});

// Create form copy
router.post("/forms/:id/duplicate", async (c) => {
    const user = c.get("user");

    if (!user) {
        return apiError(c, 401, "Unauthorized");
    }

    const db = createDb(c.env);

    const original = await db
        .select()
        .from(forms)
        .where(
            and(
                eq(forms.id, c.req.param("id")),
                eq(forms.userId, user.id)
            )
        )
        .get();

    if (!original) {
        return apiError(c, 404, "Form not found");
    }

    const originalQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, original.id));

    const newFormId = crypto.randomUUID();

    const [newForm] = await db
        .insert(forms)
        .values({
            id: newFormId,
            userId: user.id,
            title: `${original.title} Copy`,
            description: original.description,
            slug: `${slugify(original.title, {
                lower: true,
                strict: true,
            })}-${nanoid(6)}`,
            theme: original.theme,
            primaryColor: original.primaryColor,
            logoUrl: original.logoUrl,
            backgroundUrl: original.backgroundUrl,
            isPublished: false,
        })
        .returning();

    if (originalQuestions.length) {
        await db.insert(questions).values(
            originalQuestions.map((q) => ({
                id: crypto.randomUUID(),
                formId: newFormId,
                type: q.type,
                title: q.title,
                placeholder: q.placeholder,
                required: q.required,
                position: q.position,
                optionsJson: q.optionsJson,
            }))
        );
    }

    return c.json(newForm, 201);
});

// Public Survey Route
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

    if (!form) return apiError(c, 404, "Form not found");

    const formQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.formId, form.id))
        .orderBy(questions.position);

    return c.json({
        id: form.id,
        title: form.title,
        description: form.description,
        slug: form.slug,
        theme: form.theme,
        primaryColor: form.primaryColor,
        logoUrl: form.logoUrl,
        backgroundUrl: form.backgroundUrl,
        questions: formQuestions.map((q) => ({
            id: q.id,
            type: q.type,
            title: q.title,
            placeholder: q.placeholder,
            required: q.required,
            position: q.position,
            optionsJson: q.optionsJson,
        })),
    });
});

export default router;