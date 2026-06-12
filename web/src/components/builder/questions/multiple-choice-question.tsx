import type { MultipleChoiceBuilderQuestion } from '@/src/lib/builder-questions'

export function MultipleChoiceQuestion({ question }: { question: MultipleChoiceBuilderQuestion }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {question.title}
        {question.required ? <span className="ml-1 text-destructive">*</span> : null}
      </p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div key={`${question.id}-${index}`} className="flex items-center gap-2 text-sm">
            <span className="size-3 rounded-full border" />
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
