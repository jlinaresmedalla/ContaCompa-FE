import { Tabs } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { AppSelect } from '@/components/ui/app-select'
import { Card, CardTitle } from '@/components/ui/card'
import { dateTime } from '@/lib/format'
import type { PurchaseDocDetail } from '../types'
import { observationLabel } from '../observations'
import { DETAIL_TABS, useDetailTabs, type DetailTab } from '../use-detail-tabs'
import { IssueBadges } from './IssueBadges'
import { LinesTable } from './LinesTable'

export function DetailTabs({ doc: data }: { doc: PurchaseDocDetail }) {
  const { t, i18n } = useTranslation()
  const { tab, setTab, phone } = useDetailTabs()
  const locale = i18n.language
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => setTab(value as DetailTab)}
      className="min-w-0 space-y-3"
    >
      {phone ? (
        <AppSelect
          label={t('detail.view')}
          options={DETAIL_TABS.map((value) => ({ value, label: t(`detail.${value}`) }))}
          value={tab}
          onChange={setTab}
        />
      ) : (
        <Tabs.List aria-label={t('detail.view')} className="flex gap-1 rounded-xl bg-muted p-1">
          {DETAIL_TABS.map((value) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-foreground"
            >
              {t(`detail.${value}`)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      )}
      <Tabs.Content value="observations" forceMount hidden={tab !== 'observations'}>
        {' '}
        <Card>
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
        <Card>
          <CardTitle>{t('detail.lines')}</CardTitle>
          <LinesTable doc={data} />
        </Card>
      </Tabs.Content>
      <Tabs.Content value="history" forceMount hidden={tab !== 'history'}>
        {' '}
        <Card>
          <CardTitle hint={t('detail.historyCount', { count: data.corrections.length })}>
            {t('detail.history')}
          </CardTitle>
          {data.corrections.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('detail.noCorrections')}</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {data.corrections.map((correction, index) => (
                <li key={index} className="flex flex-wrap gap-2">
                  <span className="text-muted-foreground">
                    {dateTime(correction.corrected_at, locale)}
                  </span>
                  <span className="font-medium">{correction.field}</span>
                  <span className="text-muted-foreground line-through">
                    {correction.old_value ?? '∅'}
                  </span>
                  <span>→ {correction.new_value ?? '∅'}</span>
                  <span className="text-muted-foreground">· {correction.corrected_by}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Tabs.Content>
    </Tabs.Root>
  )
}
