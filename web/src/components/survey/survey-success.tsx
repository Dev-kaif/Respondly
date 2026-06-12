import { CheckCircle2 } from 'lucide-react'

import { getSurveyCardStyle } from '@/src/components/survey-renderer/appearance'
import type { BuilderConfig } from '@/src/lib/builder-config'

export function SurveySuccess({ builderConfig }: { builderConfig: BuilderConfig }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <section
        className="w-full max-w-md border p-8 text-center"
        style={getSurveyCardStyle(builderConfig, 'header')}
      >
        <CheckCircle2
          className="mx-auto size-12"
          style={{ color: builderConfig.primaryColor }}
          aria-hidden="true"
        />
        <h1 className="mt-5 text-2xl font-semibold">Thank you for your response.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your response has been recorded.</p>
      </section>
    </div>
  )
}
