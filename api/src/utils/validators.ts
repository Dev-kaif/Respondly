import type { Context } from 'hono'
import { z } from 'zod'

// Helpers

export function validationError(c: Context, error: z.ZodError) {
  return c.json(
    {
      error: 'Validation failed',
      details: error.flatten(),
    },
    400,
  )
}

export function apiError(c: Context, status: 400 | 401 | 403 | 404 | 409 | 500, message: string) {
  return c.json(
    {
      error: message,
    },
    status,
  )
}

// reorder
export const reorderQuestionsSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one question id required'),
})

// Pagination

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

// Forms

export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
})

export const updateFormSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color')
    .optional(),
  logoUrl: z.string().url('Must be a valid URL').optional().nullable(),
  backgroundUrl: z.string().url('Must be a valid URL').optional().nullable(),
  isPublished: z.boolean().optional(),
  builderConfig: z.string().optional().nullable(),
  theme: z.enum(['minimal', 'corporate', 'wave', 'hero', 'custom']).optional(),
})

export const renameFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
})

// Questions

const multipleChoiceOptions = z
  .array(z.string().min(1, 'Option cannot be empty'))
  .min(2, 'Multiple choice requires at least 2 options')
  .max(20, 'Maximum 20 options allowed')

export const createQuestionSchema = z
  .object({
    type: z.enum(['text', 'multiple_choice', 'rating']),
    title: z.string().min(1, 'Title is required').max(500),
    placeholder: z.string().max(200).optional(),
    required: z.boolean().optional().default(false),
    options: multipleChoiceOptions.optional(),
  })
  .refine((d) => d.type !== 'multiple_choice' || (d.options && d.options.length >= 2), {
    message: 'multiple_choice questions require at least 2 options',
    path: ['options'],
  })

export const updateQuestionSchema = z
  .object({
    type: z.enum(['text', 'multiple_choice', 'rating']).optional(),
    title: z.string().min(1).max(500).optional(),
    placeholder: z.string().max(200).optional().nullable(),
    required: z.boolean().optional(),
    options: multipleChoiceOptions.optional(),
    settingsJson: z.string().optional().nullable(),
  })
  .refine(
    (d) => {
      if (d.type === 'multiple_choice') {
        return d.options && d.options.length >= 2
      }
      return true
    },
    { message: 'multiple_choice questions require at least 2 options', path: ['options'] },
  )

export const reorderQuestionSchema = z.object({
  position: z.number().int().min(0, 'Position must be a non-negative integer'),
})

// Responses
export const submitResponseSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid('Invalid question ID'),
        value: z.string().max(5000, 'Answer too long'),
      }),
    )
    .min(1, 'At least one answer is required'),
})
