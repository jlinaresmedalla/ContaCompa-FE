import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from './IconButton'

export function TableSectionLabel({
  label,
  count,
  info,
}: {
  label: string
  count?: number
  info?: string
}) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-control-compact items-center justify-between gap-2 px-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        {count === undefined ? label : t('common.tableSectionCount', { label, count })}
      </h2>
      {info ? <IconButton size="row" variant="ghost" icon={Info} label={info} /> : null}
    </div>
  )
}
