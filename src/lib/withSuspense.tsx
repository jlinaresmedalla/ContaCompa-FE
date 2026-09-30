import { Suspense, type ComponentType, type ReactNode } from 'react'

/** Keep the boundary around the content, leaving its surrounding layout visible. */
export function withSuspense<Props extends object>(
  Component: ComponentType<Props>,
  fallback: ReactNode,
) {
  return function SuspendedContent(props: Props) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    )
  }
}
