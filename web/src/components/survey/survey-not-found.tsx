import { FileQuestion } from 'lucide-react'

export function SurveyNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <section className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <FileQuestion className="mx-auto size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-semibold">Survey not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The survey may have been removed or is not published.
        </p>
      </section>
    </main>
  )
}
