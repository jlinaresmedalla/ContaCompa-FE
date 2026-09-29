import type { TFunction } from 'i18next'

import { es } from '@/app/i18n/es'

type KnownCode = keyof typeof es.observation

function isKnown(code: string): code is KnownCode {
  return code in es.observation
}

/** The translated label of an observation code; unknown codes show as they are. */
export function observationLabel(t: TFunction, code: string): string {
  return isKnown(code) ? t(`observation.${code}`) : code
}
