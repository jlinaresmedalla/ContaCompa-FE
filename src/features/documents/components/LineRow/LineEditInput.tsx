import { useTranslation } from 'react-i18next'
import { Input } from '@/components/atoms'
import type { useLineCorrections } from './useLineCorrections'
import type { ValidationKey } from '../../schemas/correction'

export type LineEditField = 'quantity' | 'unit' | 'description' | 'unit_price' | 'line_total'
export function LineEditInput({
  edit,
  field,
  label,
}: {
  edit: ReturnType<typeof useLineCorrections>
  field: LineEditField
  label: string
}) {
  const { t } = useTranslation()
  return (
    <div className="min-w-0">
      <Input
        aria-label={label}
        aria-invalid={Boolean(edit.errors[field])}
        disabled={edit.pending}
        {...edit.register(field)}
      />
      {edit.errors[field] ? (
        <span role="alert" className="text-xs text-destructive">
          {t(edit.errors[field]?.message as ValidationKey)}
        </span>
      ) : null}
    </div>
  )
}
