import { GripVertical } from 'lucide-react'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MultipleChoiceQuestion } from '@/src/components/builder/questions/multiple-choice-question'
import { RatingQuestion } from '@/src/components/builder/questions/rating-question'
import { TextQuestion } from '@/src/components/builder/questions/text-question'
import { getSurveyCardStyle } from '@/src/components/survey-renderer/appearance'
import type { BuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

type QuestionCardProps = {
  question: BuilderQuestion
  index: number
  dragHandle?: ReactNode
}

export function QuestionCard({ question, index, dragHandle }: QuestionCardProps) {
  const selectedQuestionId = useBuilderStore((state) => state.selectedQuestionId)
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const selectQuestion = useBuilderStore((state) => state.selectQuestion)
  const isSelected = selectedQuestionId === question.id
  const handle = dragHandle ?? <GripVertical className="size-4" />

  function selectCurrentQuestion(event?: MouseEvent<HTMLDivElement>) {
    event?.stopPropagation()
    selectQuestion(question.id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCurrentQuestion()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={selectCurrentQuestion}
      onKeyDown={handleKeyDown}
      style={getSurveyCardStyle(builderConfig, 'question')}
      className={cn(
        'w-full border p-4 text-left transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        isSelected && 'border-foreground/30 ring-2 ring-ring/20',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          {question.type === 'multiple_choice' ? (
            <MultipleChoiceQuestion question={question} />
          ) : null}
          {question.type === 'rating' ? <RatingQuestion question={question} /> : null}
          {question.type === 'text' ? <TextQuestion question={question} /> : null}
        </div>
        {handle}
      </div>
    </div>
  )
}
