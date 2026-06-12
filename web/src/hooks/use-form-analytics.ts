import { useQuery } from '@tanstack/react-query'

import { formResponsesQueryKeys, getFormAnalytics } from '@/src/lib/api'

export function useFormAnalytics(formId: string) {
  return useQuery({
    queryKey: formResponsesQueryKeys.analytics(formId),
    queryFn: () => getFormAnalytics(formId),
  })
}
