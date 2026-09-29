import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './en'
import { es, type Messages } from './es'

export const LANGUAGES = ['es', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'doc-extraction.language'

function storedLanguage(): Language {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.find((language) => language === value) ?? 'es'
  } catch {
    return 'es'
  }
}

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: storedLanguage(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})
document.documentElement.lang = i18n.language

export function setLanguage(language: Language): void {
  void i18n.changeLanguage(language)
  document.documentElement.lang = language
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    /* private mode: the choice lasts until reload */
  }
}

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: Messages }
  }
}

export { i18n }
