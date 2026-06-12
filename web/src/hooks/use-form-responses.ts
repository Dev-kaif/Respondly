import { useQuery } from '@tanstack/react-query'

import {
  type FormResponsesQueryParams,
  formResponsesQueryKeys,
  getFormResponses,
} from '@/src/lib/api'

export function useFormResponses(formId: string, params: Required<FormResponsesQueryParams>) {
  return useQuery({
    queryKey: formResponsesQueryKeys.list(formId, params),
    queryFn: () => getFormResponses(formId, params),
  })
}
