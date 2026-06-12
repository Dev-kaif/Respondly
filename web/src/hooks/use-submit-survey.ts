import { useMutation } from '@tanstack/react-query'

import { submitPublicSurvey, type SubmitSurveyPayload } from '@/src/lib/api'

export function useSubmitSurvey(slug: string) {
  return useMutation({
    mutationFn: (payload: SubmitSurveyPayload) => submitPublicSurvey(slug, payload),
  })
}
