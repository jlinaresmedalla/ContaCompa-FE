import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en, type Messages } from './en'
import { es } from './es'

export const LANGUAGES = ['en', 'es'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'doc-extraction.language'

function storedLanguage(): Language {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.find((language) => language === value) ?? 'en'
  } catch {
    return 'en'
  }
}

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: storedLanguage(),
  fallbackLng: 'en',
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
