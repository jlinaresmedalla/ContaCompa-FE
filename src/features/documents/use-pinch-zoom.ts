import { useCallback, useRef, useState, type TouchEvent } from 'react'

const MAX_ZOOM = 4
const TOUCH_PAIR_SIZE = 2

function distance(event: TouchEvent) {
  const first = event.touches[0]!
  const second = event.touches[1]!
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY)
}

export function usePinchZoom() {
  const [scale, setScale] = useState(1)
  const gesture = useRef<{ distance: number; scale: number } | null>(null)
  return {
    scale,
    viewportRef: useCallback((element: HTMLDivElement | null) => {
      if (!element) return
      const preventPinchScroll = (event: globalThis.TouchEvent) => {
        if (event.touches.length === TOUCH_PAIR_SIZE) event.preventDefault()
      }
      element.addEventListener('touchmove', preventPinchScroll, { passive: false })
      return () => element.removeEventListener('touchmove', preventPinchScroll)
    }, []),
    onTouchStart: (event: TouchEvent) => {
      if (event.touches.length === TOUCH_PAIR_SIZE) {
        gesture.current = { distance: distance(event), scale }
      }
    },
    onTouchMove: (event: TouchEvent) => {
      if (event.touches.length !== TOUCH_PAIR_SIZE || !gesture.current) return
      if (gesture.current.distance > 0) {
        setScale(
          Math.min(
            MAX_ZOOM,
            Math.max(1, (gesture.current.scale * distance(event)) / gesture.current.distance),
          ),
        )
      }
    },
    onTouchEnd: () => {
      gesture.current = null
    },
  }
}
