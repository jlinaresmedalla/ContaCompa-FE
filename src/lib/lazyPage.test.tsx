import { act, cleanup, render, screen } from '@testing-library/react'
import { type ComponentType } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'

import { i18n } from '@/app/i18n'
import { AppLayout } from '@/components/templates'
import { PublicLayout } from '@/components/templates'
import { PageSkeleton } from '@/components/molecules/PageSkeleton'
import { FilePreviewSkeleton } from '@/features/documents/components/FilePreviewSkeleton'
import { API_KEY_STORE } from '@/lib/api-key'

import { lazyPage } from './lazyPage'

vi.mock('@/features/session/SessionPanel', () => ({ SessionPanel: () => null }))

function PrivateShell() {
  return (
    <AppLayout
      account={{ company: 'Example', initials: 'EX', timeLeft: null, signOut: () => {} }}
    />
  )
}

afterEach(cleanup)

test.each([
  [PublicLayout, 'banner'],
  [PrivateShell, 'complementary'],
] as const)('a lazy route keeps its %s shell while loading (%s)', async (Layout, shellRole) => {
  await i18n.changeLanguage('en')
  API_KEY_STORE.clear()
  let resolvePage!: (page: { default: ComponentType }) => void
  const load = vi.fn(
    () =>
      new Promise<{ default: ComponentType }>((resolve) => {
        resolvePage = resolve
      }),
  )
  const LazyRoute = lazyPage(load, <PageSkeleton />)
  expect(load).not.toHaveBeenCalled()
  const router = createMemoryRouter([
    { element: <Layout />, children: [{ path: '/', element: <LazyRoute /> }] },
  ])
  render(<RouterProvider router={router} />)
  const topBar = screen.getByRole(shellRole)
  const main = screen.getByRole('main')
  expect(main).toContainElement(screen.getByRole('status', { name: 'Loading…' }))
  expect(topBar).toBeInTheDocument()
  await act(async () => {
    resolvePage({ default: () => <h1>Loaded page</h1> })
    await Promise.resolve()
  })
  expect(await screen.findByRole('heading', { name: 'Loaded page' })).toBeInTheDocument()
  expect(screen.queryByRole('status')).toBeNull()
  expect(screen.getByRole(shellRole)).toBe(topBar)
  expect(load).toHaveBeenCalledTimes(1)
})

test('a lazy preview keeps surrounding document content and forwards its props', async () => {
  await i18n.changeLanguage('en')
  type PreviewProps = { filename: string }
  let resolvePreview!: (preview: { default: ComponentType<PreviewProps> }) => void
  const Preview = lazyPage(
    () =>
      new Promise<{ default: ComponentType<PreviewProps> }>((resolve) => {
        resolvePreview = resolve
      }),
    <FilePreviewSkeleton />,
  )
  render(
    <div>
      <h1>Document details</h1>
      <Preview filename="invoice.pdf" />
    </div>,
  )
  expect(screen.getByRole('heading', { name: 'Document details' })).toBeInTheDocument()
  expect(
    screen.getByRole('status', { name: 'Loading…' }).querySelector('[data-slot="skeleton"]'),
  ).toBeInTheDocument()
  await act(async () => {
    resolvePreview({ default: ({ filename }) => <p>{filename}</p> })
    await Promise.resolve()
  })
  expect(await screen.findByText('invoice.pdf')).toBeInTheDocument()
  expect(screen.queryByRole('status')).toBeNull()
})
