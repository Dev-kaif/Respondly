import { stringify } from 'csv-stringify/sync'
import { and, count, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { createDb } from '../db/index'
import { answers, forms, questions, responses } from '../db/schema'
import type { Bindings, Variables } from '../types'
import {
  apiError,
  paginationSchema,
  submitResponseSchema,
  validationError,
} from '../utils/validators'

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Submit Response (Public)
router.post('/survey/:slug/submit', async (c) => {
  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.slug, c.req.param('slug')), eq(forms.isPublished, true)))
    .get()

  if (!form) return apiError(c, 404, 'Form not found')

  const parsed = submitResponseSchema.safeParse(await c.req.json())

  if (!parsed.success) return validationError(c, parsed.error)

  const body = parsed.data

  // Fetch all questions for this form
  const formQuestions = await db.select().from(questions).where(eq(questions.formId, form.id))

  const validQuestionIds = new Set(formQuestions.map((q) => q.id))

  // Ensure all submitted questionIds actually belong to this form
  const invalidAnswer = body.answers.find((a) => !validQuestionIds.has(a.questionId))
  if (invalidAnswer) {
    return apiError(c, 400, `Invalid questionId: ${invalidAnswer.questionId}`)
  }

  // Enforce required questions
  const requiredQuestions = formQuestions.filter((q) => q.required)
  const answeredIds = new Set(body.answers.map((a) => a.questionId))

  const missingRequired = requiredQuestions.find(
    (q) =>
      !answeredIds.has(q.id) ||
      !body.answers.find((a) => a.questionId === q.id && a.value.trim() !== ''),
  )

  if (missingRequired) {
    return apiError(c, 400, `Required question not answered: "${missingRequired.title}"`)
  }

  const responseId = crypto.randomUUID()

  await db.insert(responses).values({
    id: responseId,
    formId: form.id,
  })

  await db.insert(answers).values(
    body.answers.map((answer) => ({
      id: crypto.randomUUID(),
      responseId,
      questionId: answer.questionId,
      value: answer.value,
    })),
  )

  return c.json({ success: true, responseId })
})

// List Responses (Paginated)
router.get('/forms/:id/responses', async (c) => {
  const user = c.get('user')

  if (!user) {
    return apiError(c, 401, 'Unauthorized')
  }

  const paginationParsed = paginationSchema.safeParse(c.req.query())

  if (!paginationParsed.success) {
    return validationError(c, paginationParsed.error)
  }

  const { page, limit } = paginationParsed.data
  const offset = (page - 1) * limit

  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) {
    return apiError(c, 404, 'Form not found')
  }

  const [result, totalResult] = await Promise.all([
    db
      .select({
        id: responses.id,
        submittedAt: responses.submittedAt,
      })
      .from(responses)
      .where(eq(responses.formId, form.id))
      .orderBy(desc(responses.submittedAt))
      .limit(limit)
      .offset(offset),

    db
      .select({
        count: count(),
      })
      .from(responses)
      .where(eq(responses.formId, form.id)),
  ])

  const total = totalResult[0]?.count ?? 0

  return c.json({
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})

// Response Details
router.get('/forms/:id/responses/:responseId', async (c) => {
  const user = c.get('user')
  if (!user) return apiError(c, 401, 'Unauthorized')

  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) return apiError(c, 404, 'Form not found')

  const result = await db
    .select({
      answer: answers.value,
      questionId: answers.questionId,
      questionTitle: questions.title,
      questionType: questions.type,
    })
    .from(answers)
    .innerJoin(questions, eq(questions.id, answers.questionId))
    .where(eq(answers.responseId, c.req.param('responseId')))

  if (!result.length) return apiError(c, 404, 'Response not found')

  return c.json(result)
})

// Delete single response
router.delete('/forms/:id/responses/:responseId', async (c) => {
  const user = c.get('user')

  if (!user) {
    return apiError(c, 401, 'Unauthorized')
  }

  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) {
    return apiError(c, 404, 'Form not found')
  }

  await db
    .delete(responses)
    .where(and(eq(responses.id, c.req.param('responseId')), eq(responses.formId, form.id)))

  return c.json({
    success: true,
  })
})

// Simple Analytics
router.get('/forms/:id/analytics', async (c) => {
  const user = c.get('user')
  if (!user) return apiError(c, 401, 'Unauthorized')

  const db = createDb(c.env)

  // Ownership check
  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) return apiError(c, 404, 'Form not found')

  const [totalResult] = await db
    .select({ count: count() })
    .from(responses)
    .where(eq(responses.formId, form.id))

  return c.json({
    totalResponses: totalResult?.count ?? 0,
  })
})

// export response csv
router.get('/forms/:id/export', async (c) => {
  const user = c.get('user')

  if (!user) {
    return apiError(c, 401, 'Unauthorized')
  }

  const db = createDb(c.env)

  const form = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, c.req.param('id')), eq(forms.userId, user.id)))
    .get()

  if (!form) {
    return apiError(c, 404, 'Form not found')
  }

  const [formQuestions, allResponses] = await Promise.all([
    db.select().from(questions).where(eq(questions.formId, form.id)).orderBy(questions.position),
    db.select().from(responses).where(eq(responses.formId, form.id)),
  ])

  // fetch only answers belonging to this form's responses
  const allAnswers = allResponses.length
    ? await db
        .select()
        .from(answers)
        .innerJoin(responses, eq(responses.id, answers.responseId))
        .where(eq(responses.formId, form.id))
    : []

  const answerMap = new Map(
    allAnswers.map((a) => [`${a.responses.id}:${a.answers.questionId}`, a.answers.value]),
  )

  const records = allResponses.map((response) =>
    formQuestions.map((question) => answerMap.get(`${response.id}:${question.id}`) ?? ''),
  )

  const csv = stringify(records, {
    header: true,
    columns: formQuestions.map((q) => q.title),
  })

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${form.slug}.csv"`,
    },
  })
})

export default router
