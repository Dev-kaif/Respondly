import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { RatingBuilderQuestion, RatingStyle } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

export function RatingEditor({ question }: { question: RatingBuilderQuestion }) {
  const updateQuestion = useBuilderStore((state) => state.updateQuestion)

  function updateStyle(style: RatingStyle) {
    updateQuestion(question.id, (current) =>
      current.type === 'rating'
        ? {
            ...current,
            settings: {
              ...current.settings,
              style,
            },
          }
        : current,
    )
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${question.id}-title`}>Title</FieldLabel>
        <Input
          id={`${question.id}-title`}
          value={question.title}
          onChange={(event) =>
            updateQuestion(question.id, (current) =>
              current.type === 'rating' ? { ...current, title: event.target.value } : current,
            )
          }
        />
      </Field>
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2">
        <FieldLabel htmlFor={`${question.id}-required`}>Required</FieldLabel>
        <Switch
          id={`${question.id}-required`}
          checked={question.required}
          onCheckedChange={(checked) =>
            updateQuestion(question.id, (current) =>
              current.type === 'rating' ? { ...current, required: checked } : current,
            )
          }
        />
      </div>
      <Field>
        <FieldLabel>Rating style</FieldLabel>
        <Select
          value={question.settings.style}
          onValueChange={(value) => updateStyle(value as RatingStyle)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">Stars</SelectItem>
            <SelectItem value="emoji">Emoji</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )
}
