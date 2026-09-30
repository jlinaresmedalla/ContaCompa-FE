import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/cn'
const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-muted-foreground',
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/20 text-warning',
        danger: 'bg-destructive/15 text-destructive',
        info: 'bg-info/15 text-info',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)
export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>['variant']>
function Badge({
  className,
  tone = 'neutral',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & { tone?: BadgeTone; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant: tone }), className)}
      {...props}
    />
  )
}
export { Badge, badgeVariants }
