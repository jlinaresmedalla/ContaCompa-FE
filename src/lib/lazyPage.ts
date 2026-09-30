import { lazy, type ComponentType, type ReactNode } from 'react'

import { withSuspense } from './withSuspense'

/** Import a page or heavy component only when React first renders it. */
export function lazyPage<Props extends object>(
  load: () => Promise<{ default: ComponentType<Props> }>,
  fallback: ReactNode,
) {
  return withSuspense(lazy(load), fallback)
}
