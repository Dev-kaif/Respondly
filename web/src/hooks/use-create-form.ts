import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  type CreateFormPayload,
  createForm,
  formsQueryKeys,
  getFormTimestamp,
  type PaginatedFormsResponse,
} from '@/src/lib/api'

function addFormToPage(page: PaginatedFormsResponse, form: PaginatedFormsResponse['data'][number]) {
  const exists = page.data.some((item) => item.id === form.id)
  const nextData = exists ? page.data : [form, ...page.data]
  const sorted = nextData
    .sort((a, b) => getFormTimestamp(b) - getFormTimestamp(a))
    .slice(0, page.pagination.limit)

  return {
    data: sorted,
    pagination: {
      ...page.pagination,
      total: exists ? page.pagination.total : page.pagination.total + 1,
      totalPages: Math.max(
        1,
        Math.ceil(
          (exists ? page.pagination.total : page.pagination.total + 1) / page.pagination.limit,
        ),
      ),
    },
  }
}

export function useCreateForm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFormPayload) => createForm(payload),
    onSuccess: (form) => {
      queryClient.setQueriesData<PaginatedFormsResponse>(
        { queryKey: formsQueryKeys.all },
        (page) => (page ? addFormToPage(page, form) : page),
      )
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
