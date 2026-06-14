import { createFileRoute, Link } from '@tanstack/react-router'
import { CreateFormDialog } from '@/src/components/forms/create-form-dialog'
import { FormListItem } from '@/src/components/forms/form-list-item'
import { Skeleton } from '@/src/components/ui/skeleton'
import { useForms } from '@/src/hooks/use-forms'
import { getFormTimestamp } from '@/src/lib/api'
import { authClient } from '@/src/lib/auth'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: session } = authClient.useSession()
  const formsQuery = useForms({ page: 1, limit: 20 })

  const recentForms = [...(formsQuery.data?.data ?? [])]
    .sort((a, b) => getFormTimestamp(b) - getFormTimestamp(a))
    .slice(0, 3)

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mx-auto w-full space-y-6 px-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}, {firstName}
        </h1>

        <p className="text-sm text-muted-foreground">
          Create surveys, track responses, and manage everything from one place.
        </p>
      </div>

      {/* create */}
      <CreateFormDialog variant="card" />

      {/* recent forms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Recent forms</h2>
          <Link to="/forms" search={{ page: 1 }} className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>

        {formsQuery.isLoading && <FormListSkeleton count={3} />}

        {formsQuery.isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {formsQuery.error.message}
          </div>
        )}

        {formsQuery.isSuccess && recentForms.length === 0 && (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No forms yet — create your first one above.
            </p>
          </div>
        )}

        {recentForms.length > 0 && (
          <div className="space-y-2">
            {recentForms.map((form) => (
              <FormListItem key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FormListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, i) => i).map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border bg-background p-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
