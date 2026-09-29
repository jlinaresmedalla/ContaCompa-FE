import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { apiKeyStore } from '@/lib/api-key'

import { sessionApi, sessionKeys } from './api'
import { clearSession, signInUrl } from './session'

/** The signed-in company and key expiry; only asks when a key is stored. */
export function useMe() {
  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: ({ signal }) => sessionApi.me(undefined, signal),
    enabled: apiKeyStore.get() !== null,
    staleTime: 60_000,
    retry: false,
  })
}

export function useSignOut(): () => void {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return () => {
    void clearSession(queryClient)
    void navigate(signInUrl(), { replace: true })
  }
}

/** Re-renders every minute so the time left stays current. */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(timer)
  }, [])
  return now
}

/** Follows the key across tabs: signed out elsewhere goes to sign-in, a new key reloads. */
export function useCrossTabSession(): void {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  useEffect(
    () =>
      apiKeyStore.subscribe(() => {
        if (apiKeyStore.get() === null) {
          void clearSession(queryClient)
          void navigate(signInUrl(pathname + search), { replace: true })
        } else {
          window.location.reload()
        }
      }),
    [queryClient, navigate, pathname, search],
  )
}
