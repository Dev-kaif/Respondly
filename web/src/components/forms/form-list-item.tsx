import { useNavigate } from '@tanstack/react-router'
import {
  Copy,
  ExternalLink,
  FileText,
  Link2Icon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { DeleteFormDialog } from '@/src/components/forms/delete-form-dialog'
import { RenameFormDialog } from '@/src/components/forms/rename-form-dialog'
import { Button } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import { useDuplicateForm } from '@/src/hooks/use-duplicate-form'
import { useFormAnalytics } from '@/src/hooks/use-form-analytics'
import { type FormResponse, getFormTimestamp } from '@/src/lib/api'
import { cn } from '@/src/lib/utils'

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
  const analyticsQuery = useFormAnalytics(form.id)
  const updatedDate = formatUpdatedDate(form)
  const publicPath = form?.slug ? `/survey/${form.slug}` : ''
  const publicUrl =
    publicPath && typeof window !== 'undefined'
      ? new URL(publicPath, window.location.origin).toString()
      : publicPath

  async function handleDuplicate() {
    setDuplicateError(null)

    try {
      await duplicateMutation.mutateAsync()
    } catch (error) {
      setDuplicateError(error instanceof Error ? error.message : 'Unable to duplicate form.')
    }
  }

  function openForm() {
    if (analyticsQuery.isLoading) {
      return
    }

    if ((analyticsQuery.data?.totalResponses ?? 0) > 0) {
      void navigate({ to: '/forms/$id/responses', params: { id: form.id }, search: { page: 1 } })
      return
    }

    void navigate({ to: '/builder/$id', params: { id: form.id }, search: { page: 1 } })
  }

  function openSurveyLink() {
    window.open(publicUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div
        className={cn(
          'group grid h-28 gap-3 rounded-lg border bg-background px-5 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[1fr_auto] sm:items-center',
          duplicateError && 'border-destructive/30',
        )}
      >
        <button
          type="button"
          disabled={analyticsQuery.isLoading}
          onClick={openForm}
          className="min-w-0 text-left outline-none disabled:cursor-wait disabled:opacity-70"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <FileText className="size-5 text-muted-foreground" />
            </div>

            <div className="flex h-full min-w-0 flex-1 flex-col justify-center">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-foreground">{form.title}</h3>

                <span
                  className={cn(
                    'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
                    form.isPublished
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-amber-500/10 text-amber-600',
                  )}
                >
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-muted-foreground">
                {form.description || 'No description'}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {analyticsQuery.data?.totalResponses ?? 0} response
                  {(analyticsQuery.data?.totalResponses ?? 0) === 1 ? '' : 's'}
                </span>

                <span>•</span>

                {updatedDate ? <span>Updated {updatedDate}</span> : null}
              </div>
            </div>
          </div>
        </button>

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
              {form.isPublished && (
                <DropdownMenuItem onSelect={openSurveyLink} disabled={analyticsQuery.isLoading}>
                  <Link2Icon />
                  Survey Link
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={openForm} disabled={analyticsQuery.isLoading}>
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
