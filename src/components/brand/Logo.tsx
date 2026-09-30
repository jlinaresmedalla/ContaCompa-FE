import { cn } from '@/lib/cn'

import { LogoMark } from './LogoMark'

interface LogoProps {
  className?: string
  title?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { mark: 'size-4', wordmark: 'text-sm' },
  md: { mark: 'size-8', wordmark: 'text-[17px]' },
  lg: { mark: 'size-12', wordmark: 'text-2xl' },
}

export function Logo({ className, title, size = 'md' }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className={cn('text-primary', sizes[size].mark)} title={title} />
      <span className={cn('font-semibold tracking-tight text-foreground', sizes[size].wordmark)}>
        Contacompa
      </span>
    </span>
  )
}
