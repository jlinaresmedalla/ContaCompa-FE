import { useQuery } from '@tanstack/react-query'

import { API_KEY_STORE } from '@/lib/apiKey'

import { SESSION_API, SESSION_KEYS } from '../api/sessionApi'

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
