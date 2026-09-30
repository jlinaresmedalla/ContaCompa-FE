import { createElement } from 'react'
import { toast } from 'sonner'

export function notifySuccess(message: string, description?: string) {
  return toast.success(message, { description, duration: 5000, closeButton: false })
}

export function notifyError(message: string, description?: string) {
  return toast.error(
    createElement('span', { role: 'alert' }, message, description ? ` — ${description}` : null),
    { duration: Infinity, closeButton: true },
  )
}
