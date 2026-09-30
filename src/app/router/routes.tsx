import { Navigate, type RouteObject } from 'react-router'

import { VISIBLE_MODULES } from '@/app/modules'
import { PATHS } from '@/app/router/paths'
import { PublicLayout } from '@/components/templates'
import { PageSkeleton } from '@/components/molecules/PageSkeleton'
import { lazyPage } from '@/lib/lazyPage'
import { API_KEY_STORE } from '@/lib/api-key'

const SessionLayout = lazyPage<object>(
  async () => {
    const module = await import('@/features/session/SessionLayout')
    return { default: module.SessionLayout }
  },
  <PageSkeleton />,
)
const PrivateLayout = lazyPage<object>(
  async () => {
    const module = await import('@/features/session/PrivateLayout')
    return { default: module.PrivateLayout }
  },
  <PageSkeleton />,
)
const PrivateRoute = lazyPage<object>(
  async () => {
    const module = await import('@/features/session/PrivateRoute')
    return { default: module.PrivateRoute }
  },
  <PageSkeleton />,
)
const HomePage = lazyPage(
  async () => {
    const module = await import('@/features/home/HomePage')
    return { default: module.HomePage }
  },
  <PageSkeleton />,
)
const DesignPage = lazyPage(
  async () => {
    const module = await import('@/features/design/DesignPage')
    return { default: module.DesignPage }
  },
  <PageSkeleton />,
)
const SignInPage = lazyPage(
  async () => {
    const module = await import('@/features/session/SignInPage')
    return { default: module.SignInPage }
  },
  <PageSkeleton />,
)
const DocumentsPage = lazyPage(
  async () => {
    const module = await import('@/features/documents/DocumentsPage')
    return { default: module.DocumentsPage }
  },
  <PageSkeleton />,
)
const DocumentDetailPage = lazyPage(
  async () => {
    const module = await import('@/features/documents/DocumentDetailPage')
    return { default: module.DocumentDetailPage }
  },
  <PageSkeleton />,
)
const JobsPage = lazyPage(
  async () => {
    const module = await import('@/features/jobs/JobsPage')
    return { default: module.JobsPage }
  },
  <PageSkeleton />,
)
const CostsPage = lazyPage(
  async () => {
    const module = await import('@/features/costs/CostsPage')
    return { default: module.CostsPage }
  },
  <PageSkeleton />,
)

function UnknownPath() {
  return <Navigate to={API_KEY_STORE.get() ? PATHS.purchaseDocs : PATHS.home} replace />
}

export const ROUTES: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: PATHS.home, element: <HomePage /> },
      { path: PATHS.design, element: <DesignPage /> },
    ],
  },
  { path: '*', element: <UnknownPath /> },
  {
    element: <SessionLayout />,
    children: [
      { path: PATHS.signIn, element: <SignInPage /> },
      {
        // Dashboard routes need a key that /v1/me accepted.
        element: <PrivateRoute />,
        children: [
          {
            element: <PrivateLayout />,
            children: [
              // A bare module prefix opens the module's first page.
              ...VISIBLE_MODULES.map((module) => ({
                path: module.prefix,
                element: <Navigate to={module.pages[0]?.to ?? PATHS.purchaseDocs} replace />,
              })),
              { path: PATHS.purchaseDocs, element: <DocumentsPage /> },
              { path: `${PATHS.purchaseDocs}/:id`, element: <DocumentDetailPage /> },
              { path: PATHS.jobs, element: <JobsPage /> },
              { path: PATHS.costs, element: <CostsPage /> },
            ],
          },
        ],
      },
    ],
  },
]
