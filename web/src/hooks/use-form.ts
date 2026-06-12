import { useQuery } from '@tanstack/react-query'

import { formsQueryKeys, getForm } from '@/src/lib/api'

export function useForm(id: string) {
  return useQuery({
    queryKey: formsQueryKeys.detail(id),
    queryFn: () => getForm(id),
  })
}
