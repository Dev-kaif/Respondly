import { Field, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Switch } from '@/src/components/ui/switch'
import type { TextBuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

export function TextEditor({ question }: { question: TextBuilderQuestion }) {
  const updateQuestion = useBuilderStore((state) => state.updateQuestion)

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={`${question.id}-title`}>Title</FieldLabel>
        <Input
          id={`${question.id}-title`}
          value={question.title}
          onChange={(event) =>
            updateQuestion(question.id, (current) =>
              current.type === 'text' ? { ...current, title: event.target.value } : current,
            )
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${question.id}-placeholder`}>Placeholder</FieldLabel>
        <Input
          id={`${question.id}-placeholder`}
          value={question.placeholder}
          onChange={(event) =>
            updateQuestion(question.id, (current) =>
              current.type === 'text' ? { ...current, placeholder: event.target.value } : current,
            )
          }
        />
      </Field>
      <RequiredSwitch question={question} />
    </FieldGroup>
  )
}

function RequiredSwitch({ question }: { question: TextBuilderQuestion }) {
  const updateQuestion = useBuilderStore((state) => state.updateQuestion)

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2">
      <FieldLabel htmlFor={`${question.id}-required`}>Required</FieldLabel>
      <Switch
        id={`${question.id}-required`}
        checked={question.required}
        onCheckedChange={(checked) =>
          updateQuestion(question.id, (current) =>
            current.type === 'text' ? { ...current, required: checked } : current,
          )
        }
      />
    </div>
  )
}
