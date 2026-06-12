import type { CSSProperties } from 'react'

import type { BuilderConfig } from '@/src/lib/builder-config'

type CardKind = 'header' | 'question'

const SHADOWS: Record<BuilderConfig['appearance']['shadowStrength'], string> = {
  none: 'none',
  sm: '0 1px 2px rgb(15 23 42 / 0.08)',
  md: '0 8px 24px rgb(15 23 42 / 0.12)',
  lg: '0 18px 48px rgb(15 23 42 / 0.16)',
}

export function getSurveyCardStyle(builderConfig: BuilderConfig, kind: CardKind): CSSProperties {
  const opacity =
    kind === 'header'
      ? builderConfig.appearance.headerCardOpacity
      : builderConfig.appearance.questionCardOpacity
  const alpha = clamp(opacity, 0, 100) / 100
  const blur = clamp(builderConfig.appearance.blurAmount, 0, 48)
  const radius = clamp(builderConfig.appearance.borderRadius, 0, 64)

  return {
    backgroundColor: `rgba(255, 255, 255, ${alpha})`,
    borderColor: 'rgb(0 0 0 / 0.10)',
    borderRadius: radius,
    boxShadow: SHADOWS[builderConfig.appearance.shadowStrength],
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  }
}

export function getSurveyBackgroundStyle(builderConfig: BuilderConfig): CSSProperties {
  const hasBackgroundImage = Boolean(builderConfig.backgroundImageUrl)
  const backgroundOverlayOpacity = getBackgroundImageOverlayOpacity(builderConfig)

  return {
    '--survey-primary': builderConfig.primaryColor,
    '--survey-background': builderConfig.backgroundColor,
    backgroundColor: builderConfig.backgroundColor,
    backgroundImage: hasBackgroundImage
      ? `linear-gradient(rgba(255,255,255,${backgroundOverlayOpacity}), rgba(255,255,255,${backgroundOverlayOpacity})), url("${builderConfig.backgroundImageUrl}")`
      : undefined,
    backgroundPosition: hasBackgroundImage ? 'center' : undefined,
    backgroundRepeat: hasBackgroundImage ? 'no-repeat' : undefined,
    backgroundSize: hasBackgroundImage ? 'cover' : undefined,
    fontFamily: builderConfig.fontFamily,
  } as CSSProperties
}

export function getBackgroundImageOverlayOpacity(builderConfig: BuilderConfig) {
  return 1 - clamp(builderConfig.appearance.backgroundImageOpacity, 0, 100) / 100
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
