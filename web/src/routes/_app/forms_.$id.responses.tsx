import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Download, Pencil, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFormAnalytics } from '@/src/hooks/use-form-analytics'
import { useFormResponses } from '@/src/hooks/use-form-responses'
import { getFormResponse } from '@/src/lib/api'
import { answersToCsv } from '@/src/lib/responses/format'
import { ResponseListItem } from '@/src/components/responses/response-list-item'
import { DeleteResponseDialog } from '@/src/components/responses/delete-response-dialog'
import { useDeleteResponse } from '@/src/hooks/use-delete-response'

export const Route = createFileRoute('/_app/forms_/$id/responses')({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
  }),
  component: ResponsesPage,
})


function ResponsesPage() {
  const { id } = Route.useParams()
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: '/forms/$id/responses' })
  const [isExporting, setIsExporting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteResponseId, setDeleteResponseId] = useState<string | null>(null)
  const responsesQuery = useFormResponses(id, { page, limit: 3 })
  const analyticsQuery = useFormAnalytics(id)
  const responses = responsesQuery.data?.data ?? []
  const pagination = responsesQuery.data?.pagination
  const canGoPrevious = page > 1
  const canGoNext = pagination ? page < pagination.totalPages : false

  function goToPage(nextPage: number) {
    void navigate({ params: { id }, search: { page: nextPage } })
  }

  function openBuilder() {
    void navigate({ to: '/builder/$id', params: { id }, search: { page: 1 } })
  }

  async function refreshResponses() {
    await Promise.all([responsesQuery.refetch(), analyticsQuery.refetch()])
  }

  async function exportCsv() {
    if (responses.length === 0 || isExporting) {
      return
    }

    setIsExporting(true)

    try {
      const rows = await Promise.all(
        responses.map(async (response) => ({
          response,
          answers: await getFormResponse(id, response.id),
        })),
      )
      const csv = answersToCsv(rows)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `responses-${id}-page-${page}.csv`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export CSV.')
    } finally {
      setIsExporting(false)
    }
  }

  const deleteMutation = useDeleteResponse(id, deleteResponseId ?? '')

  async function handleDeleteResponse() {
    if (!deleteResponseId) {
      return
    }

    try {
      await toast.promise(deleteMutation.mutateAsync(), {
        loading: 'Deleting response...',
        success: 'Response deleted.',
        error: (error) =>
          error instanceof Error
            ? error.message
            : 'Failed to delete response.',
      })

      setDeleteOpen(false)
      setDeleteResponseId(null)

      await Promise.all([
        responsesQuery.refetch(),
        analyticsQuery.refetch(),
      ])
    } catch {
      // handled by toast
    }
  }


  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Responses</h2>
            <p className="mt-1 text-sm text-muted-foreground">View all submissions for this form</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={openBuilder}>
              <Pencil />
              Update Form
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={responses.length === 0 || isExporting}
              onClick={() => void exportCsv()}
            >
              <Download />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={responsesQuery.isFetching || analyticsQuery.isFetching}
              onClick={() => void refreshResponses()}
            >
              <RefreshCw className={responsesQuery.isFetching ? 'animate-spin' : undefined} />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Total Responses</CardTitle>
            <CardDescription>All submissions collected for this form.</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsQuery.isLoading ? <Skeleton className="h-10 w-24" /> : null}
            {analyticsQuery.isError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {analyticsQuery.error.message}
              </div>
            ) : null}
            {analyticsQuery.isSuccess ? (
              <p className="text-4xl font-semibold">{analyticsQuery.data.totalResponses}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-25rem)] min-h-100">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              {pagination
                ? `${pagination.total} total response${pagination.total === 1 ? '' : 's'}`
                : 'Loading responses'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-auto pr-1">
              {responsesQuery.isLoading ? <ResponseListSkeleton count={5} /> : null}
              {responsesQuery.isError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  {responsesQuery.error.message}
                </div>
              ) : null}
              {responsesQuery.isSuccess && responses.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
                  No responses yet.
                </div>
              ) : null}
              {responses.length > 0 ? (
                <div className="space-y-3">
                  {responses.map((response, index) => (
                    <ResponseListItem
                      key={response.id}
                      formId={id}
                      response={response}
                      page={page}
                      index={index}
                      totalResponses={pagination?.total ?? responses.length}
                      onDelete={(responseId) => {
                        setDeleteResponseId(responseId)
                        setDeleteOpen(true)
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            {pagination && pagination.totalPages > 1 ? (
              <div className="mt-5 flex shrink-0 flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!canGoPrevious}
                    onClick={() => goToPage(page - 1)}
                  >
                    <ChevronLeft />
                    Previous
                  </Button>
                  <Button variant="outline" disabled={!canGoNext} onClick={() => goToPage(page + 1)}>
                    Next
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <DeleteResponseDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void handleDeleteResponse()}
        isPending={deleteMutation.isPending}
      /></>
  )
}

function ResponseListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-20 rounded-xl border bg-background p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-4 w-52" />
        </div>
      ))}
    </div>
  )
}
