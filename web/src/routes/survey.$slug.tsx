import { createFileRoute } from '@tanstack/react-router'

import { PublicSurveyForm } from '@/src/components/survey/public-survey-form'
import { SurveyNotFound } from '@/src/components/survey/survey-not-found'
import { SurveySkeleton } from '@/src/components/survey/survey-skeleton'
import { usePublicSurvey } from '@/src/hooks/use-public-survey'
import { ApiRequestError } from '@/src/lib/api'
import { mergeBuilderConfig } from '@/src/lib/builder-config'
import { normalizeApiQuestions } from '@/src/lib/builder-questions'

export const Route = createFileRoute('/survey/$slug')({
  component: PublicSurveyRoute,
})

function PublicSurveyRoute() {
  const { slug } = Route.useParams()
  const surveyQuery = usePublicSurvey(slug)

  if (surveyQuery.isLoading) {
    return <SurveySkeleton />
  }

  if (surveyQuery.isError) {
    if (surveyQuery.error instanceof ApiRequestError && surveyQuery.error.status === 404) {
      return <SurveyNotFound />
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
        <section className="w-full max-w-md rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          {surveyQuery.error.message}
        </section>
      </main>
    )
  }

  const survey = surveyQuery.data

  if (!survey) {
    return <SurveyNotFound />
  }

  const questions = normalizeApiQuestions(
    [...survey.questions].sort((a, b) => a.position - b.position),
  )

  return (
    <PublicSurveyForm
      slug={slug}
      title={survey.title}
      description={survey.description}
      questions={questions}
      builderConfig={mergeBuilderConfig(survey.builderConfig)}
    />
  )
}
