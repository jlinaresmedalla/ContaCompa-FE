import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { TABLET_WIDTH_PX } from '@/lib/breakpoints'
import { useSidebarState } from '@/components/organisms'
import { useDetailTabs } from './use-detail-tabs'

test.each([TABLET_WIDTH_PX - 1, TABLET_WIDTH_PX])(
  'sidebar and detail tabs share the tablet boundary at %s px',
  (width) => {
    const phone = width < TABLET_WIDTH_PX
    const widthSpy = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(width)
    let update = () => {}
    const media = vi.fn().mockReturnValue({
      matches: phone,
      addEventListener: (_event: string, listener: () => void) => {
        update = listener
      },
      removeEventListener: vi.fn(),
    })
    vi.stubGlobal('matchMedia', media)
    const { result, unmount } = renderHook(() => ({
      sidebar: useSidebarState(),
      detail: useDetailTabs(),
    }))
    expect(result.current.sidebar.isMobile).toBe(phone)
    expect(result.current.detail.phone).toBe(phone)
    expect(media).toHaveBeenCalledWith(`(max-width: ${TABLET_WIDTH_PX - 1}px)`)
    act(() => result.current.detail.setTab('lines'))
    act(update)
    expect(result.current.detail.tab).toBe('lines')
    unmount()
    widthSpy.mockRestore()
    vi.unstubAllGlobals()
  },
)
