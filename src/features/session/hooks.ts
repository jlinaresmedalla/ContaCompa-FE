import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { API_KEY_STORE } from '@/lib/api-key'

import { SESSION_API, SESSION_KEYS } from './api'
import { clearSession, signInUrl } from './session'

const SESSION_REFRESH_MS = 60_000

/** The signed-in company and key expiry; only asks when a key is stored. */
export function useMe() {
  return useQuery({
    queryKey: SESSION_KEYS.me,
    queryFn: ({ signal }) => SESSION_API.me(undefined, signal),
    enabled: API_KEY_STORE.get() !== null,
    staleTime: SESSION_REFRESH_MS,
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
    const timer = setInterval(() => setNow(Date.now()), SESSION_REFRESH_MS)
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
      API_KEY_STORE.subscribe(() => {
        if (API_KEY_STORE.get() === null) {
          void clearSession(queryClient)
          void navigate(signInUrl(pathname + search), { replace: true })
        } else {
          window.location.reload()
        }
      }),
    [queryClient, navigate, pathname, search],
  )
}
