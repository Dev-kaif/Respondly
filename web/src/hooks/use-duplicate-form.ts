import { useMutation, useQueryClient } from '@tanstack/react-query'

import { duplicateForm, formsQueryKeys } from '@/src/lib/api'

export function useDuplicateForm(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => duplicateForm(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
