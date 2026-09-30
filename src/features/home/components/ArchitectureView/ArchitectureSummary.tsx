import { ArrowDown, ArrowRight, Database, Monitor, Server, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const NODES = [
  { name: 'interface', icon: Monitor },
  { name: 'service', icon: Server },
  { name: 'queue', icon: Database },
  { name: 'extraction', icon: Sparkles },
] as const

export function ArchitectureSummary() {
  const { t } = useTranslation()
  return (
    <ol className="flex flex-col items-stretch gap-2.5 lg:flex-row lg:items-center lg:gap-[1.125rem]">
      {NODES.map(({ name, icon: Icon }, index) => (
        <li
          key={name}
          className="flex min-w-0 flex-1 flex-col items-center gap-2.5 lg:flex-row lg:gap-[1.125rem]"
        >
          {index > 0 && (
            <>
              <ArrowDown
                className="size-4 shrink-0 text-muted-foreground lg:hidden"
                aria-hidden="true"
              />
              <ArrowRight
                className="hidden size-4 shrink-0 text-muted-foreground lg:block"
                aria-hidden="true"
              />
            </>
          )}
          <div
            className={`flex w-full min-w-0 items-center gap-3.5 rounded-card border p-card lg:flex-col lg:text-center ${name === 'extraction' ? 'border-primary/20 bg-primary/10' : 'border-border bg-card'}`}
          >
            <span className="flex size-icon-tile shrink-0 items-center justify-center rounded-control border border-border text-muted-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold">{t(`home.overview.${name}.title`)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`home.overview.${name}.description`)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
