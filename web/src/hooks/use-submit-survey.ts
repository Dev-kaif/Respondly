import { useMutation } from '@tanstack/react-query'

import { type SubmitSurveyPayload, submitPublicSurvey } from '@/src/lib/api'

export function useSubmitSurvey(slug: string) {
  return useMutation({
    mutationFn: (payload: SubmitSurveyPayload) => submitPublicSurvey(slug, payload),
  })
}
