import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_app/forms/$formId')({
  component: FormEditorPlaceholder,
})

function FormEditorPlaceholder() {
  const { formId } = Route.useParams()

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Form editor</CardTitle>
          <CardDescription>The editor page for this form will be built here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
            Form ID: <span className="font-medium text-foreground">{formId}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
