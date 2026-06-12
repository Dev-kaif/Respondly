import { QuestionEditor } from '@/src/components/builder/questions/question-editor'
import { useBuilderStore } from '@/src/stores/builder-store'

export function EditorSidebar() {
  const questions = useBuilderStore((state) => state.questions)
  const selectedQuestionId = useBuilderStore((state) => state.selectedQuestionId)
  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId)

  return (
    <aside className="w-[320px] shrink-0 border-l bg-background">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-medium">Editor</h3>
      </div>
      <div className="h-[calc(100%-2.875rem)] overflow-auto p-4">
        {selectedQuestion ? (
          <QuestionEditor question={selectedQuestion} />
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No question selected
          </div>
        )}
      </div>
    </aside>
  )
}
