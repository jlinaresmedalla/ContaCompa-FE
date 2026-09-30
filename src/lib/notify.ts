import { createElement } from 'react'
import { toast } from 'sonner'

const SUCCESS_DURATION_MS = 5000

export function notifySuccess(message: string, description?: string) {
  return toast.success(message, { description, duration: SUCCESS_DURATION_MS, closeButton: false })
}

export function notifyError(message: string, description?: string) {
  return toast.error(
    createElement('span', { role: 'alert' }, message, description ? ` — ${description}` : null),
    { duration: Infinity, closeButton: true },
  )
}
