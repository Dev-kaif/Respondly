import { type ThemeId } from '@/src/lib/themes'

export type BuilderConfig = {
  theme: ThemeId
  logo: {
    url: string
    alt: string
    visible: boolean
  }
  background: {
    type: 'solid' | 'image'
    color: string
    imageUrl: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    scale: 'compact' | 'default' | 'spacious'
  }
  submitButton: {
    label: string
    radius: 'sm' | 'md' | 'lg'
    fullWidth: boolean
  }
  contentCard: {
    enabled: boolean
    width: 'narrow' | 'default' | 'wide'
    radius: 'sm' | 'md' | 'lg'
    shadow: 'none' | 'sm' | 'md'
  }
}

export const DEFAULT_BUILDER_CONFIG: BuilderConfig = {
  theme: 'minimal',
  logo: {
    url: '',
    alt: '',
    visible: false,
  },
  background: {
    type: 'solid',
    color: '#ffffff',
    imageUrl: '',
  },
  typography: {
    headingFont: 'Geist Variable',
    bodyFont: 'Geist Variable',
    scale: 'default',
  },
  submitButton: {
    label: 'Submit',
    radius: 'md',
    fullWidth: false,
  },
  contentCard: {
    enabled: true,
    width: 'default',
    radius: 'lg',
    shadow: 'sm',
  },
}

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

function pickBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
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

  const logo = isRecord(value.logo) ? value.logo : {}
  const background = isRecord(value.background) ? value.background : {}
  const typography = isRecord(value.typography) ? value.typography : {}
  const submitButton = isRecord(value.submitButton) ? value.submitButton : {}
  const contentCard = isRecord(value.contentCard) ? value.contentCard : {}

  return {
    theme: isThemeId(value.theme) ? value.theme : DEFAULT_BUILDER_CONFIG.theme,
    logo: {
      url: pickString(logo.url, DEFAULT_BUILDER_CONFIG.logo.url),
      alt: pickString(logo.alt, DEFAULT_BUILDER_CONFIG.logo.alt),
      visible: pickBoolean(logo.visible, DEFAULT_BUILDER_CONFIG.logo.visible),
    },
    background: {
      type: pickOption(background.type, DEFAULT_BUILDER_CONFIG.background.type, ['solid', 'image']),
      color: pickString(background.color, DEFAULT_BUILDER_CONFIG.background.color),
      imageUrl: pickString(background.imageUrl, DEFAULT_BUILDER_CONFIG.background.imageUrl),
    },
    typography: {
      headingFont: pickString(typography.headingFont, DEFAULT_BUILDER_CONFIG.typography.headingFont),
      bodyFont: pickString(typography.bodyFont, DEFAULT_BUILDER_CONFIG.typography.bodyFont),
      scale: pickOption(typography.scale, DEFAULT_BUILDER_CONFIG.typography.scale, [
        'compact',
        'default',
        'spacious',
      ]),
    },
    submitButton: {
      label: pickString(submitButton.label, DEFAULT_BUILDER_CONFIG.submitButton.label),
      radius: pickOption(submitButton.radius, DEFAULT_BUILDER_CONFIG.submitButton.radius, [
        'sm',
        'md',
        'lg',
      ]),
      fullWidth: pickBoolean(submitButton.fullWidth, DEFAULT_BUILDER_CONFIG.submitButton.fullWidth),
    },
    contentCard: {
      enabled: pickBoolean(contentCard.enabled, DEFAULT_BUILDER_CONFIG.contentCard.enabled),
      width: pickOption(contentCard.width, DEFAULT_BUILDER_CONFIG.contentCard.width, [
        'narrow',
        'default',
        'wide',
      ]),
      radius: pickOption(contentCard.radius, DEFAULT_BUILDER_CONFIG.contentCard.radius, [
        'sm',
        'md',
        'lg',
      ]),
      shadow: pickOption(contentCard.shadow, DEFAULT_BUILDER_CONFIG.contentCard.shadow, [
        'none',
        'sm',
        'md',
      ]),
    },
  }
}
