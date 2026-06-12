export type FormResponse = {
  id: string
  userId: string
  title: string
  description: string | null
  slug: string
  theme: string
  primaryColor: string | null
  logoUrl: string | null
  backgroundUrl: string | null
  builderConfig: string | null
  isPublished: boolean
  createdAt: string | number
  updatedAt: string | number
}

export type ApiQuestion = {
  id: string
  formId: string
  type: string
  title: string
  placeholder: string | null
  required: boolean
  position: number
  optionsJson: string | null
  settingsJson: string | null
  createdAt: string | number
}

export type BuilderForm = FormResponse

export type FormDetailResponse = BuilderForm & {
  questions: ApiQuestion[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedFormsResponse = {
  data: FormResponse[]
  pagination: PaginationMeta
}

export type FormsQueryParams = {
  page?: number
  limit?: number
}

export type CreateFormPayload = {
  title: string
  description?: string
}

export type RenameFormPayload = {
  title: string
}

export type SaveFormBuilderPayload = {
  title: string
  description: string | null
  theme: string
  builderConfig: string
}

export type SaveQuestionPayload = {
  type: ApiQuestion['type']
  title: string
  placeholder: string | null
  required: boolean
  position: number
  optionsJson: string[] | null
  settingsJson: string | null
}

type ApiErrorBody = {
  error?: string
  details?: unknown
}

export class ApiRequestError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.details = details
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'Request failed. Please try again.'
    let details: unknown

    try {
      const body = (await response.json()) as ApiErrorBody
      message = body.error || message
      details = body.details
    } catch {
      message = response.statusText || message
    }

    throw new ApiRequestError(message, response.status, details)
  }

  return response.json() as Promise<T>
}

export const formsQueryKeys = {
  all: ['forms'] as const,
  list: (params: Required<FormsQueryParams>) => [...formsQueryKeys.all, 'list', params] as const,
  detail: (id: string) => ['form', id] as const,
}

export function getForms(params: FormsQueryParams = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  return apiRequest<PaginatedFormsResponse>(`/api/forms?${searchParams.toString()}`)
}

export function getForm(id: string) {
  return apiRequest<FormDetailResponse>(`/api/forms/${id}`)
}

export function createForm(payload: CreateFormPayload) {
  return apiRequest<FormResponse>('/api/forms', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function renameForm(id: string, payload: RenameFormPayload) {
  return apiRequest<FormResponse>(`/api/forms/${id}/rename`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteForm(id: string) {
  return apiRequest<{ success: true }>(`/api/forms/${id}`, {
    method: 'DELETE',
  })
}

export function saveFormBuilder(id: string, payload: SaveFormBuilderPayload) {
  return apiRequest<BuilderForm>(`/api/forms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function createQuestion(formId: string, payload: SaveQuestionPayload) {
  return apiRequest<ApiQuestion>(`/api/forms/${formId}/questions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateQuestion(id: string, payload: SaveQuestionPayload) {
  return apiRequest<ApiQuestion>(`/api/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteQuestion(id: string) {
  return apiRequest<{ success: true }>(`/api/questions/${id}`, {
    method: 'DELETE',
  })
}

export function reorderQuestions(formId: string, ids: string[]) {
  return apiRequest<{ success: true }>(`/api/forms/${formId}/questions/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ ids }),
  })
}

export function publishForm(id: string) {
  return apiRequest<BuilderForm>(`/api/forms/${id}/publish`, {
    method: 'POST',
  })
}

export function unpublishForm(id: string) {
  return apiRequest<BuilderForm>(`/api/forms/${id}/unpublish`, {
    method: 'POST',
  })
}

export function duplicateForm(id: string) {
  return apiRequest<FormResponse>(`/api/forms/${id}/duplicate`, {
    method: 'POST',
  })
}

export type PublicSurveyResponse = {
  id: string
  title: string
  description: string | null
  slug: string
  theme: string
  builderConfig: string | null
  questions: ApiQuestion[]
}

export type SubmitSurveyPayload = {
  answers: Array<{
    questionId: string
    value: string
  }>
}

export function getPublicSurvey(slug: string) {
  return apiRequest<PublicSurveyResponse>(`/api/survey/${slug}`)
}

export function submitPublicSurvey(slug: string, payload: SubmitSurveyPayload) {
  return apiRequest<{ success: true }>(`/api/survey/${slug}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getFormTimestamp(form: FormResponse) {
  const value = form.updatedAt ?? form.createdAt
  const date = typeof value === 'number' ? new Date(value) : new Date(value)

  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}
