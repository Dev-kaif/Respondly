import { useMutation, useQueryClient } from '@tanstack/react-query'

import { formsQueryKeys, publishForm } from '@/src/lib/api'
import { useBuilderStore } from '@/src/stores/builder-store'

export function usePublishForm(formId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => publishForm(formId),
    onSuccess: (form) => {
      useBuilderStore.setState({ form })
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.detail(formId) })
      void queryClient.invalidateQueries({ queryKey: formsQueryKeys.all })
    },
  })
}
