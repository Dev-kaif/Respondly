import type { BuilderConfig } from '@/src/lib/builder-config'

export type ThemeId = 'minimal' | 'corporate' | 'wave' | 'hero' | 'custom'

export type ThemePreset = {
  id: ThemeId
  name: string
  description: string
  config: BuilderConfig
}

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white survey with no decoration.',
    config: {
      theme: 'minimal',
      primaryColor: '#171717',
      backgroundColor: '#ffffff',
      fontFamily: 'Geist Variable',
      header: {
        title: '',
        description: '',
        logoPosition: 'left',
        logoSize: 'md',
      },
      submitButton: {
        text: 'Submit',
        alignment: 'left',
      },
      appearance: {
        backgroundImageOpacity: 16,
        headerCardOpacity: 90,
        questionCardOpacity: 90,
        blurAmount: 8,
        borderRadius: 8,
        shadowStrength: 'sm',
      },
      hero: {
        enabled: false,
      },
      decoration: {
        type: 'none',
      },
    },
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional blue palette for internal and client forms.',
    config: {
      theme: 'corporate',
      primaryColor: '#2563eb',
      backgroundColor: '#f8fafc',
      fontFamily: 'Geist Variable',
      header: {
        title: '',
        description: '',
        logoPosition: 'left',
        logoSize: 'md',
      },
      submitButton: {
        text: 'Submit',
        alignment: 'right',
      },
      appearance: {
        backgroundImageOpacity: 18,
        headerCardOpacity: 94,
        questionCardOpacity: 94,
        blurAmount: 10,
        borderRadius: 8,
        shadowStrength: 'md',
      },
      hero: {
        enabled: false,
      },
      decoration: {
        type: 'none',
      },
    },
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    description: 'Bright survey page with a decorative wave.',
    config: {
      theme: 'wave',
      primaryColor: '#0f766e',
      backgroundColor: '#ecfeff',
      fontFamily: 'Geist Variable',
      header: {
        title: '',
        description: '',
        logoPosition: 'center',
        logoSize: 'md',
      },
      submitButton: {
        text: 'Send response',
        alignment: 'center',
      },
      appearance: {
        backgroundImageOpacity: 20,
        headerCardOpacity: 88,
        questionCardOpacity: 90,
        blurAmount: 12,
        borderRadius: 12,
        shadowStrength: 'sm',
      },
      hero: {
        enabled: false,
      },
      decoration: {
        type: 'wave',
      },
    },
  },
  hero: {
    id: 'hero',
    name: 'Hero',
    description: 'Large branded opening section for launch surveys.',
    config: {
      theme: 'hero',
      primaryColor: '#7c3aed',
      backgroundColor: '#f5f3ff',
      fontFamily: 'Geist Variable',
      header: {
        title: '',
        description: '',
        logoPosition: 'center',
        logoSize: 'lg',
      },
      submitButton: {
        text: 'Complete survey',
        alignment: 'center',
      },
      appearance: {
        backgroundImageOpacity: 22,
        headerCardOpacity: 86,
        questionCardOpacity: 92,
        blurAmount: 14,
        borderRadius: 14,
        shadowStrength: 'lg',
      },
      hero: {
        enabled: true,
      },
      decoration: {
        type: 'hero',
      },
    },
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Blank theme with no preset decoration.',
    config: {
      theme: 'custom',
      primaryColor: '#171717',
      backgroundColor: '#ffffff',
      fontFamily: 'Geist Variable',
      header: {
        title: '',
        description: '',
        logoPosition: 'left',
        logoSize: 'md',
      },
      submitButton: {
        text: 'Submit',
        alignment: 'left',
      },
      appearance: {
        backgroundImageOpacity: 0,
        headerCardOpacity: 100,
        questionCardOpacity: 100,
        blurAmount: 0,
        borderRadius: 8,
        shadowStrength: 'none',
      },
      hero: {
        enabled: false,
      },
      decoration: {
        type: 'none',
      },
    },
  },
}

export const THEME_OPTIONS = Object.values(THEME_PRESETS)

export function getThemePreset(theme: ThemeId) {
  return THEME_PRESETS[theme]
}
