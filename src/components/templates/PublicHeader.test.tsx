import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'
import { TABLET_WIDTH_PX } from '@/lib/breakpoints'
import { lazyPage } from '@/lib/lazyPage'
import { PublicHeader } from './PublicHeader'

const PLACEHOLDER_COUNT = 2
const LOAD_PHONE = vi.hoisted(() => vi.fn())

vi.mock('@/lib/lazyPage', async (importOriginal) => {
  const original = await importOriginal<{ lazyPage: typeof lazyPage }>()
  return {
    lazyPage: ((load, fallback) =>
      original.lazyPage(() => {
        LOAD_PHONE()
        return load()
      }, fallback)) as typeof lazyPage,
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
  LOAD_PHONE.mockClear()
})

function mockViewport(initialPhone: boolean) {
  let phone = initialPhone
  const listeners = new Set<() => void>()
  const remove = vi.fn((listener: () => void) => listeners.delete(listener))
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return phone
      },
      addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
      removeEventListener: remove,
    })),
  )
  return {
    remove,
    resize(nextPhone: boolean) {
      phone = nextPhone
      act(() => listeners.forEach((listener) => listener()))
    },
  }
}

function renderHeader() {
  return render(
    <MemoryRouter>
      <PublicHeader />
    </MemoryRouter>,
  )
}

test('tablet and desktop never request the phone menu module', () => {
  mockViewport(false)
  renderHeader()
  expect(window.matchMedia(`(width < ${TABLET_WIDTH_PX}px)`).matches).toBe(false)
  expect(LOAD_PHONE).not.toHaveBeenCalled()
  expect(screen.queryByTestId('phone-preferences-fallback')).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Language: English' })).not.toBeInTheDocument()
})

test('crossing to phone reserves two touch controls then loads preferences; resizing back removes them', async () => {
  const viewport = mockViewport(false)
  const view = renderHeader()
  viewport.resize(true)
  const fallback = screen.getByTestId('phone-preferences-fallback')
  expect(fallback.children).toHaveLength(PLACEHOLDER_COUNT)
  for (const placeholder of fallback.children) {
    expect(placeholder).toHaveClass('size-[3.25rem]', 'rounded-control')
  }
  expect(LOAD_PHONE).toHaveBeenCalledTimes(1)
  expect(await screen.findByRole('button', { name: 'Language: English' })).toBeInTheDocument()
  viewport.resize(false)
  expect(screen.queryByRole('button', { name: 'Language: English' })).not.toBeInTheDocument()
  view.unmount()
  expect(viewport.remove).toHaveBeenCalled()
})

test('a first visit below the tablet boundary renders phone preferences', async () => {
  mockViewport(true)
  renderHeader()
  expect(await screen.findByRole('button', { name: 'Language: English' })).toBeInTheDocument()
})
