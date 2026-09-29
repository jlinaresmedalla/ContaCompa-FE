import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-lg border border-border bg-card px-3 text-sm',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  )
}

export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-danger">{error}</span> : null}
    </label>
  )
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
    >
      {message}
    </div>
  )
}
