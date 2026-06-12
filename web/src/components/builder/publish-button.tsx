import { LoaderCircle, Send, Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { usePublishForm } from '@/src/hooks/use-publish-form'
import { useUnpublishForm } from '@/src/hooks/use-unpublish-form'
import { useBuilderStore } from '@/src/stores/builder-store'

export function PublishButton() {
  const form = useBuilderStore((state) => state.form)
  const isDirty = useBuilderStore((state) => state.isDirty)
  const publishMutation = usePublishForm(form?.id ?? '')
  const unpublishMutation = useUnpublishForm(form?.id ?? '')
  const [showPublishedState, setShowPublishedState] = useState(false)
  const isPending = publishMutation.isPending || unpublishMutation.isPending

  useEffect(() => {
    if (!showPublishedState) {
      return
    }

    const timeout = window.setTimeout(() => setShowPublishedState(false), 1400)

    return () => window.clearTimeout(timeout)
  }, [showPublishedState])

  function togglePublishState() {
    if (!form || isDirty || isPending || showPublishedState) {
      return
    }

    if (form.isPublished) {
      void toast.promise(unpublishMutation.mutateAsync(), {
        loading: 'Unpublishing form...',
        success: 'Form unpublished.',
        error: (error) => (error instanceof Error ? error.message : 'Failed to unpublish form.'),
      })
      return
    }

    void toast.promise(
      publishMutation.mutateAsync().then((result) => {
        setShowPublishedState(true)
        return result
      }),
      {
        loading: 'Publishing form...',
        success: 'Form published.',
        error: (error) => (error instanceof Error ? error.message : 'Failed to publish form.'),
      },
    )
  }

  const label = getPublishLabel({
    isPublished: Boolean(form?.isPublished),
    isPublishing: publishMutation.isPending,
    isUnpublishing: unpublishMutation.isPending,
    showPublishedState,
  })

  return (
    <Button
      type="button"
      variant="outline"
      disabled={!form || isDirty || isPending || showPublishedState}
      onClick={togglePublishState}
    >
      {isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : form?.isPublished && !showPublishedState ? (
        <Undo2 />
      ) : (
        <Send />
      )}
      {label}
    </Button>
  )
}

function getPublishLabel({
  isPublished,
  isPublishing,
  isUnpublishing,
  showPublishedState,
}: {
  isPublished: boolean
  isPublishing: boolean
  isUnpublishing: boolean
  showPublishedState: boolean
}) {
  if (isPublishing) {
    return 'Publishing...'
  }

  if (isUnpublishing) {
    return 'Unpublishing...'
  }

  if (showPublishedState) {
    return 'Published'
  }

  return isPublished ? 'Unpublish' : 'Publish'
}
