import { Navigate, type RouteObject } from 'react-router'

import { visibleModules } from '@/app/modules'
import { paths } from '@/app/router/paths'
import { AppLayout } from '@/components/layout/AppLayout'
import { CostsPage } from '@/features/costs'
import { DocumentDetailPage, DocumentsPage } from '@/features/documents'
import { JobsPage } from '@/features/jobs'
import { PrivateRoute, SignInPage } from '@/features/session'

const landing = <Navigate to={paths.purchaseDocs} replace />

export const routes: RouteObject[] = [
  { path: paths.signIn, element: <SignInPage /> },
  {
    // Every other route needs a key that /v1/me accepted.
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: landing },
          // A bare module prefix opens the module's first page.
          ...visibleModules.map((module) => ({
            path: module.prefix,
            element: <Navigate to={module.pages[0]?.to ?? paths.purchaseDocs} replace />,
          })),
          { path: paths.purchaseDocs, element: <DocumentsPage /> },
          { path: `${paths.purchaseDocs}/:id`, element: <DocumentDetailPage /> },
          { path: paths.jobs, element: <JobsPage /> },
          { path: paths.costs, element: <CostsPage /> },
          { path: '*', element: landing },
        ],
      },
    ],
  },
]
