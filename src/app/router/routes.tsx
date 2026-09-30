import { Navigate, type RouteObject } from 'react-router'

import { visibleModules } from '@/app/modules'
import { paths } from '@/app/router/paths'
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DesignPage } from '@/features/design'
import { CostsPage } from '@/features/costs'
import { DocumentDetailPage, DocumentsPage } from '@/features/documents'
import { HomePage } from '@/features/home'
import { JobsPage } from '@/features/jobs'
import { PrivateRoute, SignInPage } from '@/features/session'
import { apiKeyStore } from '@/lib/api-key'

function UnknownPath() {
  return <Navigate to={apiKeyStore.get() ? paths.purchaseDocs : paths.home} replace />
}

export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      { path: paths.design, element: <DesignPage /> },
    ],
  },
  { path: '*', element: <UnknownPath /> },
  { path: paths.signIn, element: <SignInPage /> },
  {
    // Dashboard routes need a key that /v1/me accepted.
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // A bare module prefix opens the module's first page.
          ...visibleModules.map((module) => ({
            path: module.prefix,
            element: <Navigate to={module.pages[0]?.to ?? paths.purchaseDocs} replace />,
          })),
          { path: paths.purchaseDocs, element: <DocumentsPage /> },
          { path: `${paths.purchaseDocs}/:id`, element: <DocumentDetailPage /> },
          { path: paths.jobs, element: <JobsPage /> },
          { path: paths.costs, element: <CostsPage /> },
        ],
      },
    ],
  },
]
