import { LoaderCircle, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type DeleteResponseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
}

export function DeleteResponseDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: DeleteResponseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Response</DialogTitle>
          <DialogDescription>
            This will permanently delete this submitted response. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" variant="destructive" disabled={isPending} onClick={onConfirm}>
            {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
            {isPending ? 'Deleting...' : 'Delete Response'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
