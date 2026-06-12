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
  isPublished: boolean
  createdAt: string | number
  updatedAt: string | number
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

type ApiErrorBody = {
  error?: string
  details?: unknown
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

    try {
      const body = (await response.json()) as ApiErrorBody
      message = body.error || message
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export const formsQueryKeys = {
  all: ['forms'] as const,
  list: (params: Required<FormsQueryParams>) => [...formsQueryKeys.all, 'list', params] as const,
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

export function duplicateForm(id: string) {
  return apiRequest<FormResponse>(`/api/forms/${id}/duplicate`, {
    method: 'POST',
  })
}

export function getFormTimestamp(form: FormResponse) {
  const value = form.updatedAt ?? form.createdAt
  const date = typeof value === 'number' ? new Date(value) : new Date(value)

  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}
