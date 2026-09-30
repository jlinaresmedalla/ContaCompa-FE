import { cn } from '@/lib/cn'

export function Backdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'brand-backdrop pointer-events-none absolute inset-0 -z-10 rounded-[inherit]',
        className,
      )}
    />
  )
}
