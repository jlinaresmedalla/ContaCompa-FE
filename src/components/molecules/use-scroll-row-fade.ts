import { useEffect, useRef, useState } from 'react'

type ScrollRowFade = 'none' | 'start' | 'end' | 'both'
const SCROLL_EDGE_TOLERANCE_PX = 1

export function useScrollRowFade(content: unknown) {
  const ref = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState<ScrollRowFade>('none')

  useEffect(() => {
    const row = ref.current
    if (!row) return
    function update() {
      if (!row) return
      const remaining = row.scrollWidth - row.clientWidth
      const start = row.scrollLeft > SCROLL_EDGE_TOLERANCE_PX
      const end = remaining - row.scrollLeft > SCROLL_EDGE_TOLERANCE_PX
      setFade(
        remaining <= SCROLL_EDGE_TOLERANCE_PX
          ? 'none'
          : start
            ? end
              ? 'both'
              : 'start'
            : end
              ? 'end'
              : 'none',
      )
    }
    update()
    row.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    observer?.observe(row)
    for (const child of row.children) observer?.observe(child)
    return () => {
      row.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
  }, [content])

  return { ref, fade }
}
