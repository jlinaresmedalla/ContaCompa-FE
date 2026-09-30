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
    <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-0.5">
      <div className="shrink-0">{back}</div>
      <div className="min-w-0 flex-1">
        <h1 className="break-words text-2xl font-semibold">{title}</h1>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : <div />}
      <p className="col-start-2 col-span-2 text-sm text-muted-foreground">{description}</p>
    </header>
  )
}
