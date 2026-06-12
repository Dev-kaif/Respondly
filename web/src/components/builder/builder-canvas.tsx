import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FileQuestion } from 'lucide-react'

import { SortableQuestionCard } from '@/src/components/builder/questions/sortable-question-card'
import { useBuilderStore } from '@/src/stores/builder-store'

export function BuilderCanvas() {
  const form = useBuilderStore((state) => state.form)
  const questions = useBuilderStore((state) => state.questions)
  const questionIds = questions.map((question) => question.id)
  const { setNodeRef, isOver } = useDroppable({
    id: 'builder-canvas',
  })

  return (
    <main
      ref={setNodeRef}
      className="min-w-0 flex-1 overflow-auto bg-muted/30 p-6"
      data-over={isOver}
    >
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <section className="rounded-xl border bg-background p-6 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Survey preview</p>
          <h1 className="mt-3 text-2xl font-semibold">{form?.title ?? 'Untitled form'}</h1>
          {form?.description ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{form.description}</p>
          ) : null}
        </section>

        {questions.length > 0 ? (
          <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <SortableQuestionCard key={question.id} question={question} index={index} />
              ))}
            </div>
          </SortableContext>
        ) : (
          <div className="rounded-xl border border-dashed bg-background p-10 text-center">
            <FileQuestion className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Survey preview placeholder</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Questions loaded from the API will appear here.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
