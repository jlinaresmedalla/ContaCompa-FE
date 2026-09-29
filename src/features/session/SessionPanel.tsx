import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

import { useMe, useNow, useSignOut } from './hooks'
import { formatMinutes, minutesLeft } from './time'

/** Sidebar bottom: the company, the time left on its key (display only) and sign-out. */
export function SessionPanel() {
  const { t } = useTranslation()
  const me = useMe()
  const now = useNow()
  const signOut = useSignOut()
  const expiresAt = me.data ? new Date(me.data.expires_at).getTime() : Number.NaN
  const expired = expiresAt <= now
  return (
    <div className="flex flex-col gap-1.5">
      {me.data ? (
        <p className="truncate text-sm font-medium" title={me.data.company.legal_name}>
          {me.data.company.legal_name}
        </p>
      ) : null}
      {me.data && !Number.isNaN(expiresAt) ? (
        <p className="text-xs text-muted-foreground">
          {expired
            ? t('session.expired')
            : t('session.timeLeft', {
                time: formatMinutes(minutesLeft(me.data.expires_at, now)),
              })}
        </p>
      ) : null}
      <Button size="sm" variant="outline" onClick={signOut}>
        {t('session.signOut')}
      </Button>
    </div>
  )
}
