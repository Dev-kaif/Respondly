import { useQuery } from '@tanstack/react-query'

import { formResponsesQueryKeys, getFormResponse } from '@/src/lib/api'

export function useFormResponse(formId: string, responseId: string) {
  return useQuery({
    queryKey: formResponsesQueryKeys.detail(formId, responseId),
    queryFn: () => getFormResponse(formId, responseId),
  })
}
