import { Plus, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/src/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Switch } from '@/src/components/ui/switch'
import type { MultipleChoiceBuilderQuestion } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

export function MultipleChoiceEditor({ question }: { question: MultipleChoiceBuilderQuestion }) {
  const updateQuestion = useBuilderStore((state) => state.updateQuestion)

  const optionIds = useRef<string[]>([])
  while (optionIds.current.length < question.options.length) {
    optionIds.current.push(crypto.randomUUID())
  }
  optionIds.current = optionIds.current.slice(0, question.options.length)

  function updateOption(index: number, value: string) {
    updateQuestion(question.id, (current) => {
      if (current.type !== 'multiple_choice') {
        return current
      }
      return {
        ...current,
        options: current.options.map((option, optionIndex) =>
          optionIndex === index ? value : option,
        ),
      }
    })
  }

  function addOption() {
    updateQuestion(question.id, (current) => {
      if (current.type !== 'multiple_choice') {
        return current
      }
      return {
        ...current,
        options: [...current.options, `Option ${current.options.length + 1}`],
      }
    })
  }

  function deleteOption(index: number) {
    if (question.options.length <= 2) {
      return
    }
    optionIds.current.splice(index, 1)
    updateQuestion(question.id, (current) => {
      if (current.type !== 'multiple_choice' || current.options.length <= 2) {
        return current
      }
      return {
        ...current,
        options: current.options.filter((_, optionIndex) => optionIndex !== index),
      }
    })
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
              current.type === 'multiple_choice'
                ? { ...current, title: event.target.value }
                : current,
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
              current.type === 'multiple_choice' ? { ...current, required: checked } : current,
            )
          }
        />
      </div>
      <Field>
        <FieldLabel>Options</FieldLabel>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div key={optionIds.current[index]} className="flex items-center gap-2">
              <Input value={option} onChange={(event) => updateOption(index, event.target.value)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={question.options.length <= 2}
                onClick={() => deleteOption(index)}
                aria-label={`Delete option ${index + 1}`}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </Field>
      <Button type="button" variant="outline" onClick={addOption}>
        <Plus />
        Add Option
      </Button>
    </FieldGroup>
  )
}
