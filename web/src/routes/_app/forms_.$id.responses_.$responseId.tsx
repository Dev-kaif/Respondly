import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, LoaderCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteResponse } from '@/src/hooks/use-delete-response'
import { useFormResponse } from '@/src/hooks/use-form-response'
import { formatSubmittedAt } from '@/src/lib/responses/format'
import { DeleteResponseDialog } from '@/src/components/responses/delete-response-dialog'

export const Route = createFileRoute('/_app/forms_/$id/responses_/$responseId')({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    submittedAt: z.coerce.number().optional().catch(undefined),
  }),
  component: ResponseDetailPage,
})

function ResponseDetailPage() {
  const { id, responseId } = Route.useParams()
  const { page, submittedAt } = Route.useSearch()
  const navigate = useNavigate({ from: '/forms/$id/responses/$responseId' })
  const responseQuery = useFormResponse(id, responseId)
  const deleteMutation = useDeleteResponse(id, responseId)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function goBack() {
    void navigate({ to: '/forms/$id/responses', params: { id }, search: { page } })
  }

  async function deleteCurrentResponse() {
    await toast.promise(deleteMutation.mutateAsync(), {
      loading: 'Deleting response...',
      success: 'Response deleted.',
      error: (error) => (error instanceof Error ? error.message : 'Failed to delete response.'),
    })
    setDeleteOpen(false)
    goBack()
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button type="button" variant="ghost" className="-ml-2 mb-2" onClick={goBack}>
            <ArrowLeft />
            Responses
          </Button>
          <h2 className="text-xl font-semibold">Response Details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {submittedAt ? `Submitted ${formatSubmittedAt(submittedAt)}` : 'Submitted response'}
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={deleteMutation.isPending}
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 />
          Delete Response
        </Button>
      </div>

      {responseQuery.isLoading ? <ResponseDetailSkeleton count={4} /> : null}
      {responseQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {responseQuery.error.message}
        </div>
      ) : null}
      {responseQuery.isSuccess && responseQuery.data.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
          This response has no answers.
        </div>
      ) : null}
      {responseQuery.data && responseQuery.data.length > 0 ? (
        <div className="space-y-4">
          {responseQuery.data.map((answer) => (
            <Card key={answer.questionId}>
              <CardHeader>
                <CardTitle>{answer.questionTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-base">{answer.answer || 'No answer'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
      <DeleteResponseDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void deleteCurrentResponse()}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}

function ResponseDetailSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-5 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
