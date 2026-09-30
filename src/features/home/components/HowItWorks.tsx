import { Download, ShieldCheck, Sparkles, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const STEPS = [
  { name: 'upload', icon: Upload },
  { name: 'extract', icon: Sparkles },
  { name: 'review', icon: ShieldCheck },
  { name: 'export', icon: Download },
] as const

export function HowItWorks() {
  const { t } = useTranslation()
  return (
    <section aria-labelledby="how-it-works">
      <p className="text-sm font-medium text-primary">{t('home.howItWorks')}</p>
      <h2
        id="how-it-works"
        className="mt-1 text-2xl leading-8 font-semibold tracking-tight md:text-[1.75rem] md:leading-9"
      >
        {t('home.stepsTitle')}
      </h2>
      <ol className="mt-[1.125rem] md:mt-[1.375rem] md:grid md:grid-cols-2 md:gap-[1.375rem] lg:grid-cols-4">
        {STEPS.map(({ name, icon: Icon }, index) => (
          <li
            key={name}
            className="flex min-w-0 items-start gap-[1.125rem] border-b border-border px-[1.375rem] py-[1.125rem] last:border-b-0 md:flex-col md:rounded-card md:border md:bg-card md:p-card md:last:border-b"
          >
            <span className="flex size-[2.875rem] shrink-0 items-center justify-center rounded-control border border-primary/20 bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold">
                <span className="md:hidden">{index + 1}. </span>
                {t(`home.steps.${name}.title`)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`home.steps.${name}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
