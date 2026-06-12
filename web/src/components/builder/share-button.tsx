import { Copy, ExternalLink, LoaderCircle, Send, Share2, Undo2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { usePublishForm } from '@/src/hooks/use-publish-form'
import { useUnpublishForm } from '@/src/hooks/use-unpublish-form'
import { useBuilderStore } from '@/src/stores/builder-store'

export function ShareButton() {
  const form = useBuilderStore((state) => state.form)
  const isDirty = useBuilderStore((state) => state.isDirty)
  const publishMutation = usePublishForm(form?.id ?? '')
  const unpublishMutation = useUnpublishForm(form?.id ?? '')
  const isPending = publishMutation.isPending || unpublishMutation.isPending
  const isPublished = Boolean(form?.isPublished)
  const publicPath = form?.slug ? `/survey/${form.slug}` : ''
  const publicUrl =
    publicPath && typeof window !== 'undefined'
      ? new URL(publicPath, window.location.origin).toString()
      : publicPath

  function publishSurvey() {
    if (!form || isDirty || isPending) {
      return
    }

    void toast.promise(publishMutation.mutateAsync(), {
      loading: 'Publishing survey...',
      success: 'Survey published.',
      error: (error) => (error instanceof Error ? error.message : 'Failed to publish survey.'),
    })
  }

  function unpublishSurvey() {
    if (!form || isDirty || isPending) {
      return
    }

    void toast.promise(unpublishMutation.mutateAsync(), {
      loading: 'Unpublishing survey...',
      success: 'Survey unpublished.',
      error: (error) => (error instanceof Error ? error.message : 'Failed to unpublish survey.'),
    })
  }

  function copyLink() {
    if (!publicUrl || isPending) {
      return
    }

    void toast.promise(navigator.clipboard.writeText(publicUrl), {
      loading: 'Copying link...',
      success: 'Survey link copied.',
      error: 'Failed to copy survey link.',
    })
  }

  function openSurvey() {
    if (!publicUrl || isPending) {
      return
    }

    window.open(publicUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" disabled={!form}>
          <Share2 />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Share Survey</DialogTitle>
            <StatusBadge published={isPublished} />
          </div>
          <DialogDescription>
            Manage public access and copy the survey link for respondents.
          </DialogDescription>
        </DialogHeader>

        {isDirty ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Save your changes before publishing. Publishing actions are disabled while the builder
            has unsaved changes.
          </div>
        ) : null}

        {isPublished ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="public-survey-url" className="text-sm font-medium">
                Public URL
              </label>
              <div className="flex gap-2">
                <Input id="public-survey-url" value={publicUrl} readOnly />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!publicUrl || isPending}
                  onClick={copyLink}
                >
                  <Copy />
                  Copy Link
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={!publicUrl || isPending}
                onClick={openSurvey}
              >
                <ExternalLink />
                Open Survey
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={!form || isDirty || isPending}
                onClick={unpublishSurvey}
              >
                {unpublishMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Undo2 />
                )}
                {unpublishMutation.isPending ? 'Unpublishing...' : 'Unpublish'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This survey is not publicly accessible until it is published.
            </p>
            <DialogFooter>
              <Button
                type="button"
                disabled={!form || isDirty || isPending}
                onClick={publishSurvey}
              >
                {publishMutation.isPending ? <LoaderCircle className="animate-spin" /> : <Send />}
                {publishMutation.isPending ? 'Publishing...' : 'Publish Survey'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        published ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground',
      )}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
