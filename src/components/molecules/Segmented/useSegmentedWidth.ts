import { useEffect, useRef, useState } from 'react'

export const SEGMENTED_SELECT_WIDTH_PX = 480

export function useSegmentedWidth() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const update = () => {
      const width = container.getBoundingClientRect().width
      setCompact(width > 0 && width < SEGMENTED_SELECT_WIDTH_PX)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])
  return { containerRef, compact }
}
