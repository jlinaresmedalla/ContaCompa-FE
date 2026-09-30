import { BrowserRouter } from 'react-router'

import { AppRoutes } from '@/app/router/router'

export function AppProviders() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
