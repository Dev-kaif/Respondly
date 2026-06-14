import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { CreateFormDialog } from '@/src/components/forms/create-form-dialog'
import { FormListItem } from '@/src/components/forms/form-list-item'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Skeleton } from '@/src/components/ui/skeleton'
import { useDebounce } from '@/src/hooks/use-debounce'
import { useForms } from '@/src/hooks/use-forms'

export const Route = createFileRoute('/_app/forms')({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    search: z.string().catch(''),
  }),
  component: FormsPage,
})

function FormsPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page, search } = Route.useSearch()
  const formsQuery = useForms({
    page,
    limit: 3,
    search,
  })

  const forms = formsQuery.data?.data ?? []
  const pagination = formsQuery.data?.pagination

  const canGoPrevious = page > 1
  const canGoNext = pagination ? page < pagination.totalPages : false

  const [searchInput, setSearchInput] = useState(search)

  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    if (debouncedSearch === search) return
    void navigate({
      search: { page: 1, search: debouncedSearch },
      replace: true,
    })
  }, [debouncedSearch, search, navigate])

  function goToPage(nextPage: number) {
    void navigate({
      search: { page: nextPage, search },
    })
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
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>All Forms</CardTitle>
            <CardDescription>
              {pagination
                ? `${pagination.total} total form${pagination.total === 1 ? '' : 's'}`
                : 'Loading forms'}
            </CardDescription>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search forms..."
              className="pl-9"
            />
          </div>
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
              <div className="flex h-full min-h-80 items-center justify-center rounded-lg border border-dashed bg-background p-8">
                <div className="space-y-2 text-center">
                  <h3 className="font-medium">
                    {search ? 'No matching forms found' : 'No forms yet'}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {search
                      ? `No forms match "${search}". Try a different search term.`
                      : 'Create your first form to start collecting responses.'}
                  </p>

                  {!search ? <CreateFormDialog /> : null}
                </div>
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
      {Array.from({ length: count }, (_, i) => i).map((id) => (
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
