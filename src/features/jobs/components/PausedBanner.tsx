import { useTranslation } from 'react-i18next'

import type { ProviderBreaker } from '../types'

function localTime(iso: string | null): string | null {
  const date = iso ? new Date(iso) : null
  if (!date || Number.isNaN(date.getTime())) return null
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
}

/** Shown while the provider circuit breaker is open or half-open (spec 003, FR-006). */
export function PausedBanner({ provider }: { provider: ProviderBreaker | null | undefined }) {
  const { t } = useTranslation()
  if (!provider || provider.state === 'closed') return null
  const time = localTime(provider.open_until)
  const next = time ? t('jobs.pausedNext', { time }) : ''
  return (
    <div
      role="status"
      className="rounded-lg border border-warning/40 bg-warning/20 px-4 py-3 text-sm text-warning"
    >
      {t('jobs.paused', { next })}
    </div>
  )
}
