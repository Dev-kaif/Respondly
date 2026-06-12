import { useDraggable } from '@dnd-kit/core'
import { AlignLeft, ListChecks, Star, type LucideIcon } from 'lucide-react'

import type { QuestionType } from '@/src/lib/builder-questions'
import { useBuilderStore } from '@/src/stores/builder-store'
import { cn } from '@/lib/utils'

const paletteItems = [
  { label: 'Text', type: 'text', icon: AlignLeft },
  { label: 'Multiple Choice', type: 'multiple_choice', icon: ListChecks },
  { label: 'Rating', type: 'rating', icon: Star },
] as const

export function QuestionPalette() {
  const addQuestion = useBuilderStore((state) => state.addQuestion)

  return (
    <aside className="w-[260px] shrink-0 border-r bg-background">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-medium">Question Palette</h3>
      </div>
      <div className="space-y-2 p-3">
        {paletteItems.map((item) => (
          <PaletteItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            type={item.type}
            onAdd={() => addQuestion(item.type satisfies QuestionType)}
          />
        ))}
      </div>
    </aside>
  )
}

type PaletteItemProps = {
  icon: LucideIcon
  label: string
  type: QuestionType
  onAdd: () => void
}

function PaletteItem({ icon: Icon, label, type, onAdd }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      source: 'palette',
      questionType: type,
    },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onAdd}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-left text-sm shadow-xs transition-colors hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        isDragging && 'relative z-20 opacity-70',
      )}
      {...attributes}
      {...listeners}
    >
      <Icon className="size-4 text-muted-foreground" />
      <span>{label}</span>
    </button>
  )
}
