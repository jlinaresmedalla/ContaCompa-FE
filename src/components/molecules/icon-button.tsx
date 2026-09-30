import { cloneElement, type ComponentProps, type ReactElement } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms'

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'children' | 'aria-label' | 'size'> & {
  size?: 'default' | 'row'
  icon: LucideIcon
  label: string
  children?: ReactElement<{ children?: ReactElement; 'aria-label'?: string }>
}

export function IconButton({
  icon: Icon,
  label,
  children,
  size = 'default',
  ...props
}: IconButtonProps) {
  const glyph = <Icon aria-hidden="true" className="size-4" />
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            {...props}
            size={size === 'row' ? 'row-icon' : 'icon'}
            aria-label={label}
          >
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
