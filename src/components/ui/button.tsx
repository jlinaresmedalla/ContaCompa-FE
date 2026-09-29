import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  outline: 'border border-border bg-card hover:bg-muted',
  ghost: 'hover:bg-muted',
  danger: 'bg-danger text-card hover:opacity-90',
  success: 'bg-success text-card hover:opacity-90',
} as const

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
