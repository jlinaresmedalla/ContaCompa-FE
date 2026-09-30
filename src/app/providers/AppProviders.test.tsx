import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { AppProviders } from './AppProviders'

// Keep the DOM provider on Vitest's ESM router context instead of its CJS copy.
vi.mock('react-router/dom', async () => {
  const { RouterProvider } = await import('react-router')
  const { flushSync } = await import('react-dom')
  return {
    RouterProvider: (props: Parameters<typeof RouterProvider>[0]) => (
      <RouterProvider
        {...props}
        flushSync={(callback) => {
          flushSync(callback)
          return undefined
        }}
      />
    ),
  }
})

vi.mock('@/features/home/HomePage', () => ({ HomePage: () => <p>Home route</p> }))
vi.mock('@/features/design/DesignPage', () => ({ DesignPage: () => <p>Design route</p> }))
vi.mock('@/features/session/components/SessionLayout', () => {
  throw new Error('Public navigation must not load the session runtime')
})
vi.mock('@/lib/http', () => {
  throw new Error('Public navigation must not load the HTTP client')
})

test('renders and navigates public routes through the production browser router', async () => {
  window.history.replaceState(null, '', '/')
  render(<AppProviders />)
  expect(await screen.findByText('Home route')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Design' }))
  expect(await screen.findByText('Design route')).toBeInTheDocument()
  expect(window.location.pathname).toBe('/design')
  window.history.replaceState(null, '', '/')
})
