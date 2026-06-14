import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '@/src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { useCreateForm } from '@/src/hooks/use-create-form'

const createFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title must be 200 characters or fewer.'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must be 1000 characters or fewer.')
    .optional(),
})

type CreateFormDialogProps = {
  variant?: 'card' | 'button'
}

export function CreateFormDialog({ variant = 'button' }: CreateFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ title?: string; description?: string; form?: string }>({})
  const createMutation = useCreateForm()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})

    const parsed = createFormSchema.safeParse({ title, description })

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors
      setErrors({
        title: flattened.title?.[0],
        description: flattened.description?.[0],
      })
      return
    }

    try {
      await createMutation.mutateAsync({
        title: parsed.data.title,
        description: parsed.data.description || undefined,
      })
      setOpen(false)
      setTitle('')
      setDescription('')
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Unable to create form.' })
    }
  }

  const trigger =
    variant === 'card' ? (
      <button
        type="button"
        className="group relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 to-primary/10 p-6 text-left transition-all hover:border-primary/30 hover:shadow-md w-full"
      >
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Plus className="size-5" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">Create a new survey</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Collect feedback, applications, or customer responses.
            </p>
          </div>

          <span
            className="
        text-sm font-medium text-primary
        transition-transform
        group-hover:translate-x-1
      "
          >
            Create →
          </span>
        </div>
      </button>
    ) : (
      <Button>
        <Plus />
        Create Form
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Add a title and optional description for the new form.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="create-form-title">Title</FieldLabel>
              <Input
                id="create-form-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-invalid={Boolean(errors.title)}
                autoFocus
              />
              <FieldError>{errors.title}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="create-form-description">Description</FieldLabel>
              <Input
                id="create-form-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-invalid={Boolean(errors.description)}
              />
              <FieldError>{errors.description}</FieldError>
            </Field>
            {errors.form ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.form}
              </div>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="animate-spin" /> : null}
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
