import { afterEach, beforeEach, expect, test, vi } from 'vitest'

const STORAGE_KEY = 'doc-extraction.language'

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  document.documentElement.lang = ''
})

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

test('starts in English without a stored choice', async () => {
  const { i18n, LANGUAGES } = await import('@/app/i18n')
  expect(i18n.language).toBe('en')
  expect(i18n.t('session.title')).toBe('Sign in')
  expect(document.documentElement.lang).toBe('en')
  expect(LANGUAGES[0]).toBe('en')
  expect(i18n.options.fallbackLng).toEqual(['en'])
})

test('a stored Spanish choice wins on startup', async () => {
  localStorage.setItem(STORAGE_KEY, 'es')
  const { i18n } = await import('@/app/i18n')
  expect(i18n.language).toBe('es')
  expect(i18n.t('session.title')).toBe('Iniciar sesión')
  expect(document.documentElement.lang).toBe('es')
})

test('setLanguage updates the page language and stores the choice', async () => {
  const { i18n, setLanguage } = await import('@/app/i18n')
  setLanguage('es')
  expect(i18n.language).toBe('es')
  expect(document.documentElement.lang).toBe('es')
  expect(localStorage.getItem(STORAGE_KEY)).toBe('es')
  setLanguage('en')
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
})

test('direct changeLanguage calls keep the page language in sync', async () => {
  const { i18n } = await import('@/app/i18n')
  await i18n.changeLanguage('es')
  expect(document.documentElement.lang).toBe('es')
  await i18n.changeLanguage('en')
  expect(document.documentElement.lang).toBe('en')
})

test('an unsupported stored choice falls back to English', async () => {
  localStorage.setItem(STORAGE_KEY, 'fr')
  const { i18n } = await import('@/app/i18n')
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})

test('starts in English when storage is unavailable', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Storage unavailable')
  })
  const { i18n } = await import('@/app/i18n')
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})
