import type { ReactNode } from 'react'

export function PhoneDetailHeader({
  title,
  description,
  back,
  actions,
}: {
  title: ReactNode
  description?: ReactNode
  back?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="flex items-start gap-2.5">
      <div className="shrink-0">{back}</div>
      <div className="min-w-0 flex-1">
        <h1 className="break-words text-2xl font-semibold">{title}</h1>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </header>
  )
}
