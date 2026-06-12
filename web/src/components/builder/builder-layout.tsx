import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { BuilderCanvas } from '@/src/components/builder/builder-canvas'
import { BuilderPreview } from '@/src/components/builder/builder-preview'
import { BuilderTopbar } from '@/src/components/builder/builder-topbar'
import { EditorSidebar } from '@/src/components/builder/editor-sidebar'
import { QuestionPalette } from '@/src/components/builder/question-palette'
import { getSurveyBackgroundStyle } from '@/src/components/survey-renderer/appearance'
import type { QuestionType } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'

function isPaletteDragData(value: unknown): value is {
  source: 'palette'
  questionType: QuestionType
} {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'source' in value &&
    value.source === 'palette' &&
    'questionType' in value &&
    (value.questionType === 'text' ||
      value.questionType === 'multiple_choice' ||
      value.questionType === 'rating')
  )
}

export function BuilderLayout() {
  const questions = useBuilderStore((state) => state.questions)
  const builderMode = useBuilderStore((state) => state.builderMode)
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const insertQuestion = useBuilderStore((state) => state.insertQuestion)
  const reorderQuestions = useBuilderStore((state) => state.reorderQuestions)
  const questionIds = questions.map((question) => question.id)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) {
      return
    }

    const dragData = active.data.current

    if (isPaletteDragData(dragData)) {
      insertQuestion(dragData.questionType, getPaletteDropIndex(event, questionIds))
      return
    }

    if (active.id === over.id) {
      return
    }

    const oldIndex = questionIds.indexOf(String(active.id))
    const newIndex = questionIds.indexOf(String(over.id))

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    reorderQuestions(arrayMove(questionIds, oldIndex, newIndex))
  }

  return (
    <div className="flex h-screen overflow-hidden rounded-xl border bg-background shadow-xs">
      <div className="flex min-w-0 flex-1 flex-col">
        <BuilderTopbar />
        {builderMode === 'edit' ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex min-h-0 flex-1">
              <QuestionPalette />
              <BuilderCanvas />
              <EditorSidebar />
            </div>
          </DndContext>
        ) : (
          <div className="flex min-h-0 flex-1" style={getSurveyBackgroundStyle(builderConfig)}>
            <BuilderPreview />
          </div>
        )}
      </div>
    </div>
  )
}

function getPaletteDropIndex(event: DragEndEvent, questionIds: string[]) {
  const overId = String(event.over?.id ?? '')
  const overQuestionIndex = questionIds.indexOf(overId)

  if (overQuestionIndex === -1) {
    return questionIds.length
  }

  const activeRect = event.active.rect.current.translated
  const overRect = event.over?.rect

  if (!activeRect || !overRect) {
    return overQuestionIndex
  }

  const activeCenterY = activeRect.top + activeRect.height / 2
  const overCenterY = overRect.top + overRect.height / 2

  return activeCenterY > overCenterY ? overQuestionIndex + 1 : overQuestionIndex
}
