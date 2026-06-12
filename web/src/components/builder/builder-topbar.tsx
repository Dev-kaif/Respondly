import { Eye, LoaderCircle, Pencil, Save } from 'lucide-react'
import { toast } from 'sonner'

import { PublishButton } from '@/src/components/builder/publish-button'
import { ThemeSelector } from '@/src/components/builder/theme-selector'
import { Button } from '@/components/ui/button'
import { useSaveFormBuilder } from '@/src/hooks/use-save-form-builder'
import { useBuilderStore } from '@/src/stores/builder-store'

export function BuilderTopbar() {
  const form = useBuilderStore((state) => state.form)
  const isDirty = useBuilderStore((state) => state.isDirty)
  const builderMode = useBuilderStore((state) => state.builderMode)
  const setBuilderMode = useBuilderStore((state) => state.setBuilderMode)
  const saveMutation = useSaveFormBuilder(form?.id ?? '')
  const saveLabel = saveMutation.isPending ? 'Saving...' : !isDirty && saveMutation.isSuccess ? 'Saved' : 'Save'

  function saveBuilder() {
    if (!form || saveMutation.isPending) {
      return
    }

    void toast.promise(saveMutation.mutateAsync(), {
      loading: 'Saving form...',
      success: 'Form saved.',
      error: (error) => (error instanceof Error ? error.message : 'Failed to save form.'),
    })
  }

  return (
    <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b bg-background px-4">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold">{form?.title ?? 'Untitled form'}</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border bg-muted/30 p-0.5">
          <Button
            type="button"
            size="sm"
            variant={builderMode === 'edit' ? 'default' : 'ghost'}
            onClick={() => setBuilderMode('edit')}
          >
            <Pencil />
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant={builderMode === 'preview' ? 'default' : 'ghost'}
            onClick={() => setBuilderMode('preview')}
          >
            <Eye />
            Preview
          </Button>
        </div>
        <ThemeSelector />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button disabled={!form || !isDirty || saveMutation.isPending} onClick={saveBuilder}>
          {saveMutation.isPending ? <LoaderCircle className="animate-spin" /> : <Save />}
          {saveLabel}
        </Button>
        <PublishButton />
      </div>
    </header>
  )
}
