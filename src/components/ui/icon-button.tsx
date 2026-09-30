import { cloneElement, type ComponentProps, type ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'children' | 'aria-label' | 'size'> & {
  icon: LucideIcon
  label: string
  children?: ReactElement<{ children?: ReactElement; 'aria-label'?: string }>
}

export function IconButton({ icon: Icon, label, children, ...props }: IconButtonProps) {
  const glyph = <Icon aria-hidden="true" className="size-4" />
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" {...props} size="icon" aria-label={label}>
            {props.asChild && children
              ? cloneElement(children, { 'aria-label': label }, glyph)
              : glyph}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
