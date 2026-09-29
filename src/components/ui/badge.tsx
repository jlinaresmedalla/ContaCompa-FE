import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-muted text-muted-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/15 text-danger',
  info: 'bg-info/15 text-info',
} as const

export type BadgeTone = keyof typeof tones

export function Badge({
  tone = 'neutral',
  title,
  children,
}: {
  tone?: BadgeTone
  title?: string
  children: ReactNode
}) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}
