import { Star } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getSurveyCardStyle } from '@/src/components/survey-renderer/appearance'
import type { BuilderConfig } from '@/src/lib/builder-config'
import type { BuilderQuestion } from '@/src/lib/builder-questions'

type SurveyQuestionFieldProps = {
  question: BuilderQuestion
  index: number
  value: string
  error?: string
  builderConfig: BuilderConfig
  onChange: (value: string) => void
}

const EMOJI_RATINGS = ['Very bad', 'Bad', 'Okay', 'Good', 'Excellent']
const EMOJI_SYMBOLS = ['😞', '😐', '🙂', '😄', '🤩']

export function SurveyQuestionField({
  question,
  index,
  value,
  error,
  builderConfig,
  onChange,
}: SurveyQuestionFieldProps) {
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
        <div className="min-w-0 flex-1 space-y-3">
          <QuestionTitle title={question.title} required={question.required} />
          {question.type === 'text' ? (
            <Input
              value={value}
              placeholder={question.placeholder || 'Type your answer'}
              onChange={(event) => onChange(event.target.value)}
              aria-invalid={Boolean(error)}
            />
          ) : null}
          {question.type === 'multiple_choice' ? (
            <div className="space-y-2">
              {question.options.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={() => onChange(option)}
                    className="size-4 accent-[var(--survey-primary)]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : null}
          {question.type === 'rating' ? (
            <RatingInput
              style={question.settings.style}
              value={value}
              primaryColor={builderConfig.primaryColor}
              onChange={onChange}
            />
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

function QuestionTitle({ title, required }: { title: string; required: boolean }) {
  return (
    <p className="text-sm font-medium">
      {title}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </p>
  )
}

function RatingInput({
  style,
  value,
  primaryColor,
  onChange,
}: {
  style: 'stars' | 'emoji'
  value: string
  primaryColor: string
  onChange: (value: string) => void
}) {
  if (style === 'emoji') {
    return (
      <div className="flex flex-wrap gap-2">
        {EMOJI_SYMBOLS.map((emoji, index) => {
          const rating = String(index + 1)
          const selected = value === rating

          return (
            <button
              key={rating}
              type="button"
              aria-label={EMOJI_RATINGS[index]}
              onClick={() => onChange(rating)}
              className={cn(
                'flex size-10 items-center justify-center rounded-lg border bg-white/60 text-xl transition-colors',
                selected && 'border-transparent text-white',
              )}
              style={selected ? { backgroundColor: primaryColor } : undefined}
            >
              {emoji}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = String(index + 1)
        const selected = Number(value) >= index + 1

        return (
          <button
            key={rating}
            type="button"
            aria-label={`${rating} star${rating === '1' ? '' : 's'}`}
            onClick={() => onChange(rating)}
            className="rounded-md p-1 transition-colors hover:bg-black/5"
          >
            <Star
              className="size-7"
              fill={selected ? primaryColor : 'none'}
              color={selected ? primaryColor : 'currentColor'}
            />
          </button>
        )
      })}
    </div>
  )
}
