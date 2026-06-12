import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteResponse, formResponsesQueryKeys } from '@/src/lib/api'

export function useDeleteResponse(formId: string, responseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteResponse(formId, responseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: formResponsesQueryKeys.all(formId) })
    },
  })
}
