import { Save, X, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/molecules'
import { cn } from '@/lib/cn'
import { Button } from '@/components/atoms'
import type { InvoiceEdit } from '../hooks/useInvoiceEdit'

export function InvoiceEditActions({
  edit,
  phone = false,
  previewVisible = false,
  togglePreview,
}: {
  edit: InvoiceEdit
  phone?: boolean
  previewVisible?: boolean
  togglePreview?: () => void
}) {
  const { t } = useTranslation()
  return (
    <div
      role="status"
      aria-label={t('detail.unsavedTitle')}
      className={cn(
        'flex flex-wrap items-center gap-2',
        phone &&
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-4.5 pt-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]',
      )}
      aria-live="polite"
    >
      <span className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">
        {t('detail.historyCount', { count: edit.changed.length })}
      </span>
      <span className="text-xs text-destructive">
        {t('detail.errorCount', { count: edit.errorCount })}
      </span>
      {phone ? (
        <IconButton
          icon={previewVisible ? EyeOff : Eye}
          label={t(previewVisible ? 'detail.hidePreview' : 'detail.showPreview')}
          aria-pressed={previewVisible}
          onClick={togglePreview}
          className="ml-auto size-[var(--control-touch-height)]"
        />
      ) : null}
      <div className={cn('flex gap-2', phone && 'grid w-full grid-cols-[1fr_1.4fr] gap-3.5')}>
        <Button variant="outline" onClick={edit.cancel} disabled={edit.pending}>
          <X aria-hidden="true" className="size-4" />
          {t('detail.cancel')}
        </Button>
        <Button
          onClick={() => void edit.save()}
          disabled={edit.pending || (edit.changed.length > 0 && edit.errorCount > 0)}
        >
          <Save aria-hidden="true" className="size-4" />
          {t(edit.pending ? 'detail.saving' : 'detail.sectionSave')}
        </Button>
      </div>
    </div>
  )
}
