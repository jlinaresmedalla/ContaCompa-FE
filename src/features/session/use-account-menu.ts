import { useTranslation } from 'react-i18next'
import { useMe, useNow, useSignOut } from './hooks'
import { formatMinutes, minutesLeft } from './time'
const INITIALS_COUNT = 2
export function useAccountMenu() {
  const { t } = useTranslation()
  const me = useMe()
  const now = useNow()
  const signOut = useSignOut()
  const company = me.data?.company.legal_name ?? t('sidebar.account')
  const initials = company
    .trim()
    .split(/\s+/)
    .slice(0, INITIALS_COUNT)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
  const expiry = me.data?.expires_at
  const timeLeft =
    expiry && Number.isFinite(new Date(expiry).getTime())
      ? new Date(expiry).getTime() <= now
        ? t('session.expired')
        : t('session.timeLeft', { time: formatMinutes(minutesLeft(expiry, now)) })
      : null
  return { company, initials, timeLeft, signOut }
}
