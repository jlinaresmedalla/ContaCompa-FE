import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  back?: ReactNode
}) {
  return (
    <header className="space-y-3">
      {back}
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1 basis-64">
          <h1 className="text-[length:var(--type-large-title)] font-semibold tracking-[var(--tracking-title)] break-words">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 break-words text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex min-w-0 max-w-full basis-full flex-wrap gap-2 sm:basis-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  )
}
