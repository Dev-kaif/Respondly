import { useMutation, useQueryClient } from '@tanstack/react-query'

import { formsQueryKeys, unpublishForm } from '@/src/lib/api'
import { useBuilderStore } from '@/src/stores/builder-store'

export function useUnpublishForm(formId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => unpublishForm(formId),
    onSuccess: (form) => {
      useBuilderStore.setState({ form })
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.detail(formId) })
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
