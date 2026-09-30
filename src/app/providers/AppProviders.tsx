import { RouterProvider } from 'react-router/dom'

import { ROUTER } from '@/app/router/router'

export function AppProviders() {
  return <RouterProvider router={ROUTER} />
}
