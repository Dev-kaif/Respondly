import { AlertTriangle, LoaderCircle, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type DeleteUserDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Delete Account
          </DialogTitle>

          <DialogDescription className="space-y-2">
            <p>Are you sure you want to permanently delete your account?</p>

            <p>This action cannot be undone. The following data will be permanently removed:</p>

            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>Your account profile</li>
              <li>All forms</li>
              <li>All questions</li>
              <li>All responses and answers</li>
              <li>Active sessions</li>
            </ul>
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

            {isPending ? 'Deleting Account...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
