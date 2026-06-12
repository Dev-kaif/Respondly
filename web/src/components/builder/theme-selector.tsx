import { Check, Palette } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { THEME_OPTIONS, type ThemeId } from '@/src/lib/themes'
import { useBuilderStore } from '@/src/stores/builder-store'

export function ThemeSelector() {
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const setBuilderConfig = useBuilderStore((state) => state.setBuilderConfig)
  const markDirty = useBuilderStore((state) => state.markDirty)
  const selectedTheme = THEME_OPTIONS.find((theme) => theme.id === builderConfig.theme)

  function selectTheme(theme: ThemeId) {
    if (theme === builderConfig.theme) {
      return
    }

    setBuilderConfig({ ...builderConfig, theme })
    markDirty()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Palette />
          {selectedTheme?.name ?? 'Theme'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEME_OPTIONS.map((theme) => (
          <DropdownMenuItem key={theme.id} onSelect={() => selectTheme(theme.id)}>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span>{theme.name}</span>
              <span className="truncate text-xs text-muted-foreground">{theme.description}</span>
            </span>
            {theme.id === builderConfig.theme ? <Check className="ml-auto" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
