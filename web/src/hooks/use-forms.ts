import { useQuery } from '@tanstack/react-query'

import { type FormsQueryParams, formsQueryKeys, getForms } from '@/src/lib/api'

export function useForms(params: FormsQueryParams = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const search = params.search ?? ''

  return useQuery({
    queryKey: formsQueryKeys.list({ page, limit, search }),
    queryFn: () => getForms({ page, limit, search }),
  })
}
