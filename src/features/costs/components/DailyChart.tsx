import { useTranslation } from 'react-i18next'

import { formatCost } from '@/lib/money-format'
import { number } from '@/lib/format'
import type { CostReport } from '../types'

const PERCENT_SCALE = 100
const MIN_BAR_HEIGHT_REM = '0.25rem'

/** Purchase docs per day as bars; the tooltip carries tokens and list cost. */
export function DailyChart({ days }: { days: CostReport['by_day'] }) {
  const { t } = useTranslation()
  const max = Math.max(1, ...days.map((day) => day.docs))
  return (
    <div className="flex gap-2">
      <div
        aria-hidden="true"
        className="flex h-40 flex-col justify-between text-xs text-muted-foreground lg:h-[11.375rem]"
      >
        <span>{number(max)}</span>
        <span>0</span>
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="flex h-40 items-end gap-1 border-b border-border lg:h-[11.375rem] lg:gap-1.5"
          role="img"
          aria-label={t('costs.chartLabel')}
        >
          {days.map((day) => (
            <div
              key={day.day}
              title={t('costs.daySummary', {
                date: day.day,
                docs: t('common.purchaseDocs', { count: day.docs }),
                tokens: day.input_tokens + day.output_tokens,
                cost: formatCost(day.list_usd),
              })}
              className="flex-1 rounded-t bg-primary hover:opacity-80"
              style={{
                height: `${(day.docs / max) * PERCENT_SCALE}%`,
                minHeight: day.docs ? MIN_BAR_HEIGHT_REM : 0,
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{days[0]?.day}</span>
          <span>{days[days.length - 1]?.day}</span>
        </div>
      </div>
    </div>
  )
}
