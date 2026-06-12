import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteForm } from '@/src/hooks/use-delete-form'
import type { FormResponse } from '@/src/lib/api'

type DeleteFormDialogProps = {
  form: FormResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteFormDialog({ form, open, onOpenChange }: DeleteFormDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const deleteMutation = useDeleteForm(form.id)

  async function handleDelete() {
    setError(null)

    try {
      await deleteMutation.mutateAsync()
      onOpenChange(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to delete form.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete form</DialogTitle>
          <DialogDescription>
            Delete "{form.title}" and its responses. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : null}
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
