import type { ReactNode, RefObject } from 'react'
import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms'

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  returnFocusRef,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  closeLabel: string
  returnFocusRef?: RefObject<HTMLButtonElement | null>
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <Dialog.Content
          onCloseAutoFocus={
            returnFocusRef
              ? (event) => {
                  event.preventDefault()
                  returnFocusRef.current?.focus()
                }
              : undefined
          }
          className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-card px-5.5 pb-5.5 pt-2.5 text-card-foreground outline-none"
        >
          <div aria-hidden="true" className="mx-auto mb-5.5 h-1 w-11.5 rounded-full bg-border" />
          <div className="mb-5.5 flex items-center justify-between gap-3.5">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Button
              aria-label={closeLabel}
              size="icon"
              variant="outline"
              className="max-md:size-[var(--control-touch-height)]"
              onClick={() => onOpenChange(false)}
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <Dialog.Description className="sr-only">{description}</Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
