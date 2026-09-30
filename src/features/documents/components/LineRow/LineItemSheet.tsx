import type { RefObject } from 'react'
import { Save, X, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms'
import { BottomSheet } from '@/components/organisms'
import type { useLineCorrections } from './useLineCorrections'
import { LineEditInput, type LineEditField } from './LineEditInput'

const FIELDS = ['quantity', 'unit', 'description', 'unit_price', 'line_total'] as const
export function LineItemSheet({
  edit,
  lineNumber,
  open,
  returnFocusRef,
}: {
  edit: ReturnType<typeof useLineCorrections>
  lineNumber: number
  open: boolean
  returnFocusRef: RefObject<HTMLButtonElement | null>
}) {
  const { t } = useTranslation()
  const label = (field: LineEditField) => t(`detail.fields.${field}`)
  return (
    <BottomSheet
      open={open}
      onOpenChange={(shown) => {
        if (!shown && !edit.pending) edit.cancel()
      }}
      title={t('detail.editLine', { n: lineNumber })}
      description={t('detail.derivedPrices')}
      closeLabel={t('detail.cancel')}
      returnFocusRef={returnFocusRef}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void edit.save()
        }}
        className="space-y-5.5"
      >
        <div className="grid grid-cols-2 gap-3.5">
          {FIELDS.map((field) => (
            <label key={field} className={field === 'description' ? 'col-span-2' : ''}>
              <span className="mb-1.5 block text-xs font-medium">
                {label(field)}
                {field === 'unit_price' || field === 'line_total'
                  ? ` (${t('prices.printed')})`
                  : ''}
              </span>
              <LineEditInput edit={edit} field={field} label={label(field)} />
            </label>
          ))}
        </div>
        <p className="flex gap-3 rounded-control border border-border bg-muted p-3.5 text-xs text-muted-foreground">
          <Info aria-hidden="true" className="size-4 shrink-0" />
          {t('detail.derivedPrices')}
        </p>
        <div className="grid grid-cols-2 gap-3.5">
          <Button variant="outline" disabled={edit.pending} onClick={edit.cancel}>
            <X aria-hidden="true" />
            {t('detail.cancel')}
          </Button>
          <Button type="submit" disabled={edit.pending}>
            <Save aria-hidden="true" />
            {t('detail.sectionSave')}
          </Button>
        </div>
      </form>
    </BottomSheet>
  )
}
