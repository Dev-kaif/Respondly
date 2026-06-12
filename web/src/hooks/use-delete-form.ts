import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteForm, formsQueryKeys, type PaginatedFormsResponse } from '@/src/lib/api'

export function useDeleteForm(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteForm(id),
    onSuccess: () => {
      queryClient.setQueriesData<PaginatedFormsResponse>(
        { queryKey: formsQueryKeys.all },
        (page) =>
          page
            ? {
                data: page.data.filter((item) => item.id !== id),
                pagination: {
                  ...page.pagination,
                  total: Math.max(0, page.pagination.total - 1),
                  totalPages: Math.max(
                    1,
                    Math.ceil(Math.max(0, page.pagination.total - 1) / page.pagination.limit),
                  ),
                },
              }
            : page,
      )
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
