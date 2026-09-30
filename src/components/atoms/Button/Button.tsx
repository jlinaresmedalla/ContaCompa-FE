import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-border bg-card text-card-foreground hover:bg-muted',
        ghost: 'hover:bg-muted',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        success: 'bg-success text-primary-foreground hover:bg-success/90',
      },
      size: {
        sm: 'h-control-compact px-3 text-xs',
        md: 'h-control px-4 text-sm',
        icon: 'size-icon-button',
        'row-icon': 'size-icon-button-row',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)
function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  type,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      data-slot="button"
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
export { Button, buttonVariants }
