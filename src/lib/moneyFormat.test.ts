import { expect, test } from 'vitest'
import { formatCost, formatDerivedPrice, formatPrintedPrice, formatTotal } from './moneyFormat'

test('uses consistent precision for each money column kind', () => {
  expect(formatPrintedPrice('45')).toBe('S/\u00a045.00')
  expect(formatDerivedPrice('38.1356')).toBe('S/\u00a038.1356')
  expect(formatTotal('1234.567')).toBe('S/\u00a01,234.57')
  expect(formatCost('0.00372')).toBe('US$\u00a00.0037')
  expect(formatPrintedPrice('38.1356')).toBe(formatDerivedPrice('38.1356'))
})

test('keeps zero, currency and negative amounts and handles absent or invalid values', () => {
  expect(formatTotal(0, 'USD')).toBe('US$\u00a00.00')
  expect(formatTotal(-1, 'EUR')).toBe('EUR\u00a0-1.00')
  for (const value of [null, undefined, '', 'invalid', Infinity])
    expect(formatTotal(value)).toBe('—')
})

test('unit prices retain only necessary decimals above two', () => {
  expect(formatDerivedPrice('45')).toBe('S/\u00a045.00')
  expect(formatPrintedPrice('38.1300')).toBe('S/\u00a038.13')
  expect(formatPrintedPrice('38.135')).toBe('S/\u00a038.135')
})

test('keeps currency and number joined by a non-breaking space for every formatter', () => {
  for (const format of [formatPrintedPrice, formatDerivedPrice, formatTotal, formatCost]) {
    expect(format('1234.567')).toMatch(/^[^\s]+\u00a0[\d,.]+$/)
  }
})
