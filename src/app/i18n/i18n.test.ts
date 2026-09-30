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
  const { i18n, LANGUAGES, I18N_READY } = await import('@/app/i18n')
  await I18N_READY
  expect(i18n.language).toBe('en')
  expect(i18n.t('session.title')).toBe('Sign in')
  expect(document.documentElement.lang).toBe('en')
  expect(LANGUAGES[0]).toBe('en')
  expect(i18n.options.fallbackLng).toEqual(['en'])
})

test('a stored Spanish choice wins on startup', async () => {
  localStorage.setItem(STORAGE_KEY, 'es')
  const { i18n, I18N_READY } = await import('@/app/i18n')
  await I18N_READY
  expect(i18n.language).toBe('es')
  expect(i18n.t('session.title')).toBe('Iniciar sesión')
  expect(document.documentElement.lang).toBe('es')
})

test('setLanguage updates the page language and stores the choice', async () => {
  const { i18n, setLanguage, I18N_READY } = await import('@/app/i18n')
  await I18N_READY
  await setLanguage('es')
  expect(i18n.language).toBe('es')
  expect(document.documentElement.lang).toBe('es')
  expect(localStorage.getItem(STORAGE_KEY)).toBe('es')
  await setLanguage('en')
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
})

test('direct changeLanguage calls keep the page language in sync', async () => {
  const { i18n, I18N_READY } = await import('@/app/i18n')
  await I18N_READY
  const { setLanguage } = await import('@/app/i18n')
  await setLanguage('es')
  await i18n.changeLanguage('es')
  expect(document.documentElement.lang).toBe('es')
  await i18n.changeLanguage('en')
  expect(document.documentElement.lang).toBe('en')
})

test('an unsupported stored choice falls back to English', async () => {
  localStorage.setItem(STORAGE_KEY, 'fr')
  const { i18n, I18N_READY } = await import('@/app/i18n')
  await I18N_READY
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})

test('starts in English when storage is unavailable', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Storage unavailable')
  })
  const { i18n, I18N_READY } = await import('@/app/i18n')
  await I18N_READY
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
})

test('loads the other dictionary before resolving a language change', async () => {
  const { i18n, I18N_READY, setLanguage } = await import('@/app/i18n')
  await I18N_READY
  expect(i18n.hasResourceBundle('en', 'translation')).toBe(true)
  expect(i18n.hasResourceBundle('es', 'translation')).toBe(false)
  await setLanguage('es')
  expect(i18n.hasResourceBundle('es', 'translation')).toBe(true)
  expect(i18n.t('session.title')).toBe('Iniciar sesión')
})

test('keeps the latest choice when the other dictionary is still loading', async () => {
  const { i18n, I18N_READY, setLanguage } = await import('@/app/i18n')
  await I18N_READY
  await Promise.all([setLanguage('es'), setLanguage('en')])
  expect(i18n.language).toBe('en')
  expect(document.documentElement.lang).toBe('en')
  expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
})
