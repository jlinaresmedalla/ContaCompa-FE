import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { API_KEY_STORE } from '@/lib/apiKey'

import { clearSession, signInUrl } from '../../utils/session'

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
