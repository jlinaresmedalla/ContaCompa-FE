import { render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'

import { i18n } from '@/app/i18n'

import type { ProviderBreaker } from '../types'
import { PausedBanner } from './PausedBanner'

const UNAVAILABLE_ATTEMPTS = 2

const OPEN_UNTIL = '2026-09-29T15:45:00-05:00'

function breaker(patch: Partial<ProviderBreaker>): ProviderBreaker {
  return { name: 'gemini', state: 'open', open_until: OPEN_UNTIL, reason: 'quota', ...patch }
}

function expectedTime() {
  const date = new Date(OPEN_UNTIL)
  const pad = (n: number) => String(n).padStart(UNAVAILABLE_ATTEMPTS, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

test('open breaker shows the banner with the next try in local time', () => {
  render(<PausedBanner provider={breaker({})} />)
  const banner = screen.getByRole('status')
  expect(banner.textContent).toContain('Extraction paused: the model provider is unavailable.')
  expect(banner.textContent).toContain(`Next attempt at ${expectedTime()} (local time).`)
  expect(banner.textContent).toContain('Waiting does not use up job attempts.')
})

test('half_open breaker shows the banner', () => {
  render(<PausedBanner provider={breaker({ state: 'half_open' })} />)
  expect(screen.getByRole('status')).toBeTruthy()
})

test('missing or unparseable open_until omits the time', () => {
  const { rerender } = render(<PausedBanner provider={breaker({ open_until: null })} />)
  expect(screen.getByRole('status').textContent).not.toContain('Next attempt')
  rerender(<PausedBanner provider={breaker({ open_until: 'not a date' })} />)
  expect(screen.getByRole('status').textContent).not.toContain('Next attempt')
})

test('closed, null and absent provider render nothing', () => {
  const { container, rerender } = render(<PausedBanner provider={breaker({ state: 'closed' })} />)
  expect(container.firstChild).toBeNull()
  rerender(<PausedBanner provider={null} />)
  expect(container.firstChild).toBeNull()
  rerender(<PausedBanner provider={undefined} />)
  expect(container.firstChild).toBeNull()
})
