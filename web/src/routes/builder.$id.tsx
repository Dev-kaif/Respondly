import { createFileRoute, useBlocker } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Protection } from '@/src/components/auth/protected'
import { BuilderLayout } from '@/src/components/builder/builder-layout'
import { Skeleton } from '@/src/components/ui/skeleton'
import { useForm } from '@/src/hooks/use-form'
import { mergeBuilderConfig } from '@/src/lib/builder-config'
import { normalizeApiQuestions } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

export const Route = createFileRoute('/builder/$id')({
  beforeLoad: Protection,
  component: FormBuilderRoute,
})

function FormBuilderRoute() {
  const { id } = Route.useParams()
  const formQuery = useForm(id)
  const setForm = useBuilderStore((state) => state.setForm)
  const setQuestions = useBuilderStore((state) => state.setQuestions)
  const setBuilderConfig = useBuilderStore((state) => state.setBuilderConfig)
  const selectQuestion = useBuilderStore((state) => state.selectQuestion)
  const resetPersistenceTracking = useBuilderStore((state) => state.resetPersistenceTracking)
  const resetDirty = useBuilderStore((state) => state.resetDirty)
  const isDirty = useBuilderStore((state) => state.isDirty)

  useBlocker({
    shouldBlockFn: () => !window.confirm('You have unsaved changes. Leave without saving?'),
    enableBeforeUnload: () => useBuilderStore.getState().isDirty,
    disabled: !isDirty,
  })

  useEffect(() => {
    if (!formQuery.data) {
      return
    }

    const { questions, ...form } = formQuery.data

    setForm(form)
    setQuestions(normalizeApiQuestions(questions))
    setBuilderConfig(mergeBuilderConfig(form.builderConfig))
    selectQuestion(null)
    resetPersistenceTracking()
    resetDirty()
  }, [
    formQuery.data,
    resetDirty,
    resetPersistenceTracking,
    selectQuestion,
    setBuilderConfig,
    setForm,
    setQuestions,
  ])

  if (formQuery.isLoading) {
    return <BuilderLoadingState />
  }

  if (formQuery.isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {formQuery.error.message}
      </div>
    )
  }

  return <BuilderLayout />
}

function BuilderLoadingState() {
  return (
    <div className="flex h-[calc(100svh-7rem)] min-h-[40rem] overflow-hidden rounded-xl border bg-background shadow-xs">
      <div className="w-[260px] border-r p-4">
        <Skeleton className="h-4 w-32" />
        <div className="mt-5 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex-1 p-6">
        <Skeleton className="h-28 w-full" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <div className="w-[320px] border-l p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-5 h-28 w-full" />
      </div>
    </div>
  )
}
