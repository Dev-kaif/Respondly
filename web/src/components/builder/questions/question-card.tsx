import { GripVertical } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'

import { MultipleChoiceQuestion } from '@/src/components/builder/questions/multiple-choice-question'
import { RatingQuestion } from '@/src/components/builder/questions/rating-question'
import { TextQuestion } from '@/src/components/builder/questions/text-question'
import { cn } from '@/lib/utils'
import type { BuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

type QuestionCardProps = {
  question: BuilderQuestion
  index: number
  dragHandle?: ReactNode
}

export function QuestionCard({ question, index, dragHandle }: QuestionCardProps) {
  const selectedQuestionId = useBuilderStore((state) => state.selectedQuestionId)
  const selectQuestion = useBuilderStore((state) => state.selectQuestion)
  const isSelected = selectedQuestionId === question.id
  const handle = dragHandle ?? <GripVertical className="size-4" />

  function selectCurrentQuestion() {
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
      className={cn(
        'w-full rounded-xl border bg-background p-4 text-left shadow-xs transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        isSelected && 'border-foreground/30 ring-2 ring-ring/20',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          {question.type === 'multiple_choice' ? <MultipleChoiceQuestion question={question} /> : null}
          {question.type === 'rating' ? <RatingQuestion question={question} /> : null}
          {question.type === 'text' ? <TextQuestion question={question} /> : null}
        </div>
        {handle}
      </div>
    </div>
  )
}
