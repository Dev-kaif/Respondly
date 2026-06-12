import { getThemePreset, type ThemeId } from '@/src/components/builder/themes/presets'

export type BuilderConfig = {
  theme: ThemeId
  logoUrl?: string
  primaryColor: string
  backgroundColor: string
  backgroundImageUrl?: string
  fontFamily: string
  header: {
    title: string
    description: string
    logoPosition: 'left' | 'center' | 'right'
    logoSize: 'sm' | 'md' | 'lg'
  }
  submitButton: {
    text: string
    alignment: 'left' | 'center' | 'right'
  }
  appearance: {
    backgroundImageOpacity: number
    headerCardOpacity: number
    questionCardOpacity: number
    blurAmount: number
    borderRadius: number
    shadowStrength: 'none' | 'sm' | 'md' | 'lg'
  }
  hero: {
    enabled: boolean
  }
  decoration: {
    type: 'none' | 'wave' | 'hero'
  }
}

export const DEFAULT_BUILDER_CONFIG: BuilderConfig = getThemePreset('minimal').config

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isThemeId(value: unknown): value is ThemeId {
  return (
    value === 'minimal' ||
    value === 'corporate' ||
    value === 'wave' ||
    value === 'hero' ||
    value === 'custom'
  )
}

function pickString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback
}

function pickOptionalString(value: unknown, fallback?: string) {
  return typeof value === 'string' ? value : fallback
}

function pickBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function pickNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function pickOption<T extends string>(value: unknown, fallback: T, options: readonly T[]) {
  return typeof value === 'string' && options.includes(value as T) ? (value as T) : fallback
}

export function mergeBuilderConfig(value: unknown): BuilderConfig {
  if (typeof value === 'string') {
    try {
      return mergeBuilderConfig(JSON.parse(value) as unknown)
    } catch {
      return DEFAULT_BUILDER_CONFIG
    }
  }

  if (!isRecord(value)) {
    return DEFAULT_BUILDER_CONFIG
  }

  const fallback = isThemeId(value.theme)
    ? getThemePreset(value.theme).config
    : DEFAULT_BUILDER_CONFIG
  const header = isRecord(value.header) ? value.header : {}
  const submitButton = isRecord(value.submitButton) ? value.submitButton : {}
  const appearance = isRecord(value.appearance) ? value.appearance : {}
  const hero = isRecord(value.hero) ? value.hero : {}
  const decoration = isRecord(value.decoration) ? value.decoration : {}

  return {
    theme: isThemeId(value.theme) ? value.theme : fallback.theme,
    logoUrl: pickOptionalString(value.logoUrl, readLegacyLogoUrl(value)),
    primaryColor: pickString(
      value.primaryColor,
      readLegacyPrimaryColor(value, fallback.primaryColor),
    ),
    backgroundColor: pickString(
      value.backgroundColor,
      readLegacyBackgroundColor(value, fallback.backgroundColor),
    ),
    backgroundImageUrl: pickOptionalString(
      value.backgroundImageUrl,
      readLegacyBackgroundImageUrl(value),
    ),
    fontFamily: pickString(value.fontFamily, readLegacyFontFamily(value, fallback.fontFamily)),
    header: {
      title: pickString(header.title, fallback.header.title),
      description: pickString(header.description, fallback.header.description),
      logoPosition: pickOption(header.logoPosition, fallback.header.logoPosition, [
        'left',
        'center',
        'right',
      ]),
      logoSize: pickOption(header.logoSize, fallback.header.logoSize, ['sm', 'md', 'lg']),
    },
    submitButton: {
      text: pickString(
        submitButton.text,
        readLegacySubmitText(submitButton, fallback.submitButton.text),
      ),
      alignment: pickOption(submitButton.alignment, fallback.submitButton.alignment, [
        'left',
        'center',
        'right',
      ]),
    },
    appearance: {
      backgroundImageOpacity: pickNumber(
        appearance.backgroundImageOpacity,
        fallback.appearance.backgroundImageOpacity,
      ),
      headerCardOpacity: pickNumber(
        appearance.headerCardOpacity,
        fallback.appearance.headerCardOpacity,
      ),
      questionCardOpacity: pickNumber(
        appearance.questionCardOpacity,
        fallback.appearance.questionCardOpacity,
      ),
      blurAmount: pickNumber(appearance.blurAmount, fallback.appearance.blurAmount),
      borderRadius: pickNumber(appearance.borderRadius, fallback.appearance.borderRadius),
      shadowStrength: pickOption(appearance.shadowStrength, fallback.appearance.shadowStrength, [
        'none',
        'sm',
        'md',
        'lg',
      ]),
    },
    hero: {
      enabled: pickBoolean(hero.enabled, fallback.hero.enabled),
    },
    decoration: {
      type: pickOption(decoration.type, fallback.decoration.type, ['none', 'wave', 'hero']),
    },
  }
}

function readLegacyLogoUrl(value: Record<string, unknown>) {
  const logo = isRecord(value.logo) ? value.logo : {}
  const visible = typeof logo.visible === 'boolean' ? logo.visible : true

  return visible ? pickOptionalString(logo.url) : undefined
}

function readLegacyPrimaryColor(value: Record<string, unknown>, fallback: string) {
  const colors = isRecord(value.colors) ? value.colors : {}

  return pickString(colors.primary, fallback)
}

function readLegacyBackgroundColor(value: Record<string, unknown>, fallback: string) {
  const background = isRecord(value.background) ? value.background : {}

  return pickString(background.color, fallback)
}

function readLegacyBackgroundImageUrl(value: Record<string, unknown>) {
  const background = isRecord(value.background) ? value.background : {}

  return pickOptionalString(background.imageUrl)
}

function readLegacyFontFamily(value: Record<string, unknown>, fallback: string) {
  const typography = isRecord(value.typography) ? value.typography : {}

  return pickString(typography.bodyFont, pickString(typography.headingFont, fallback))
}

function readLegacySubmitText(value: Record<string, unknown>, fallback: string) {
  return pickString(value.label, fallback)
}
