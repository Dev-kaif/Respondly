import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  formsQueryKeys,
  type PaginatedFormsResponse,
  type RenameFormPayload,
  renameForm,
} from '@/src/lib/api'

export function useRenameForm(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RenameFormPayload) => renameForm(id, payload),
    onSuccess: (form) => {
      queryClient.setQueriesData<PaginatedFormsResponse>(
        { queryKey: formsQueryKeys.all },
        (page) =>
          page
            ? {
                ...page,
                data: page.data.map((item) => (item.id === form.id ? form : item)),
              }
            : page,
      )
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
