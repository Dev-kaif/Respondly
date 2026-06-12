import type { TextBuilderQuestion } from '@/src/lib/builder-questions'

export function TextQuestion({ question }: { question: TextBuilderQuestion }) {
  return (
    <div className="space-y-3">
      <QuestionTitle title={question.title} required={question.required} />
      <div className="h-9 rounded-lg border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
        {question.placeholder || 'Text input preview'}
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
