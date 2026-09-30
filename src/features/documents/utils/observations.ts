import type { TFunction } from 'i18next'

import { ES } from '@/app/i18n/es'

type KnownCode = keyof typeof ES.observation

function isKnown(code: string): code is KnownCode {
  return code in ES.observation
}

/** The translated label of an observation code; unknown codes show as they are. */
export function observationLabel(t: TFunction, code: string): string {
  return isKnown(code) ? t(`observation.${code}`) : code
}
