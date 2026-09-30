import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/card'

export function HowItWorks() {
  const { t } = useTranslation()
  return (
    <section aria-labelledby="how-it-works">
      <p className="text-sm font-medium text-muted-foreground">{t('home.howItWorks')}</p>
      <h2 id="how-it-works" className="mt-2 text-4xl font-semibold tracking-tight">
        {t('home.stepsTitle')}
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['upload', 'extract', 'review', 'export'] as const).map((step, index) => (
          <li key={step} className="min-w-0">
            <Card className="h-full space-y-3">
              <span aria-hidden="true" className="text-3xl font-semibold text-primary">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold">{t(`home.steps.${step}.title`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`home.steps.${step}.description`)}</p>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}
