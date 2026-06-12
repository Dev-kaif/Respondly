import { createFileRoute } from '@tanstack/react-router'
import { CreateFormDialog } from '@/components/forms/create-form-dialog'
import { FormListItem } from '@/components/forms/form-list-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useForms } from '@/src/hooks/use-forms'
import { getFormTimestamp } from '@/src/lib/api'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const formsQuery = useForms({ page: 1, limit: 3 })
  const recentForms = [...(formsQuery.data?.data ?? [])]
    .sort((a, b) => getFormTimestamp(b) - getFormTimestamp(a))
    .slice(0, 3)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="space-y-3">
        <CreateFormDialog variant="card" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Forms</CardTitle>
          <CardDescription>Your latest survey forms.</CardDescription>
        </CardHeader>
        <CardContent>
          {formsQuery.isLoading ? <FormListSkeleton count={3} /> : null}
          {formsQuery.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {formsQuery.error.message}
            </div>
          ) : null}
          {formsQuery.isSuccess && recentForms.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
              No forms yet. Create your first form to get started.
            </div>
          ) : null}
          {recentForms.length > 0 ? (
            <div className="space-y-3">
              {recentForms.map((form) => (
                <FormListItem key={form.id} form={form} />
              ))}
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
      {Array.from({ length: count }, (_, i) => `dashboard-skeleton-${i}`).map((id) => (
        <div key={`dashboard-skeleton-${id}`} className="rounded-xl border bg-background p-4">
          <div className="flex gap-3">
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
