import { createInstance } from 'i18next'
import { expect, test } from 'vitest'
import { EN_COMMON } from './en/common'
import { ES_COMMON } from './es/common'

const PLURAL_COUNT = 2

test('uses native singular and plural purchase document counts in both languages', async () => {
  const i18n = createInstance()
  await i18n.init({
    lng: 'en',
    resources: { en: { translation: EN_COMMON }, es: { translation: ES_COMMON } },
  })
  expect(i18n.t('common.purchaseDocs', { count: 1 })).toBe('1 purchase doc')
  expect(i18n.t('common.purchaseDocs', { count: PLURAL_COUNT })).toBe('2 purchase docs')
  expect(i18n.t('common.purchaseDocs', { count: 0 })).toBe('0 purchase docs')
  await i18n.changeLanguage('es')
  expect(i18n.t('common.purchaseDocs', { count: 1 })).toBe('1 comprobante')
  expect(i18n.t('common.purchaseDocs', { count: PLURAL_COUNT })).toBe('2 comprobantes')
  expect(i18n.t('common.purchaseDocs', { count: 0 })).toBe('0 comprobantes')
})
