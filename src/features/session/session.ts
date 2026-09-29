import type { QueryClient } from '@tanstack/react-query'
import type { DataRouter } from 'react-router'

import { paths } from '@/app/router/paths'
import { apiKeyStore } from '@/lib/api-key'
import { cancelCompanyRequests } from '@/lib/http'

export function signInUrl(next?: string): string {
  return next ? `${paths.signIn}?next=${encodeURIComponent(next)}` : paths.signIn
}

/** A return path is kept only when it stays inside the dashboard; otherwise the landing page. */
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return paths.purchaseDocs
  }
  try {
    const url = new URL(raw, window.location.origin)
    // Parsing normalizes tricks such as "/\t/host" or "/.//host" into "//host", which the
    // router would treat as another site; so judge the parsed path, not the raw text.
    const inside = /^\/(?![/\\])/.test(url.pathname)
    const signIn = url.pathname.toLowerCase().replace(/\/+$/, '') === paths.signIn
    if (url.origin !== window.location.origin || !inside || signIn) return paths.purchaseDocs
    return url.pathname + url.search + url.hash
  } catch {
    return paths.purchaseDocs
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
  apiKeyStore.clear()
  await forgetCompanyData(queryClient)
  queryClient.getMutationCache().clear()
}

/** What any 401 does: clear the session and go to sign-in, remembering the current path. */
export function handleUnauthorized(
  queryClient: QueryClient,
  router: Pick<DataRouter, 'state' | 'navigate'>,
): void {
  const { pathname, search } = router.state.location
  void clearSession(queryClient)
  if (pathname !== paths.signIn) {
    void router.navigate(signInUrl(pathname + search), { replace: true })
  }
}
