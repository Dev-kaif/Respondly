import { useQuery } from '@tanstack/react-query'

import { type FormsQueryParams, formsQueryKeys, getForms } from '@/src/lib/api'

export function useForms(params: FormsQueryParams = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20

  return useQuery({
    queryKey: formsQueryKeys.list({ page, limit }),
    queryFn: () => getForms({ page, limit }),
  })
}
