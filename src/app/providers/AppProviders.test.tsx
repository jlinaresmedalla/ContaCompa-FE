import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { AppProviders } from './AppProviders'

vi.mock('@/features/home/HomePage', () => ({ HomePage: () => <p>Home route</p> }))
vi.mock('@/features/design/DesignPage', () => ({ DesignPage: () => <p>Design route</p> }))
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
