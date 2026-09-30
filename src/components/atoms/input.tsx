import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-control w-full rounded-control border border-border bg-card px-3 text-sm',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        'placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}
