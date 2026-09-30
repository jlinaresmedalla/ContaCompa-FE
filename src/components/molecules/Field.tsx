import type * as React from 'react'
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
      {error ? <span className="mt-1 block text-destructive">{error}</span> : null}
    </label>
  )
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
    >
      {message}
    </div>
  )
}
