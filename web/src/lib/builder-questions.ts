import type { ApiQuestion } from '@/src/lib/api'

export type QuestionType = 'text' | 'multiple_choice' | 'rating'
export type RatingStyle = 'stars' | 'emoji'

type BaseBuilderQuestion = {
  id: string
  title: string
  required: boolean
}

export type TextBuilderQuestion = BaseBuilderQuestion & {
  type: 'text'
  placeholder: string
}

export type MultipleChoiceBuilderQuestion = BaseBuilderQuestion & {
  type: 'multiple_choice'
  options: string[]
}

export type RatingBuilderQuestion = BaseBuilderQuestion & {
  type: 'rating'
  settings: {
    style: RatingStyle
  }
}

export type BuilderQuestion =
  | TextBuilderQuestion
  | MultipleChoiceBuilderQuestion
  | RatingBuilderQuestion

function createTempId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `temp-${crypto.randomUUID()}`
  }

  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function createDefaultQuestion(type: QuestionType): BuilderQuestion {
  const base = {
    id: createTempId(),
    title: 'Untitled Question',
    required: false,
  }

  if (type === 'multiple_choice') {
    return {
      ...base,
      type,
      options: ['Option 1', 'Option 2'],
    }
  }

  if (type === 'rating') {
    return {
      ...base,
      type,
      settings: {
        style: 'stars',
      },
    }
  }

  return {
    ...base,
    type: 'text',
    placeholder: '',
  }
}

function parseOptions(optionsJson: string | null) {
  if (!optionsJson) {
    return ['Option 1', 'Option 2']
  }

  try {
    const parsed = JSON.parse(optionsJson) as unknown
    if (Array.isArray(parsed)) {
      const options = parsed.filter((option): option is string => typeof option === 'string')
      if (options.length >= 2) {
        return options
      }
    }
  } catch {
    return ['Option 1', 'Option 2']
  }

  return ['Option 1', 'Option 2']
}

function parseRatingStyle(settingsJson: string | null): RatingStyle {
  if (!settingsJson) {
    return 'stars'
  }

  try {
    const parsed = JSON.parse(settingsJson) as unknown

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'style' in parsed &&
      (parsed.style === 'stars' || parsed.style === 'emoji')
    ) {
      return parsed.style
    }
  } catch {
    return 'stars'
  }

  return 'stars'
}

export function normalizeApiQuestion(question: ApiQuestion): BuilderQuestion {
  const base = {
    id: question.id,
    title: question.title,
    required: question.required,
  }

  if (question.type === 'multiple_choice') {
    return {
      ...base,
      type: 'multiple_choice',
      options: parseOptions(question.optionsJson),
    }
  }

  if (question.type === 'rating') {
    return {
      ...base,
      type: 'rating',
      settings: {
        style: parseRatingStyle(question.settingsJson),
      },
    }
  }

  return {
    ...base,
    type: 'text',
    placeholder: question.placeholder ?? '',
  }
}

export function normalizeApiQuestions(questions: ApiQuestion[]) {
  return questions.map(normalizeApiQuestion)
}
