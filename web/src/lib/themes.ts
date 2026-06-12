export type ThemeId = 'minimal' | 'corporate' | 'wave' | 'hero' | 'custom'

export type ThemePreset = {
  id: ThemeId
  name: string
  description: string
  colors: {
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    card: string
    border: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    scale: 'compact' | 'default' | 'spacious'
  }
}

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Neutral colors and simple typography for general surveys.',
    colors: {
      background: '#ffffff',
      foreground: '#171717',
      primary: '#171717',
      primaryForeground: '#fafafa',
      card: '#ffffff',
      border: '#e5e5e5',
    },
    typography: {
      headingFont: 'Geist Variable',
      bodyFont: 'Geist Variable',
      scale: 'default',
    },
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Restrained business styling for customer and employee feedback.',
    colors: {
      background: '#f8fafc',
      foreground: '#0f172a',
      primary: '#2563eb',
      primaryForeground: '#ffffff',
      card: '#ffffff',
      border: '#dbe3ef',
    },
    typography: {
      headingFont: 'Geist Variable',
      bodyFont: 'Geist Variable',
      scale: 'compact',
    },
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    description: 'Fresh accent colors for lightweight public surveys.',
    colors: {
      background: '#f0fdfa',
      foreground: '#134e4a',
      primary: '#0f766e',
      primaryForeground: '#ffffff',
      card: '#ffffff',
      border: '#99f6e4',
    },
    typography: {
      headingFont: 'Geist Variable',
      bodyFont: 'Geist Variable',
      scale: 'default',
    },
  },
  hero: {
    id: 'hero',
    name: 'Hero',
    description: 'High-contrast presentation for branded survey launches.',
    colors: {
      background: '#111827',
      foreground: '#f9fafb',
      primary: '#f59e0b',
      primaryForeground: '#111827',
      card: '#1f2937',
      border: '#374151',
    },
    typography: {
      headingFont: 'Geist Variable',
      bodyFont: 'Geist Variable',
      scale: 'spacious',
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'A user-defined theme preset for future editing controls.',
    colors: {
      background: '#ffffff',
      foreground: '#171717',
      primary: '#171717',
      primaryForeground: '#fafafa',
      card: '#ffffff',
      border: '#e5e5e5',
    },
    typography: {
      headingFont: 'Geist Variable',
      bodyFont: 'Geist Variable',
      scale: 'default',
    },
  },
}

export const THEME_OPTIONS = Object.values(THEME_PRESETS)
