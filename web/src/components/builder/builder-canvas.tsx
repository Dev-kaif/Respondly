import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FileQuestion } from 'lucide-react'

import { SortableQuestionCard } from '@/src/components/builder/questions/sortable-question-card'
import { SurveyRenderer } from '@/src/components/survey-renderer'
import { useBuilderStore } from '@/src/stores/builder-store'

export function BuilderCanvas() {
  const form = useBuilderStore((state) => state.form)
  const questions = useBuilderStore((state) => state.questions)
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const selectQuestion = useBuilderStore((state) => state.selectQuestion)
  const questionIds = questions.map((question) => question.id)
  const { setNodeRef, isOver } = useDroppable({
    id: 'builder-canvas',
  })

  return (
    <main
      ref={setNodeRef}
      className="min-w-0 flex-1 overflow-auto bg-muted/30 p-6"
      data-over={isOver}
      onClick={() => selectQuestion(null)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectQuestion(null)
        }
      }}
    >
      <SurveyRenderer
        mode="builder"
        title={form?.title ?? 'Untitled form'}
        description={form?.description}
        questions={questions}
        builderConfig={builderConfig}
        renderQuestions={(items) => (
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((question, index) => (
                <SortableQuestionCard key={question.id} question={question} index={index} />
              ))}
            </div>
          </SortableContext>
        )}
        emptyState={
          <div className="rounded-xl border border-dashed bg-background p-10 text-center">
            <FileQuestion className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Survey preview placeholder</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Questions loaded from the API will appear here.
            </p>
          </div>
        }
      />
    </main>
  )
}
