import type { ComponentProps } from 'react'
import { DropdownMenu as Primitive } from 'radix-ui'
import { cn } from '@/lib/cn'

const MENU_OFFSET_PX = 4
export const DropdownMenu = Primitive.Root
export const DropdownMenuTrigger = Primitive.Trigger
export const DropdownMenuRadioGroup = Primitive.RadioGroup
const MENU_ITEM_STYLE =
  'flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none focus:bg-muted focus:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
export function DropdownMenuContent({
  className,
  sideOffset = MENU_OFFSET_PX,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-lg',
          className,
        )}
        {...props}
      />
    </Primitive.Portal>
  )
}
export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof Primitive.Item>) {
  return <Primitive.Item className={cn(MENU_ITEM_STYLE, className)} {...props} />
}

export function DropdownMenuRadioItem({
  className,
  ...props
}: ComponentProps<typeof Primitive.RadioItem>) {
  return <Primitive.RadioItem className={cn(MENU_ITEM_STYLE, className)} {...props} />
}
