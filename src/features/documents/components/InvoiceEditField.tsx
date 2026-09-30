import type { SelectInstance } from 'react-select'
import { Check, X, Undo2, CircleAlert, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input, ToggleGroup, ToggleGroupItem } from '@/components/atoms'
import { AppSelect, IconButton } from '@/components/molecules'
import { cn } from '@/lib/cn'
import { DOC_TYPES } from '../schemas/correction'
import { IGV_OPTIONS, type HeaderField } from '../invoice-fields'
import type { InvoiceEdit } from '../use-invoice-edit'

function focusFirst(control: SelectInstance<{ value: string; label: string }, boolean> | null) {
  control?.focus()
}

const IGV_ICONS = { true: Check, false: X, unknown: HelpCircle }

export function InvoiceEditField({ name, edit }: { name: HeaderField; edit: InvoiceEdit }) {
  const { t } = useTranslation()
  if (!edit.values) return null
  const label = t(`detail.fields.${name}`)
  const error = edit.errors[name]
  const changed = edit.changed.includes(name)
  const errorId = `invoice-${name}-error`
  const stateClass = error ? 'border-destructive' : changed ? 'border-primary/40' : 'border-input'
  return (
    <div>
      <label
        htmlFor={`invoice-${name}`}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {label}
        {changed ? (
          <span aria-label={t('detail.changed')} className="size-1.5 rounded-full bg-primary" />
        ) : null}
      </label>
      <div className={cn('relative mt-1.5 rounded-control', changed && 'ring-1 ring-primary/40')}>
        {name === 'doc_type' ? (
          <AppSelect
            id={`invoice-${name}`}
            label={label}
            value={edit.values[name]}
            inputRef={focusFirst}
            onChange={(value) => edit.change(name, value)}
            disabled={edit.pending}
            options={DOC_TYPES.map((value) => ({ value, label: t(`docType.${value}`) }))}
          />
        ) : name === 'prices_include_igv' ? (
          <ToggleGroup
            type="single"
            value={edit.values[name]}
            aria-label={label}
            onValueChange={(value) => {
              if (value) edit.change(name, value)
            }}
            className={cn('h-control w-full rounded-control border', stateClass)}
          >
            {IGV_OPTIONS.map((value) => {
              const Icon = IGV_ICONS[value]
              return (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  disabled={edit.pending}
                  aria-label={t(`detail.igv.${value}`)}
                  className="h-full flex-1 rounded-control"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        ) : (
          <Input
            id={`invoice-${name}`}
            value={edit.values[name]}
            disabled={edit.pending}
            onChange={(event) => edit.change(name, event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn('pr-12', stateClass)}
          />
        )}
        {changed ? (
          <IconButton
            icon={Undo2}
            label={t('detail.undoField', { field: label })}
            variant="ghost"
            size="row"
            disabled={edit.pending}
            onClick={() => edit.undo(name)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-background max-md:size-[var(--control-touch-height)]"
          />
        ) : name !== 'doc_type' && name !== 'prices_include_igv' && !error ? (
          <Check
            aria-label={t('detail.valid')}
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-success"
          />
        ) : null}
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1 flex items-center gap-1 text-xs text-destructive"
        >
          <CircleAlert aria-hidden="true" className="size-4" />
          {t(error)}
        </p>
      ) : null}
    </div>
  )
}
