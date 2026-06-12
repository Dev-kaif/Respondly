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
  const theme = builderConfig.theme

  const logoSize = {
    sm: 'h-8 max-w-32',
    md: 'h-10 max-w-40',
    lg: 'h-14 max-w-52',
  }[builderConfig.header.logoSize]

  const alignment = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[builderConfig.header.logoPosition]

  const descriptionAlign = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[builderConfig.header.logoPosition]

  const headerTitle = builderConfig.header.title || title
  const headerDescription = builderConfig.header.description || description

  if (theme === 'corporate') {
    return (
      <section
        className={`flex flex-col gap-1 p-6 ${alignment}`}
        style={{
          backgroundColor: builderConfig.primaryColor,
          borderRadius: builderConfig.appearance.borderRadius,
        }}
      >
        {builderConfig.logoUrl && (
          <img src={builderConfig.logoUrl} alt="" className={`${logoSize} object-contain mb-2`} />
        )}
        <h1 className="text-2xl font-semibold text-white">{headerTitle}</h1>
        {headerDescription && (
          <p className={`text-sm text-white/75 ${descriptionAlign}`}>{headerDescription}</p>
        )}
      </section>
    )
  }

  if (theme === 'hero') {
    // hero is always centered by design — position/size still applies to logo
    const heroLogoSize = {
      sm: 'h-10 max-w-36',
      md: 'h-14 max-w-52',
      lg: 'h-20 max-w-64',
    }[builderConfig.header.logoSize]

    return (
      <section
        className="relative flex flex-col items-center justify-center gap-3 overflow-hidden p-12 text-center"
        style={{
          backgroundColor: builderConfig.primaryColor,
          borderRadius: builderConfig.appearance.borderRadius,
          minHeight: mode === 'builder' ? 180 : 240,
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20" style={{ backgroundColor: '#ffffff' }} />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full opacity-10" style={{ backgroundColor: '#ffffff' }} />
        {builderConfig.logoUrl && (
          <img
            src={builderConfig.logoUrl}
            alt=""
            className={`relative z-10 ${heroLogoSize} object-contain`}
          />
        )}
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-semibold text-white">{headerTitle}</h1>
          {headerDescription && (
            <p className="mx-auto max-w-lg text-base text-white/70">{headerDescription}</p>
          )}
        </div>
      </section>
    )
  }

  if (theme === 'wave') {
    return (
      <section
        className={`flex flex-col gap-2 border p-6 ${alignment}`}
        style={getSurveyCardStyle(builderConfig, 'header')}
      >
        {builderConfig.logoUrl && (
          <img src={builderConfig.logoUrl} alt="" className={`${logoSize} object-contain`} />
        )}
        <h1 className="text-2xl font-semibold" style={{ color: builderConfig.primaryColor }}>
          {headerTitle}
        </h1>
        {headerDescription && (
          <p className={`text-sm text-muted-foreground max-w-md ${descriptionAlign}`}>
            {headerDescription}
          </p>
        )}
      </section>
    )
  }

  // minimal + custom
  return (
    <section
      className={`flex flex-col gap-2 border p-6 ${alignment}`}
      style={getSurveyCardStyle(builderConfig, 'header')}
    >
      {builderConfig.logoUrl && (
        <img src={builderConfig.logoUrl} alt="" className={`${logoSize} object-contain`} />
      )}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold" style={{ color: builderConfig.primaryColor }}>
          {headerTitle}
        </h1>
        {headerDescription && (
          <p className={`text-sm leading-6 text-muted-foreground ${descriptionAlign}`}>
            {headerDescription}
          </p>
        )}
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path fill={builderConfig.primaryColor} opacity="0.12"
          d="M0,192L80,176C160,160,320,128,480,138.7C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
        />
        <path fill={builderConfig.primaryColor} opacity="0.07"
          d="M0,224L80,213C160,202,320,181,480,186.7C640,192,800,224,960,229.3C1120,235,1280,213,1360,202L1440,192L1440,320L0,320Z"
        />
      </svg>
    )
  }
  if (builderConfig.decoration.type === 'hero') {
    return (
      <svg aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-80 w-1/2"
        viewBox="0 0 500 500" preserveAspectRatio="xMidYMin slice"
      >
        <path fill={builderConfig.primaryColor} opacity="0.08"
          d="M366.5,46.5C438.8,91.2,499.1,180.5,482.8,253.4C466.4,326.4,373.4,382.9,283.2,421.1C193.1,459.2,105.7,479,-4.1,477C-113.9,475,-246.2,451.2,-300.3,373.5C-354.4,295.8,-330.4,164.3,-263.8,88C-197.2,11.7,-88,-9.4,11.7,-18.9C111.4,-28.4,222.8,1.8,366.5,46.5Z"
        />
      </svg>
    )
  }
  return null
}
