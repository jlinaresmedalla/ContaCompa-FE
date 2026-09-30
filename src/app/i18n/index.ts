import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import type { Messages } from './en'

export const LANGUAGES = ['en', 'es'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEYS = { language: 'doc-extraction.language' }

function storedLanguage(): Language {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.language)
    return LANGUAGES.find((language) => language === value) ?? 'en'
  } catch {
    return 'en'
  }
}

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

const MESSAGE_LOADERS = {
  en: async () => (await import('./en')).EN,
  es: async () => (await import('./es')).ES,
}

async function loadMessages(language: Language): Promise<void> {
  if (i18n.hasResourceBundle(language, 'translation')) return
  const messages = await MESSAGE_LOADERS[language]()
  i18n.addResourceBundle(language, 'translation', messages)
}

const INITIAL_LANGUAGE = storedLanguage()
export const I18N_READY = MESSAGE_LOADERS[INITIAL_LANGUAGE]().then(async (messages) => {
  await i18n.use(initReactI18next).init({
    resources: { [INITIAL_LANGUAGE]: { translation: messages } },
    lng: INITIAL_LANGUAGE,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  document.documentElement.lang = i18n.language
})

let requestedLanguage = INITIAL_LANGUAGE

export async function setLanguage(language: Language): Promise<void> {
  requestedLanguage = language
  await I18N_READY
  await loadMessages(language)
  if (requestedLanguage !== language) return
  await i18n.changeLanguage(language)
  try {
    localStorage.setItem(STORAGE_KEYS.language, language)
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
