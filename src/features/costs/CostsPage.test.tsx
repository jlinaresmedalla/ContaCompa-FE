import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { COST_API } from './api'
import { CostsPage } from './CostsPage'
import type { CostLine, CostReport } from './types'

const DEFAULT_DAYS = 30
const SHORT_DAYS = 7
const LONG_DAYS = 90
const TOTAL_DOCS = 12
const INPUT_TOKENS = 1000
const OUTPUT_TOKENS = 500
const LINE: CostLine = {
  docs: TOTAL_DOCS,
  input_tokens: INPUT_TOKENS,
  output_tokens: OUTPUT_TOKENS,
  billed_usd: '0',
  list_usd: '1.25',
  list_usd_per_doc: '0.10417',
}
const REPORT: CostReport = {
  today: LINE,
  month: LINE,
  total: LINE,
  by_model: [{ ...LINE, model: 'test-model' }],
  by_day: [{ ...LINE, day: '2026-09-30' }],
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})
afterEach(() => vi.restoreAllMocks())

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <CostsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

test('renders stats and changes the report with the chosen period', async () => {
  const report = vi.spyOn(COST_API, 'report').mockImplementation((days) =>
    Promise.resolve({
      ...REPORT,
      total: { ...LINE, list_usd: days === SHORT_DAYS ? '7.00' : '1.25' },
    }),
  )
  renderPage()
  expect(await screen.findByText('test-model')).toBeInTheDocument()
  expect(screen.getByText('Today · list price')).toBeInTheDocument()
  expect(screen.getByText('This month · list price')).toBeInTheDocument()
  expect(screen.getByText('All time · list price')).toBeInTheDocument()
  expect(screen.getByText('Per purchase doc · list price')).toBeInTheDocument()
  expect(report).toHaveBeenCalledWith(DEFAULT_DAYS, expect.any(AbortSignal))
  const select = await screen.findByRole('combobox', { name: 'Report period' })
  fireEvent.keyDown(select, { key: 'ArrowDown' })
  fireEvent.click(await screen.findByRole('option', { name: 'Last 7 days' }))
  await waitFor(() => expect(report).toHaveBeenCalledWith(SHORT_DAYS, expect.any(AbortSignal)))
  expect(await screen.findByText('US$ 7.0000')).toBeInTheDocument()
})

test('offers upload when no costs have been recorded', async () => {
  vi.spyOn(COST_API, 'report').mockResolvedValue({ ...REPORT, total: { ...LINE, docs: 0 } })
  renderPage()
  expect(await screen.findByRole('link', { name: 'Upload files' })).toHaveAttribute(
    'href',
    '/extraction/jobs',
  )
  expect(screen.queryByRole('img', { name: 'Purchase docs processed per day' })).toBeNull()
})

test('loads the long period from the same select', async () => {
  const report = vi.spyOn(COST_API, 'report').mockResolvedValue(REPORT)
  renderPage()
  const select = await screen.findByRole('combobox', { name: 'Report period' })
  fireEvent.keyDown(select, { key: 'ArrowDown' })
  fireEvent.click(await screen.findByRole('option', { name: 'Last 90 days' }))
  await waitFor(() => expect(report).toHaveBeenCalledWith(LONG_DAYS, expect.any(AbortSignal)))
})

test('explains billed and list price in the info tooltip', async () => {
  vi.spyOn(COST_API, 'report').mockResolvedValue(REPORT)
  renderPage()
  const info = await screen.findByRole('button', { name: i18n.t('costs.explanation') })
  fireEvent.focus(info)
  expect(await screen.findByRole('tooltip')).toHaveTextContent(i18n.t('costs.explanation'))
})

test.each(['en', 'es'])(
  'uses singular purchase doc counts and four decimals in %s',
  async (language) => {
    await i18n.changeLanguage(language)
    const single = { ...LINE, docs: 1 }
    vi.spyOn(COST_API, 'report').mockResolvedValue({
      ...REPORT,
      today: single,
      month: single,
      total: single,
    })
    renderPage()
    await screen.findByText('test-model')
    expect(
      screen.getAllByText(i18n.t('costs.summary', { count: 1, tokens: '1,500' })).length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('US$ 0.0000').length).toBeGreaterThan(0)
    expect(screen.getAllByText('US$ 0.1042').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('columnheader', { name: i18n.t('costs.columns.input') }),
    ).toBeInTheDocument()
  },
)

test.each(['en', 'es'])('labels the framed model table with its count in %s', async (language) => {
  await i18n.changeLanguage(language)
  vi.spyOn(COST_API, 'report').mockResolvedValue(REPORT)
  renderPage()
  await screen.findByText('test-model')
  expect(
    screen.getByRole('heading', {
      name: i18n.t('common.tableSectionCount', {
        label: i18n.t('costs.byModel'),
        count: REPORT.by_model.length,
      }),
    }),
  ).toBeInTheDocument()
  expect(screen.getByRole('table').closest('[data-slot="card"]')).toBeNull()
})
