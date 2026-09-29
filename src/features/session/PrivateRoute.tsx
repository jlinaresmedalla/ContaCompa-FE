import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { ErrorNote } from '@/components/ui/input'
import { apiKeyStore } from '@/lib/api-key'
import { toApiError } from '@/lib/http'

import { useCrossTabSession, useMe, useSignOut } from './hooks'
import { signInUrl } from './session'

/** Wraps every page except sign-in: it renders only after `/v1/me` accepts the stored key. */
export function PrivateRoute() {
  const { t } = useTranslation()
  const location = useLocation()
  const me = useMe()
  const signOut = useSignOut()
  useCrossTabSession()
  const toSignIn = <Navigate to={signInUrl(location.pathname + location.search)} replace />
  if (apiKeyStore.get() === null) return toSignIn
  if (me.isPending) {
    return (
      <p role="status" className="p-6 text-sm text-muted-foreground">
        {t('common.loading')}
      </p>
    )
  }
  // A failed background refetch keeps the page; only a missing first answer blocks it.
  if (me.isError && !me.data) {
    const error = toApiError(me.error)
    if (error.status === 401) return toSignIn
    return (
      <div className="mx-auto mt-16 max-w-md space-y-3 p-4">
        <ErrorNote message={error.message} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void me.refetch()}>
            {t('common.retry')}
          </Button>
          <Button variant="outline" onClick={signOut}>
            {t('session.signOut')}
          </Button>
        </div>
      </div>
    )
  }
  return <Outlet />
}
