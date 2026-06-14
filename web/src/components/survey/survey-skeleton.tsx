import { Skeleton } from '@/src/components/ui/skeleton'

export function SurveySkeleton() {
  return (
    <main className="min-h-screen w-full bg-muted/30 px-5 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <section className="rounded-lg border bg-background p-6 shadow-sm">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-5 h-8 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </section>
        {Array.from({ length: 3 }, (_, i) => `survey-skeleton-${i}`).map((id) => (
          <section
            key={`survey-skeleton-${id}`}
            className="rounded-lg border bg-background p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <Skeleton className="size-7 shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </section>
        ))}
        <div className="flex justify-start">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </main>
  )
}
