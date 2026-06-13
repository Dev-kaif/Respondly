import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { z } from 'zod'
import { CreateFormDialog } from '@/components/forms/create-form-dialog'
import { FormListItem } from '@/components/forms/form-list-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useForms } from '@/src/hooks/use-forms'

export const Route = createFileRoute('/_app/forms')({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
  }),
  component: FormsPage,
})

function FormsPage() {
  const navigate = useNavigate({ from: '/forms' })
  const { page } = Route.useSearch()
  const formsQuery = useForms({ page, limit: 3 })
  const forms = formsQuery.data?.data ?? []
  const pagination = formsQuery.data?.pagination
  const canGoPrevious = page > 1
  const canGoNext = pagination ? page < pagination.totalPages : false

  function goToPage(nextPage: number) {
    void navigate({ search: { page: nextPage } })
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Forms</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage every survey form in this workspace.
          </p>
        </div>
        <CreateFormDialog />
      </div>

      <Card className="h-[calc(100vh-13rem)] min-h-140">
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>
            {pagination
              ? `${pagination.total} total form${pagination.total === 1 ? '' : 's'}`
              : 'Loading forms'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto pr-1">
            {formsQuery.isLoading ? <FormListSkeleton count={5} /> : null}
            {formsQuery.isError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {formsQuery.error.message}
              </div>
            ) : null}
            {formsQuery.isSuccess && forms.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
                No forms yet. Create your first form to start collecting responses.
              </div>
            ) : null}
            {forms.length > 0 ? (
              <div className="space-y-3">
                {forms.map((form) => (
                  <FormListItem key={form.id} form={form} />
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
  )
}

function FormListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => `forms-skeleton-${i}`).map((id) => (
        <div
          key={`forms-skeleton-${id}`}
          className="h-28 rounded-lg border bg-background px-5 py-4"
        >
          <div className="flex h-full items-center gap-4">
            <Skeleton className="size-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
