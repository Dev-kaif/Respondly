import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRenameForm } from '@/src/hooks/use-rename-form'
import type { FormResponse } from '@/src/lib/api'

const renameFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(200, 'Title must be 200 characters or fewer.'),
})

type RenameFormDialogProps = {
  form: FormResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RenameFormDialog({ form, open, onOpenChange }: RenameFormDialogProps) {
  const [title, setTitle] = useState(form.title)
  const [error, setError] = useState<string | null>(null)
  const renameMutation = useRenameForm(form.id)

  useEffect(() => {
    if (open) {
      setTitle(form.title)
      setError(null)
    }
  }, [form.title, open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const parsed = renameFormSchema.safeParse({ title })

    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.title?.[0] ?? 'Title is required.')
      return
    }

    try {
      await renameMutation.mutateAsync({ title: parsed.data.title })
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to rename form.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename form</DialogTitle>
          <DialogDescription>Update the title shown in your form list.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor={`rename-form-${form.id}`}>Title</FieldLabel>
              <Input
                id={`rename-form-${form.id}`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-invalid={Boolean(error)}
                autoFocus
              />
              <FieldError>{error}</FieldError>
            </Field>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={renameMutation.isPending}>
                {renameMutation.isPending ? <Loader2 className="animate-spin" /> : null}
                {renameMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
