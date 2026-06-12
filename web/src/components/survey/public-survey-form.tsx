import { LoaderCircle } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SurveyQuestionField } from '@/src/components/survey/survey-question-field'
import { SurveySuccess } from '@/src/components/survey/survey-success'
import { SurveyRenderer } from '@/src/components/survey-renderer'
import { getSurveyBackgroundStyle } from '@/src/components/survey-renderer/appearance'
import { useSubmitSurvey } from '@/src/hooks/use-submit-survey'
import type { BuilderConfig } from '@/src/lib/builder-config'
import type { BuilderQuestion } from '@/src/lib/builder-questions'

type PublicSurveyFormProps = {
  slug: string
  title: string
  description: string | null
  questions: BuilderQuestion[]
  builderConfig: BuilderConfig
}

type Answers = Record<string, string>
type ValidationErrors = Record<string, string>

export function PublicSurveyForm({
  slug,
  title,
  description,
  questions,
  builderConfig,
}: PublicSurveyFormProps) {
  const submitMutation = useSubmitSurvey(slug)
  const [answers, setAnswers] = useState<Answers>({})
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function updateAnswer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
    setErrors((current) => {
      if (!current[questionId]) {
        return current
      }

      const next = { ...current }
      delete next[questionId]
      return next
    })
  }

  function validateAnswers() {
    const nextErrors: ValidationErrors = {}

    for (const question of questions) {
      if (question.required && !answers[question.id]?.trim()) {
        nextErrors[question.id] = 'This question is required.'
      }
    }

    setErrors(nextErrors)
    return nextErrors
  }

  function submitSurvey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitted || submitMutation.isPending) {
      return
    }

    const nextErrors = validateAnswers()

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please answer all required questions.')
      return
    }

    const payload = {
      answers: Object.entries(answers)
        .filter(([, value]) => value.trim().length > 0)
        .map(([questionId, value]) => ({
          questionId,
          value,
        })),
    }

    void toast.promise(
      submitMutation.mutateAsync(payload).then((result) => {
        setSubmitted(true)
        return result
      }),
      {
        loading: 'Submitting response...',
        success: 'Response submitted.',
        error: (error) =>
          error instanceof Error ? error.message : 'Failed to submit response. Please try again.',
      },
    )
  }

  if (submitted) {
    return (
      <main
        className="min-h-screen w-full overflow-x-hidden"
        style={getSurveyBackgroundStyle(builderConfig)}
      >
        <SurveySuccess builderConfig={builderConfig} />
      </main>
    )
  }

  return (
    <SurveyRenderer
      mode="public"
      title={title}
      description={description}
      questions={questions}
      builderConfig={builderConfig}
      renderQuestions={(items) => (
        <form id="public-survey-form" className="space-y-3" onSubmit={submitSurvey} noValidate>
          {items.map((question, index) => (
            <SurveyQuestionField
              key={question.id}
              question={question}
              index={index}
              value={answers[question.id] ?? ''}
              error={errors[question.id]}
              builderConfig={builderConfig}
              onChange={(value) => updateAnswer(question.id, value)}
            />
          ))}
          {submitMutation.isError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {submitMutation.error instanceof Error
                ? submitMutation.error.message
                : 'Failed to submit response. Please try again.'}
            </p>
          ) : null}
        </form>
      )}
      renderSubmit={() => (
        <SubmitButton
          builderConfig={builderConfig}
          pending={submitMutation.isPending}
          disabled={submitted}
        />
      )}
    />
  )
}

function SubmitButton({
  builderConfig,
  pending,
  disabled,
}: {
  builderConfig: BuilderConfig
  pending: boolean
  disabled: boolean
}) {
  const justify = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[builderConfig.submitButton.alignment]

  return (
    <div className={cn('flex', justify)}>
      <Button
        form="public-survey-form"
        type="submit"
        className="min-w-32"
        disabled={pending || disabled}
        style={{
          backgroundColor: builderConfig.primaryColor,
          color: '#ffffff',
        }}
      >
        {pending ? <LoaderCircle className="animate-spin" /> : null}
        {pending ? 'Submitting...' : builderConfig.submitButton.text || 'Submit'}
      </Button>
    </div>
  )
}
