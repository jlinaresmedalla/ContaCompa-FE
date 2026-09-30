import { useRoutes } from 'react-router'

import { ROUTES } from '@/app/router/routes'

export function AppRoutes() {
  return useRoutes(ROUTES)
}
