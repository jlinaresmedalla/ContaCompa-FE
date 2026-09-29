import { useTranslation } from 'react-i18next'

import type { CostReport } from '../types'

/** Purchase docs per day as bars; the tooltip carries tokens and list cost. */
export function DailyChart({ days }: { days: CostReport['by_day'] }) {
  const { t } = useTranslation()
  const max = Math.max(1, ...days.map((day) => day.docs))
  return (
    <div>
      <div className="flex h-40 items-end gap-1" role="img" aria-label={t('costs.chartLabel')}>
        {days.map((day) => (
          <div
            key={day.day}
            title={`${day.day}: ${day.docs} · ${day.input_tokens + day.output_tokens} tokens · $${Number(day.list_usd).toFixed(4)}`}
            className="flex-1 rounded-t bg-primary hover:opacity-80"
            style={{ height: `${(day.docs / max) * 100}%`, minHeight: day.docs ? 4 : 1 }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{days[0]?.day}</span>
        <span>{days[days.length - 1]?.day}</span>
      </div>
    </div>
  )
}
