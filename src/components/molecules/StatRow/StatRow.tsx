import { Children, type ComponentProps } from 'react'
import { useScrollRowFade } from '../useScrollRowFade'
import { cn } from '@/lib/cn'

export function StatRow({ children, className, ...props }: ComponentProps<'div'>) {
  const { ref, fade } = useScrollRowFade(children)
  const cards = Children.toArray(children)
  if (cards.length === 0) return null
  return (
    <div
      className={cn(
        'grid min-w-0 grid-flow-col auto-cols-fr gap-3 overflow-x-auto scroll-row max-md:auto-cols-[minmax(var(--stat-card-width),1fr)]',
        className,
      )}
      {...props}
      ref={ref}
      data-fade={fade}
    >
      {cards}
    </div>
  )
}
