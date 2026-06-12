import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Image,
  Link,
  Palette,
  PanelTop,
  Pilcrow,
  Rows3,
  Type,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  getThemePreset,
  THEME_OPTIONS,
  type ThemeId,
} from '@/src/components/builder/themes/presets'
import type { BuilderConfig } from '@/src/lib/builder-config'
import { useBuilderStore } from '@/src/stores/builder-store'

const FONT_OPTIONS = [
  'Geist Variable',
  'Inter',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
]

const ALIGNMENTS: Array<{
  value: BuilderConfig['submitButton']['alignment']
  label: string
  icon: typeof AlignLeft
}> = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
]

const LOGO_POSITIONS: Array<{
  value: BuilderConfig['header']['logoPosition']
  label: string
  icon: typeof AlignLeft
}> = ALIGNMENTS

export function FormEditor() {
  const builderConfig = useBuilderStore((state) => state.builderConfig)
  const updateBuilderConfig = useBuilderStore((state) => state.updateBuilderConfig)

  function patchConfig(patch: Partial<BuilderConfig>) {
    updateBuilderConfig((current) => ({
      ...current,
      ...patch,
      theme: patch.theme ?? current.theme,
    }))
  }

  function patchHeader(patch: Partial<BuilderConfig['header']>) {
    updateBuilderConfig((current) => ({
      ...current,
      header: {
        ...current.header,
        ...patch,
      },
    }))
  }

  function patchAppearance(patch: Partial<BuilderConfig['appearance']>) {
    updateBuilderConfig((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        ...patch,
      },
    }))
  }

  function selectTheme(theme: ThemeId) {
    updateBuilderConfig(() => getThemePreset(theme).config)
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="form-theme">
          <Palette className="size-3.5" />
          Theme
        </FieldLabel>
        <Select
          value={builderConfig.theme}
          onValueChange={(value) => selectTheme(value as ThemeId)}
        >
          <SelectTrigger id="form-theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {THEME_OPTIONS.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="form-logo-url">
          <Link className="size-3.5" />
          Logo URL
        </FieldLabel>
        <Input
          id="form-logo-url"
          value={builderConfig.logoUrl ?? ''}
          placeholder="https://example.com/logo.png"
          onChange={(event) => patchConfig({ logoUrl: event.target.value })}
        />
      </Field>

      <EditorSection title="Header" />

      <Field>
        <FieldLabel htmlFor="form-header-title">
          <PanelTop className="size-3.5" />
          Header title
        </FieldLabel>
        <Input
          id="form-header-title"
          value={builderConfig.header.title}
          placeholder="Use form title"
          onChange={(event) => patchHeader({ title: event.target.value })}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="form-header-description">
          <Rows3 className="size-3.5" />
          Header description
        </FieldLabel>
        <textarea
          id="form-header-description"
          value={builderConfig.header.description}
          placeholder="Use form description"
          onChange={(event) => patchHeader({ description: event.target.value })}
          className="min-h-20 w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>

      <Field>
        <FieldLabel>Logo position</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {LOGO_POSITIONS.map((position) => {
            const Icon = position.icon
            const selected = builderConfig.header.logoPosition === position.value

            return (
              <Button
                key={position.value}
                type="button"
                variant={selected ? 'default' : 'outline'}
                onClick={() => patchHeader({ logoPosition: position.value })}
                className={cn('px-2', selected && 'text-primary-foreground')}
                aria-label={position.label}
              >
                <Icon />
              </Button>
            )
          })}
        </div>
      </Field>

      <Field>
        <FieldLabel>Logo size</FieldLabel>
        <Select
          value={builderConfig.header.logoSize}
          onValueChange={(logoSize) =>
            patchHeader({ logoSize: logoSize as BuilderConfig['header']['logoSize'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="form-primary-color">
            <Palette className="size-3.5" />
            Primary
          </FieldLabel>
          <ColorInput
            id="form-primary-color"
            value={builderConfig.primaryColor}
            onChange={(value) => patchConfig({ primaryColor: value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-background-color">
            <Palette className="size-3.5" />
            Background
          </FieldLabel>
          <ColorInput
            id="form-background-color"
            value={builderConfig.backgroundColor}
            onChange={(value) => patchConfig({ backgroundColor: value })}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="form-background-image">
          <Image className="size-3.5" />
          Background image URL
        </FieldLabel>
        <Input
          id="form-background-image"
          value={builderConfig.backgroundImageUrl ?? ''}
          placeholder="https://example.com/background.jpg"
          onChange={(event) => patchConfig({ backgroundImageUrl: event.target.value })}
        />
      </Field>

      <EditorSection title="Appearance" />

      <RangeInput
        id="form-background-image-opacity"
        label="Background image opacity"
        value={builderConfig.appearance.backgroundImageOpacity}
        min={0}
        max={100}
        unit="%"
        onChange={(value) => patchAppearance({ backgroundImageOpacity: value })}
      />

      <RangeInput
        id="form-header-card-opacity"
        label="Header card opacity"
        value={builderConfig.appearance.headerCardOpacity}
        min={0}
        max={100}
        unit="%"
        onChange={(value) => patchAppearance({ headerCardOpacity: value })}
      />

      <RangeInput
        id="form-question-card-opacity"
        label="Question card opacity"
        value={builderConfig.appearance.questionCardOpacity}
        min={0}
        max={100}
        unit="%"
        onChange={(value) => patchAppearance({ questionCardOpacity: value })}
      />

      <RangeInput
        id="form-blur-amount"
        label="Blur amount"
        value={builderConfig.appearance.blurAmount}
        min={0}
        max={24}
        unit="px"
        onChange={(value) => patchAppearance({ blurAmount: value })}
      />

      <RangeInput
        id="form-border-radius"
        label="Border radius"
        value={builderConfig.appearance.borderRadius}
        min={0}
        max={32}
        unit="px"
        onChange={(value) => patchAppearance({ borderRadius: value })}
      />

      <Field>
        <FieldLabel>Shadow strength</FieldLabel>
        <Select
          value={builderConfig.appearance.shadowStrength}
          onValueChange={(shadowStrength) =>
            patchAppearance({
              shadowStrength: shadowStrength as BuilderConfig['appearance']['shadowStrength'],
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="form-font-family">
          <Type className="size-3.5" />
          Font family
        </FieldLabel>
        <Select
          value={builderConfig.fontFamily}
          onValueChange={(fontFamily) => patchConfig({ fontFamily })}
        >
          <SelectTrigger id="form-font-family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="form-submit-text">
          <Pilcrow className="size-3.5" />
          Submit button text
        </FieldLabel>
        <Input
          id="form-submit-text"
          value={builderConfig.submitButton.text}
          onChange={(event) =>
            patchConfig({
              submitButton: {
                ...builderConfig.submitButton,
                text: event.target.value,
              },
            })
          }
        />
      </Field>

      <Field>
        <FieldLabel>Submit button alignment</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {ALIGNMENTS.map((alignment) => {
            const Icon = alignment.icon
            const selected = builderConfig.submitButton.alignment === alignment.value

            return (
              <Button
                key={alignment.value}
                type="button"
                variant={selected ? 'default' : 'outline'}
                onClick={() =>
                  patchConfig({
                    submitButton: {
                      ...builderConfig.submitButton,
                      alignment: alignment.value,
                    },
                  })
                }
                className={cn('px-2', selected && 'text-primary-foreground')}
                aria-label={alignment.label}
              >
                <Icon />
              </Button>
            )
          })}
        </div>
      </Field>
    </FieldGroup>
  )
}

function EditorSection({ title }: { title: string }) {
  return (
    <div className="border-t pt-4">
      <h4 className="text-sm font-medium">{title}</h4>
    </div>
  )
}

function RangeInput({
  id,
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit: string
  onChange: (value: number) => void
}) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <span className="text-xs text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="px-0"
      />
    </Field>
  )
}

function ColorInput({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        aria-label={`${id}-picker`}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-10 shrink-0 p-1"
      />
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
