import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { createDb } from '../db/index'
import { forms, questions } from '../db/schema'
import type { Bindings, Variables } from '../types'
import {
  apiError,
  createQuestionSchema,
  reorderQuestionsSchema,
  updateQuestionSchema,
  validationError,
} from '../utils/validators'

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Create Question
router.post('/forms/:id/questions', async (c) => {
  const user = c.get('user')
  if (!user) return apiError(c, 401, 'Unauthorized')

  const parsed = createQuestionSchema.safeParse(await c.req.json())

  if (!parsed.success) return validationError(c, parsed.error)

  const body = parsed.data

  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) return apiError(c, 404, 'Form not found')

  const lastQuestion = await db
    .select()
    .from(questions)
    .where(eq(questions.formId, form.id))
    .orderBy(desc(questions.position))
    .get()

  const position = (lastQuestion?.position ?? -1) + 1

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
      optionsJson: body.options ? JSON.stringify(body.options) : null,
    })
    .returning()

  return c.json(question, 201)
})

// Update Question
router.put('/questions/:id', async (c) => {
  const user = c.get('user')
  if (!user) return apiError(c, 401, 'Unauthorized')

  const parsed = updateQuestionSchema.safeParse(await c.req.json())

  if (!parsed.success) return validationError(c, parsed.error)

  const body = parsed.data

  const db = createDb(c.env)

  const question = await db
    .select({
      question: questions,
      formUserId: forms.userId,
    })
    .from(questions)
    .innerJoin(forms, eq(forms.id, questions.formId))
    .where(eq(questions.id, c.req.param('id')))
    .get()

  if (!question) return apiError(c, 404, 'Question not found')
  if (question.formUserId !== user.id) return apiError(c, 401, 'Unauthorized')

  const [updated] = await db
    .update(questions)
    .set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.placeholder !== undefined && { placeholder: body.placeholder }),
      ...(body.required !== undefined && { required: body.required }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.options !== undefined && { optionsJson: JSON.stringify(body.options) }),
      ...(body.settingsJson !== undefined && { settingsJson: body.settingsJson }),
    })
    .where(eq(questions.id, c.req.param('id')))
    .returning()

  return c.json(updated)
})

// Delete Question
router.delete('/questions/:id', async (c) => {
  const user = c.get('user')
  if (!user) return apiError(c, 401, 'Unauthorized')

  const db = createDb(c.env)

  const question = await db
    .select({
      question: questions,
      formUserId: forms.userId,
    })
    .from(questions)
    .innerJoin(forms, eq(forms.id, questions.formId))
    .where(eq(questions.id, c.req.param('id')))
    .get()

  if (!question) return apiError(c, 404, 'Question not found')
  if (question.formUserId !== user.id) return apiError(c, 401, 'Unauthorized')

  await db.delete(questions).where(eq(questions.id, c.req.param('id')))

  return c.json({ success: true })
})

// Reorder Questions
router.patch('/forms/:id/questions/reorder', async (c) => {
  const user = c.get('user')

  if (!user) {
    return apiError(c, 401, 'Unauthorized')
  }

  const parsed = reorderQuestionsSchema.safeParse(await c.req.json())

  if (!parsed.success) {
    return validationError(c, parsed.error)
  }

  const { ids } = parsed.data

  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) {
    return apiError(c, 404, 'Form not found')
  }

  const formQuestions = await db
    .select({
      id: questions.id,
    })
    .from(questions)
    .where(eq(questions.formId, form.id))

  const validIds = new Set(formQuestions.map((q) => q.id))

  if (ids.length !== formQuestions.length || ids.some((id) => !validIds.has(id))) {
    return apiError(c, 400, 'Invalid question order')
  }

  await Promise.all(
    ids.map((id, index) =>
      db
        .update(questions)
        .set({
          position: index,
        })
        .where(and(eq(questions.id, id), eq(questions.formId, form.id))),
    ),
  )

  return c.json({
    success: true,
  })
})

export default router
