import { Check, Clock, LoaderCircle, TriangleAlert, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge, Card, Skeleton } from '@/components/atoms'
import { DesignSection } from './DesignSection'

const STATUSES = [
  { name: 'queued', tone: 'warning', Icon: Clock },
  { name: 'processing', tone: 'info', Icon: LoaderCircle },
  { name: 'done', tone: 'success', Icon: Check },
  { name: 'failed', tone: 'warning', Icon: TriangleAlert },
  { name: 'dead', tone: 'danger', Icon: X },
] as const

// These patterns remain feature-owned; there is no shared list-row or status-chip export.
export function ListExamples() {
  const { t } = useTranslation()
  return (
    <>
      <DesignSection name="StatusChip">
        <div className="flex flex-wrap gap-3">
          {STATUSES.map(({ name, tone, Icon }) => (
            <Badge key={name} tone={tone}>
              <Icon aria-hidden className="size-3.5" />
              {t(`jobStatus.${name}`)}
            </Badge>
          ))}
        </div>
      </DesignSection>
      <DesignSection name="ListRow">
        <Card className="overflow-hidden p-0">
          <ul>
            {STATUSES.map(({ name, tone, Icon }) => (
              <li
                key={name}
                className="flex min-h-list-row flex-wrap items-center gap-3.5 border-b border-border px-card py-3 last:border-b-0"
              >
                <span className="flex size-icon-tile items-center justify-center rounded-icon-tile bg-primary/10 text-primary">
                  <Icon aria-hidden className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">F001-0042.pdf</span>
                <Badge tone={tone}>{t(`jobStatus.${name}`)}</Badge>
              </li>
            ))}
            <li
              aria-label={t('design.loading')}
              className="flex h-list-row items-center gap-3.5 px-card"
            >
              <Skeleton className="size-icon-tile" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-chip w-20" />
            </li>
          </ul>
        </Card>
      </DesignSection>
    </>
  )
}
