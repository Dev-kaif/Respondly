import { useEffect } from 'react'

import { SurveyRenderer } from '@/src/components/survey-renderer'
import { getSurveyBackgroundStyle } from '@/src/components/survey-renderer/appearance'
import { useBuilderStore } from '@/src/stores/builder-store'

export function BuilderPreview() {
  const form = useBuilderStore((state) => state.form)
  const questions = useBuilderStore((state) => state.questions)
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const backgroundStyle = getSurveyBackgroundStyle(builderConfig)

  useEffect(() => {
    const previousBodyBackground = document.body.style.backgroundColor
    const previousHtmlBackground = document.documentElement.style.backgroundColor

    document.body.style.backgroundColor = builderConfig.backgroundColor
    document.documentElement.style.backgroundColor = builderConfig.backgroundColor

    return () => {
      document.body.style.backgroundColor = previousBodyBackground
      document.documentElement.style.backgroundColor = previousHtmlBackground
    }
  }, [builderConfig.backgroundColor])

  return (
    <main
      className="h-full min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
      style={backgroundStyle}
    >
      <SurveyRenderer
        mode="preview"
        title={form?.title ?? 'Untitled form'}
        description={form?.description}
        questions={questions}
        builderConfig={builderConfig}
        className="min-h-full"
      />
    </main>
  )
}
