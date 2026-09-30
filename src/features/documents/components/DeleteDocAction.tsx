import { MoreHorizontal } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms'
import { IconButton } from '@/components/molecules'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/organisms'

export function DeleteDocAction({
  open,
  onOpenChange,
  confirm,
  name,
  disabled,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  confirm: () => void
  name: string
  disabled: boolean
}) {
  const { t } = useTranslation()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={MoreHorizontal}
            label={t('detail.moreActions')}
            disabled={disabled}
            className="max-md:size-[var(--control-touch-height)]"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={disabled}
            onSelect={() => onOpenChange(true)}
            className="text-destructive"
          >
            {t('common.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/20" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-card border border-border bg-card p-card shadow-md">
            <Dialog.Title className="text-lg font-semibold">{t('detail.deleteTitle')}</Dialog.Title>
            <Dialog.Description className="my-4 text-sm text-muted-foreground">
              {t('documents.confirmDelete', { name })}
            </Dialog.Description>
            <div className="flex justify-end gap-2">
              <Button variant="outline" disabled={disabled} onClick={() => onOpenChange(false)}>
                {t('detail.cancel')}
              </Button>
              <Button variant="danger" disabled={disabled} onClick={confirm}>
                {t('common.delete')}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
