import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { useScrollRowFade } from './useScrollRowFade'

const ROW_WIDTH = 200
const OVERFLOW_WIDTH = 400
const MIDPOINT = 100
const CONTENT = ['sample']

function ScrollRow() {
  const { ref, fade } = useScrollRowFade(CONTENT)
  return (
    <div ref={ref} data-testid="row" data-fade={fade}>
      <span>Sample</span>
    </div>
  )
}

function measure(scrollWidth: number) {
  const row = screen.getByTestId('row')
  Object.defineProperties(row, {
    clientWidth: { configurable: true, value: ROW_WIDTH },
    scrollWidth: { configurable: true, value: scrollWidth },
  })
  fireEvent(window, new Event('resize'))
  return row
}

afterEach(() => vi.unstubAllGlobals())

test('has no fade when content fits', () => {
  render(<ScrollRow />)
  expect(measure(ROW_WIDTH)).toHaveAttribute('data-fade', 'none')
})

test('fades the end of an overflowing row and follows its scroll position', () => {
  render(<ScrollRow />)
  const row = measure(OVERFLOW_WIDTH)
  expect(row).toHaveAttribute('data-fade', 'end')
  row.scrollLeft = MIDPOINT
  fireEvent.scroll(row)
  expect(row).toHaveAttribute('data-fade', 'both')
  row.scrollLeft = OVERFLOW_WIDTH - ROW_WIDTH
  fireEvent.scroll(row)
  expect(row).toHaveAttribute('data-fade', 'start')
  row.scrollLeft = 0
  fireEvent.scroll(row)
  expect(row).toHaveAttribute('data-fade', 'end')
  expect(measure(ROW_WIDTH)).toHaveAttribute('data-fade', 'none')
})

test('remeasures on observed size changes and disconnects on unmount', () => {
  let resize = () => {}
  const observe = vi.fn()
  const disconnect = vi.fn()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback
      }
      observe = observe
      disconnect = disconnect
    },
  )
  const { unmount } = render(<ScrollRow />)
  const row = measure(ROW_WIDTH)
  expect(observe).toHaveBeenCalledWith(row)
  expect(observe).toHaveBeenCalledWith(row.firstElementChild)
  Object.defineProperty(row, 'scrollWidth', { configurable: true, value: OVERFLOW_WIDTH })
  act(() => resize())
  expect(row).toHaveAttribute('data-fade', 'end')
  unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
