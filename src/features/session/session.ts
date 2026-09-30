import type { QueryClient } from '@tanstack/react-query'
import type { DataRouter } from 'react-router'

import { PATHS } from '@/app/router/paths'
import { API_KEY_STORE } from '@/lib/api-key'
import { cancelCompanyRequests } from '@/lib/http'

export function signInUrl(next?: string): string {
  return next ? `${PATHS.signIn}?next=${encodeURIComponent(next)}` : PATHS.signIn
}

/** A return path is kept only when it stays inside the dashboard; otherwise the landing page. */
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return PATHS.purchaseDocs
  }
  try {
    const url = new URL(raw, window.location.origin)
    // Parsing normalizes tricks such as "/\t/host" or "/.//host" into "//host", which the
    // router would treat as another site; so judge the parsed path, not the raw text.
    const inside = /^\/(?![/\\])/.test(url.pathname)
    const signIn = url.pathname.toLowerCase().replace(/\/+$/, '') === PATHS.signIn
    if (url.origin !== window.location.origin || !inside || signIn) return PATHS.purchaseDocs
    return url.pathname + url.search + url.hash
  } catch {
    return PATHS.purchaseDocs
  }
}

/** Aborts outstanding requests and drops every cached query (all of them are company data). */
export async function forgetCompanyData(queryClient: QueryClient): Promise<void> {
  cancelCompanyRequests()
  await queryClient.cancelQueries()
  queryClient.removeQueries()
}

/** Forgets the key and everything cached for that company, mutations included. */
export async function clearSession(queryClient: QueryClient): Promise<void> {
  API_KEY_STORE.clear()
  await forgetCompanyData(queryClient)
  queryClient.getMutationCache().clear()
}

/** What any 401 does: clear the session and go to sign-in, remembering the current path. */
export function handleUnauthorized(
  queryClient: QueryClient,
  router: {
    state: Pick<DataRouter['state'], 'location'>
    navigate: (to: string, options: { replace: boolean }) => void | Promise<void>
  },
): void {
  const { pathname, search } = router.state.location
  void clearSession(queryClient)
  if (pathname !== PATHS.signIn) {
    void router.navigate(signInUrl(pathname + search), { replace: true })
  }
}
