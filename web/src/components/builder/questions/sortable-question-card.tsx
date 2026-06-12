import { useSortable } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'

import { QuestionCard } from '@/src/components/builder/questions/question-card'
import type { BuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'
import { cn } from '@/lib/utils'

type SortableQuestionCardProps = {
  question: BuilderQuestion
  index: number
}

export function SortableQuestionCard({ question, index }: SortableQuestionCardProps) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id })
  const selectedQuestionId = useBuilderStore((state) => state.selectedQuestionId)
  const elementRef = useRef<HTMLDivElement | null>(null)
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      elementRef.current = element
      setNodeRef(element)
    },
    [setNodeRef],
  )

  useEffect(() => {
    if (selectedQuestionId !== question.id) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      elementRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [question.id, selectedQuestionId])

  return (
    <div
      ref={setRefs}
      style={{
        transform: transform
          ? `translate3d(0px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={cn(isDragging && 'relative z-10 opacity-70')}
    >
      <QuestionCard
        question={question}
        index={index}
        dragHandle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label={`Reorder question ${index + 1}`}
            onClick={(event) => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        }
      />
    </div>
  )
}
