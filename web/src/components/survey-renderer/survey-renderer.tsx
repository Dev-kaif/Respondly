import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MultipleChoiceQuestion } from '@/src/components/builder/questions/multiple-choice-question'
import { RatingQuestion } from '@/src/components/builder/questions/rating-question'
import { TextQuestion } from '@/src/components/builder/questions/text-question'
import {
  getSurveyBackgroundStyle,
  getSurveyCardStyle,
} from '@/src/components/survey-renderer/appearance'
import type { BuilderConfig } from '@/src/lib/builder-config'
import type { BuilderQuestion } from '@/src/lib/builder-questions'

type SurveyRendererProps = {
  mode?: 'builder' | 'preview' | 'public'
  title: string
  description?: string | null
  questions: BuilderQuestion[]
  builderConfig: BuilderConfig
  renderQuestions?: (questions: BuilderQuestion[]) => ReactNode
  renderSubmit?: () => ReactNode
  emptyState?: ReactNode
  className?: string
}

export function SurveyRenderer({
  mode = 'public',
  title,
  description,
  questions,
  builderConfig,
  renderQuestions,
  renderSubmit,
  emptyState,
  className,
}: SurveyRendererProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-x-hidden',
        mode === 'builder' ? 'min-h-full overflow-hidden' : 'min-h-screen',
        className,
      )}
      style={getSurveyBackgroundStyle(builderConfig)}
    >
      <SurveyDecoration builderConfig={builderConfig} />
      <div
        className={cn(
          'relative z-10 mx-auto flex min-h-full w-full max-w-3xl flex-col gap-5 px-5',
          mode === 'builder' ? 'py-6' : 'py-10 pb-16',
          builderConfig.hero.enabled && 'max-w-4xl gap-6',
          builderConfig.hero.enabled && mode === 'builder' && 'py-8',
          builderConfig.hero.enabled && mode !== 'builder' && 'py-12 pb-20',
        )}
      >
        <SurveyHeader
          mode={mode}
          title={title}
          description={description}
          builderConfig={builderConfig}
        />
        {questions.length > 0 ? (
          <>
            {renderQuestions ? (
              renderQuestions(questions)
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <SurveyQuestionPreview
                    key={question.id}
                    question={question}
                    index={index}
                    builderConfig={builderConfig}
                  />
                ))}
              </div>
            )}
            {renderSubmit ? renderSubmit() : <SubmitPreview builderConfig={builderConfig} />}
          </>
        ) : (
          emptyState
        )}
      </div>
    </div>
  )
}

function SurveyHeader({
  mode,
  title,
  description,
  builderConfig,
}: {
  mode: 'builder' | 'preview' | 'public'
  title: string
  description?: string | null
  builderConfig: BuilderConfig
}) {
  const headerTitle = builderConfig.header.title || title
  const headerDescription = builderConfig.header.description || description

  const logoAlignment = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[builderConfig.header.logoPosition]

  const descriptionAlignment = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[builderConfig.header.logoPosition]

  const logoSize = {
    sm: 'h-8 max-w-32',
    md: 'h-10 max-w-40',
    lg: 'h-14 max-w-52',
  }[builderConfig.header.logoSize]

  return (
    <section
      className={cn(
        'flex flex-col gap-2 border p-6',
        logoAlignment,
        builderConfig.hero.enabled && 'min-h-56 justify-center gap-4 p-8',
      )}
      style={getSurveyCardStyle(builderConfig, 'header')}
    >
      {builderConfig.logoUrl ? (
        <img
          src={builderConfig.logoUrl}
          alt=""
          className={cn('rounded object-contain', logoSize)}
        />
      ) : null}

      <div className="space-y-1">
        <h1
          className={cn(
            'text-2xl font-semibold tracking-normal text-foreground',
            builderConfig.hero.enabled && 'text-4xl',
          )}
          style={{ color: builderConfig.primaryColor }}
        >
          {headerTitle}
        </h1>

        {headerDescription ? (
          <p
            className={cn(
              'text-sm leading-6 text-muted-foreground',
              builderConfig.hero.enabled && 'max-w-2xl text-base',
              descriptionAlignment,
            )}
          >
            {headerDescription}
          </p>
        ) : null}
      </div>
    </section>
  )
}

function SurveyQuestionPreview({
  question,
  index,
  builderConfig,
}: {
  question: BuilderQuestion
  index: number
  builderConfig: BuilderConfig
}) {
  return (
    <div className="border p-4" style={getSurveyCardStyle(builderConfig, 'question')}>
      <div className="flex items-start gap-3">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-medium"
          style={{
            backgroundColor: `${builderConfig.primaryColor}14`,
            color: builderConfig.primaryColor,
          }}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          {question.type === 'multiple_choice' ? (
            <MultipleChoiceQuestion question={question} />
          ) : null}
          {question.type === 'rating' ? <RatingQuestion question={question} /> : null}
          {question.type === 'text' ? <TextQuestion question={question} /> : null}
        </div>
      </div>
    </div>
  )
}

function SubmitPreview({ builderConfig }: { builderConfig: BuilderConfig }) {
  const justify = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[builderConfig.submitButton.alignment]

  return (
    <div className={cn('flex', justify)}>
      <Button
        type="button"
        className="min-w-32"
        style={{
          backgroundColor: builderConfig.primaryColor,
          color: '#ffffff',
        }}
      >
        {builderConfig.submitButton.text || 'Submit'}
      </Button>
    </div>
  )
}

function SurveyDecoration({ builderConfig }: { builderConfig: BuilderConfig }) {
  if (builderConfig.decoration.type === 'wave') {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full text-[var(--survey-primary)] opacity-20"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
        />
      </svg>
    )
  }

  if (builderConfig.decoration.type === 'hero') {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-1/2 text-[var(--survey-primary)] opacity-15"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMin slice"
      >
        <path
          fill="currentColor"
          d="M366.5,46.5C438.8,91.2,499.1,180.5,482.8,253.4C466.4,326.4,373.4,382.9,283.2,421.1C193.1,459.2,105.7,479,-4.1,477C-113.9,475,-246.2,451.2,-300.3,373.5C-354.4,295.8,-330.4,164.3,-263.8,88C-197.2,11.7,-88,-9.4,11.7,-18.9C111.4,-28.4,222.8,1.8,366.5,46.5Z"
        />
      </svg>
    )
  }

  return null
}
