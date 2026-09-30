import { render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { i18n } from '@/app/i18n'
import { DailyChart } from './DailyChart'

const DAY = {
  day: '2026-09-30',
  docs: 1,
  input_tokens: 0,
  output_tokens: 0,
  list_usd: '0.00372',
  billed_usd: '0',
  list_usd_per_doc: '0.00372',
}
beforeEach(async () => {
  await i18n.changeLanguage('en')
})

test('retains empty-day spacing without stubs and formats a singular day tooltip', () => {
  render(<DailyChart days={[{ ...DAY, day: '2026-09-29', docs: 0 }, DAY]} />)
  const bars = screen.getByRole('img').children
  expect(bars[0]).toHaveStyle({ height: '0%', minHeight: '0' })
  expect(bars[1]).toHaveStyle({ height: '100%' })
  expect(bars[1]).toHaveAttribute(
    'title',
    '2026-09-30: 1 purchase doc · 0 tokens · list price US$\u00a00.0037',
  )
  expect(screen.queryByText('Last 30 days')).toBeNull()
})

test('renders an empty series without invalid heights', () => {
  render(<DailyChart days={[]} />)
  expect(screen.getByRole('img').children).toHaveLength(0)
})
