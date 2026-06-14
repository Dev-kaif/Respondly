import { Check, Palette } from 'lucide-react'
import {
  getThemePreset,
  THEME_OPTIONS,
  type ThemeId,
} from '@/src/components/builder/themes/presets'
import { Button } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import { useBuilderStore } from '@/src/stores/builder-store'

type ThemeSelectorProps = {
  disabled?: boolean
}

export function ThemeSelector({ disabled = false }: ThemeSelectorProps) {
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const updateBuilderConfig = useBuilderStore((state) => state.updateBuilderConfig)

  const selectedTheme = THEME_OPTIONS.find((theme) => theme.id === builderConfig.theme)

  function selectTheme(theme: ThemeId) {
    if (disabled || theme === builderConfig.theme) {
      return
    }

    updateBuilderConfig((current) => {
      const preset = getThemePreset(theme).config

      return {
        ...current,
        ...preset,

        header: current.header,

        appearance: {
          ...current.appearance,
          ...preset.appearance,
        },

        submitButton: {
          ...current.submitButton,
          ...preset.submitButton,
        },

        decoration: {
          ...current.decoration,
          ...preset.decoration,
        },
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" disabled={disabled}>
          <Palette />
          {selectedTheme?.name ?? 'Theme'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {THEME_OPTIONS.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            disabled={disabled}
            onSelect={() => selectTheme(theme.id)}
          >
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
