import { TOGGLE_VARIANTS } from '@/lib/toggle-variants'
import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Toggle as TogglePrimitive } from 'radix-ui'

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof TOGGLE_VARIANTS>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(TOGGLE_VARIANTS({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle }
