import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center text-muted-foreground">
      <Icon aria-hidden="true" className="size-8" />
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="max-w-md text-sm">{description}</p>
      {action}
    </div>
  )
}
