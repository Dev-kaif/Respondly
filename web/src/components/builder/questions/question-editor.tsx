import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MultipleChoiceEditor } from '@/src/components/builder/editors/multiple-choice-editor'
import { RatingEditor } from '@/src/components/builder/editors/rating-editor'
import { TextEditor } from '@/src/components/builder/editors/text-editor'
import type { BuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

export function QuestionEditor({ question }: { question: BuilderQuestion }) {
  const deleteQuestion = useBuilderStore((state) => state.deleteQuestion)

  return (
    <div className="space-y-5">
      {question.type === 'text' ? <TextEditor question={question} /> : null}
      {question.type === 'multiple_choice' ? <MultipleChoiceEditor question={question} /> : null}
      {question.type === 'rating' ? <RatingEditor question={question} /> : null}
      <div className="border-t pt-4">
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={() => deleteQuestion(question.id)}
        >
          <Trash2 />
          Delete Question
        </Button>
      </div>
    </div>
  )
}
