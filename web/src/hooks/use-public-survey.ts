import { useQuery } from '@tanstack/react-query'

import { getPublicSurvey } from '@/src/lib/api'

export const publicSurveyQueryKeys = {
  detail: (slug: string) => ['public-survey', slug] as const,
}

export function usePublicSurvey(slug: string) {
  return useQuery({
    queryKey: publicSurveyQueryKeys.detail(slug),
    queryFn: () => getPublicSurvey(slug),
  })
}
