import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/atoms'
import type AppSelectControl from './app-select-control'
import type { AppSelectProps } from './app-select.types'

const LAZY_SELECT = lazy(() => import('./app-select-control')) as typeof AppSelectControl

export function AppSelect<T extends string>(props: AppSelectProps<T>) {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <Skeleton
          className="h-control w-full rounded-control"
          role="status"
          aria-label={t('common.loading')}
        />
      }
    >
      <LAZY_SELECT {...props} />
    </Suspense>
  )
}
