import type { RatingBuilderQuestion } from '@/src/lib/builder-questions'

export function RatingQuestion({ question }: { question: RatingBuilderQuestion }) {
  const ratingPreview = question.settings.style === 'emoji' ? '😞 😐 🙂 😄 🤩' : '★★★★★'

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {question.title}
        {question.required ? <span className="ml-1 text-destructive">*</span> : null}
      </p>
      <div className="text-xl tracking-normal text-muted-foreground">{ratingPreview}</div>
    </div>
  )
}
