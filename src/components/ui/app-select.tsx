import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from './skeleton'
import type AppSelectControl from './app-select-control'
import type { AppSelectProps } from './app-select.types'

const LazySelect = lazy(() => import('./app-select-control')) as typeof AppSelectControl

export function AppSelect<T extends string>(props: AppSelectProps<T>) {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <Skeleton
          className="h-9 w-full rounded-xl"
          role="status"
          aria-label={t('common.loading')}
        />
      }
    >
      <LazySelect {...props} />
    </Suspense>
  )
}
