import { Link, useNavigate } from '@tanstack/react-router'
import { Copy, ExternalLink, FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { DeleteFormDialog } from '@/components/forms/delete-form-dialog'
import { RenameFormDialog } from '@/components/forms/rename-form-dialog'
import { useDuplicateForm } from '@/src/hooks/use-duplicate-form'
import { type FormResponse, getFormTimestamp } from '@/src/lib/api'

type FormListItemProps = {
  form: FormResponse
}

function formatUpdatedDate(form: FormResponse) {
  const timestamp = getFormTimestamp(form)

  if (!timestamp) {
    return null
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp)
}

export function FormListItem({ form }: FormListItemProps) {
  const navigate = useNavigate()
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)
  const duplicateMutation = useDuplicateForm(form.id)
  const updatedDate = formatUpdatedDate(form)

  async function handleDuplicate() {
    setDuplicateError(null)

    try {
      await duplicateMutation.mutateAsync()
    } catch (error) {
      setDuplicateError(error instanceof Error ? error.message : 'Unable to duplicate form.')
    }
  }

  function openForm() {
    void navigate({ to: '/forms/$formId', params: { formId: form.id }, search: { page: 1 } })
  }

  return (
    <>
      <div
        className={cn(
          'group grid gap-3 rounded-xl border bg-background p-4 shadow-xs transition-colors hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center',
          duplicateError && 'border-destructive/30',
        )}
      >
        <Link
          to="/forms/$formId"
          params={{ formId: form.id }}
          search={{ page: 1 }}
          className="min-w-0 outline-none"
        >
          <div className="flex min-w-0 gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {form.title}
              </span>
              <span className="mt-1 block truncate text-sm text-muted-foreground">
                {form.description || 'No description'}
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border bg-muted/50 px-1.5 py-0.5">
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
                {updatedDate ? <span>Updated {updatedDate}</span> : null}
              </span>
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-end gap-2">
          {duplicateError ? (
            <span className="text-xs text-destructive">{duplicateError}</span>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${form.title}`}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={openForm}>
                <ExternalLink />
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  setRenameOpen(true)
                }}
              >
                <Pencil />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => void handleDuplicate()}
                disabled={duplicateMutation.isPending}
              >
                <Copy />
                {duplicateMutation.isPending ? 'Duplicating...' : 'Duplicate'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault()
                  setDeleteOpen(true)
                }}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <RenameFormDialog form={form} open={renameOpen} onOpenChange={setRenameOpen} />
      <DeleteFormDialog form={form} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  )
}
