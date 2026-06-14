import axios, { type AxiosError } from 'axios'

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
  search?: string
}

export type FormResponsesQueryParams = {
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

const apiClient = axios.create({
  // baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      url: path,
      method: (init?.method ?? 'GET') as string,
      data: init?.body,
    })
    return response.data
  } catch (err) {
    const axiosError = err as AxiosError<ApiErrorBody>
    const status = axiosError.response?.status ?? 500
    const body = axiosError.response?.data
    const message = body?.error ?? axiosError.message ?? 'Request failed. Please try again.'
    const details = body?.details
    throw new ApiRequestError(message, status, details)
  }
}

export const formsQueryKeys = {
  all: ['forms'] as const,
  list: (params: Required<FormsQueryParams>) => [...formsQueryKeys.all, 'list', params] as const,
  detail: (id: string) => ['form', id] as const,
}

export function getForms(params: FormsQueryParams = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const search = params.search?.trim() ?? ''

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (search) {
    searchParams.set('search', search)
  }

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

export type FormResponseListItem = {
  id: string
  submittedAt: string
}

export type PaginatedFormResponsesResponse = {
  data: FormResponseListItem[]
  pagination: PaginationMeta
}

export type FormResponseAnswer = {
  questionId: string
  questionTitle: string
  questionType: 'text' | 'multiple_choice' | 'rating'
  answer: string
}

export type FormAnalyticsResponse = {
  totalResponses: number
}

export const formResponsesQueryKeys = {
  all: (formId: string) => ['form-responses', formId] as const,
  list: (formId: string, params: Required<FormResponsesQueryParams>) =>
    [...formResponsesQueryKeys.all(formId), 'list', params] as const,
  detail: (formId: string, responseId: string) =>
    [...formResponsesQueryKeys.all(formId), 'detail', responseId] as const,
  analytics: (formId: string) => [...formResponsesQueryKeys.all(formId), 'analytics'] as const,
}

export function getFormResponses(formId: string, params: FormResponsesQueryParams = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  return apiRequest<PaginatedFormResponsesResponse>(
    `/api/forms/${formId}/responses?${searchParams.toString()}`,
  )
}

export function getFormResponse(formId: string, responseId: string) {
  return apiRequest<FormResponseAnswer[]>(`/api/forms/${formId}/responses/${responseId}`)
}

export function getFormAnalytics(formId: string) {
  return apiRequest<FormAnalyticsResponse>(`/api/forms/${formId}/analytics`)
}

export function deleteResponse(formId: string, responseId: string) {
  return apiRequest<{ success: true }>(`/api/forms/${formId}/responses/${responseId}`, {
    method: 'DELETE',
  })
}

export function getFormTimestamp(form: FormResponse) {
  const value = form.updatedAt ?? form.createdAt
  const date = typeof value === 'number' ? new Date(value) : new Date(value)

  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

export function deleteAccount() {
  return apiRequest<{ success: true }>('/api/user/delete', {
    method: 'DELETE',
  })
}
