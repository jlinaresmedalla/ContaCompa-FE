import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Messages } from '@/app/i18n/en'

export function DesignSection({
  name,
  children,
  framed = true,
}: {
  name: keyof Messages['design']['sections']
  children: ReactNode
  framed?: boolean
}) {
  const { t } = useTranslation()
  return (
    <section className="min-w-0 space-y-4">
      <h3 className="text-lg font-semibold">{t(`design.sections.${name}`)}</h3>
      <div
        className={framed ? 'min-w-0 rounded-card border border-border bg-card p-card' : 'min-w-0'}
      >
        {children}
      </div>
    </section>
  )
}
