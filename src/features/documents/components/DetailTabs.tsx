import { Tabs } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { AppSelect } from '@/components/molecules'
import { Card, CardTitle } from '@/components/atoms'
import { TriangleAlert, List, History } from 'lucide-react'
import { CorrectionHistory } from './CorrectionHistory'
import type { PurchaseDocDetail } from '../types'
import { observationLabel } from '../observations'
import { DETAIL_TABS, useDetailTabs, type DetailTab } from '../use-detail-tabs'
import { IssueBadges } from './IssueBadges'
import { LinesTable } from './LinesTable'

const TAB_ICONS = { observations: TriangleAlert, lines: List, history: History }

export function DetailTabs({ doc: data }: { doc: PurchaseDocDetail }) {
  const { t } = useTranslation()
  const { tab, setTab, phone } = useDetailTabs()
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => setTab(value as DetailTab)}
      className="min-w-0 overflow-hidden rounded-card border border-border bg-card"
    >
      <div className="flex items-center gap-3 border-b border-border px-5.5 py-3.5">
        {phone ? (
          <>
            {(() => {
              const Icon = TAB_ICONS[tab]
              return <Icon aria-hidden="true" className="size-4.5 shrink-0" />
            })()}
            <div className="min-w-0 flex-1">
              <AppSelect
                label={t('detail.view')}
                options={DETAIL_TABS.map((value) => ({ value, label: t(`detail.${value}`) }))}
                value={tab}
                onChange={setTab}
              />
            </div>
          </>
        ) : (
          <Tabs.List
            aria-label={t('detail.view')}
            className="inline-flex h-control gap-0.5 rounded-full bg-muted p-1"
          >
            {DETAIL_TABS.map((value) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 rounded-full px-4 py-0 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                {(() => {
                  const Icon = TAB_ICONS[value]
                  return <Icon aria-hidden="true" className="size-3.5" />
                })()}
                {t(`detail.${value}`)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        )}
      </div>
      <Tabs.Content value="observations" forceMount hidden={tab !== 'observations'}>
        {' '}
        <Card className="rounded-none border-0">
          <CardTitle hint={t('detail.observationsHint')}>{t('detail.observations')}</CardTitle>
          <IssueBadges issues={data.issues} />
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {data.issues.map((issue, index) => (
              <li key={index}>
                <span className="font-semibold text-foreground">
                  {observationLabel(t, issue.code)}
                </span>
                {issue.line_number ? ` (${t('detail.line', { n: issue.line_number })})` : ''}:{' '}
                {issue.detail}
              </li>
            ))}
          </ul>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="lines" forceMount hidden={tab !== 'lines'}>
        <LinesTable doc={data} />
      </Tabs.Content>
      <Tabs.Content value="history" forceMount hidden={tab !== 'history'}>
        <CorrectionHistory doc={data} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
