import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_app/forms')({
  component: FormsPage,
})

function FormsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Forms</CardTitle>
          <CardDescription>Your survey forms will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
            No forms yet.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
