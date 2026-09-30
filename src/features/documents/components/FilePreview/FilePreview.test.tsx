import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { TABLET_WIDTH_PX } from '@/lib/breakpoints'
import { FilePreview } from './FilePreview'

const MOCKS = vi.hoisted(() => ({ type: 'image/jpeg' }))
vi.mock('./useFileUrl', () => ({
  useFileUrl: () => ({ url: 'blob:original', type: MOCKS.type, isLoading: false, error: null }),
}))
const INITIAL_DISTANCE = 100
const ZOOM_DISTANCE = 200
const MAX_DISTANCE = 1000
function touches(distance: number) {
  return [
    { clientX: 0, clientY: 0 },
    { clientX: distance, clientY: 0 },
  ]
}
beforeEach(() => {
  MOCKS.type = 'image/jpeg'
  vi.stubGlobal('innerWidth', TABLET_WIDTH_PX - 1)
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
})
afterEach(() => vi.unstubAllGlobals())

test('phone photos pinch to zoom inside a scrollable viewport with bounded scale', () => {
  render(<FilePreview documentId="file" filename="photo.jpg" />)
  const image = screen.getByRole('img', { name: 'photo.jpg' })
  const viewport = image.parentElement!
  expect(viewport).toHaveClass('overflow-auto')
  expect(image.closest('a')).toBeNull()
  fireEvent.touchStart(viewport, { touches: touches(INITIAL_DISTANCE) })
  fireEvent.touchMove(viewport, { touches: touches(ZOOM_DISTANCE) })
  expect(image).toHaveStyle({ width: '200%' })
  fireEvent.touchMove(viewport, { touches: touches(MAX_DISTANCE) })
  expect(image).toHaveStyle({ width: '400%' })
  fireEvent.touchMove(viewport, { touches: touches(1) })
  expect(image).toHaveStyle({ width: '100%' })
  fireEvent.touchEnd(viewport, { touches: [] })
  fireEvent.touchMove(viewport, { touches: touches(ZOOM_DISTANCE) })
  expect(image).toHaveStyle({ width: '100%' })
})

test('one touch and zero-distance gestures do not change the scale', () => {
  render(<FilePreview documentId="file" filename="photo.jpg" />)
  const image = screen.getByRole('img')
  const viewport = image.parentElement!
  fireEvent.touchStart(viewport, { touches: [touches(1)[0]] })
  fireEvent.touchMove(viewport, { touches: touches(ZOOM_DISTANCE) })
  expect(image).toHaveStyle({ width: '100%' })
  fireEvent.touchStart(viewport, { touches: touches(0) })
  fireEvent.touchMove(viewport, { touches: touches(ZOOM_DISTANCE) })
  expect(image).toHaveStyle({ width: '100%' })
})

test('PDFs retain the native viewer for scrolling and zoom', () => {
  MOCKS.type = 'application/pdf'
  render(<FilePreview documentId="file" filename="original.pdf" />)
  expect(screen.getByTitle('original.pdf')).toHaveAttribute('src', 'blob:original')
})
