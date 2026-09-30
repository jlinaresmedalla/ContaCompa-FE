import { act, renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useRailMenu } from './use-rail-menu'

test('opening and closing the page menu dismisses and suppresses stale tooltip requests', () => {
  const { result } = renderHook(useRailMenu)
  act(() => result.current.setTooltipOpen(true))
  expect(result.current.tooltipOpen).toBe(true)
  act(() => result.current.onMenuChange(true))
  expect(result.current.tooltipOpen).toBe(false)
  act(() => result.current.onMenuChange(false))
  act(() => result.current.setTooltipOpen(true))
  expect(result.current.tooltipOpen).toBe(false)
  act(() => result.current.setTooltipOpen(false))
  act(() => result.current.setTooltipOpen(true))
  expect(result.current.tooltipOpen).toBe(true)
})
