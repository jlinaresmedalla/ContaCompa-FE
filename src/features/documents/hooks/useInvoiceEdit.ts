import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router'
import { API_KEY_STORE } from '@/lib/apiKey'
import { INVOICE_FIELDS, type HeaderField } from '../utils/invoiceFields'
import { useCorrectDoc } from './useCorrectDoc'
import { CORRECTION_SCHEMA, type CorrectionForm, type ValidationKey } from '../schemas/correction'
import type { PurchaseDocDetail } from '../types/purchaseDocs'
import { toForm, toPayload } from '../utils/corrections'

type Draft = { before: CorrectionForm; values: CorrectionForm }

export function useInvoiceEdit(doc: PurchaseDocDetail | undefined) {
  const correct = useCorrectDoc(doc?.id ?? '')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saved, setSaved] = useState<{ source: PurchaseDocDetail; values: CorrectionForm } | null>(
    null,
  )
  const base = doc ? (saved?.source === doc ? saved.values : toForm(doc)) : null
  const values = draft?.values ?? base
  const changed = INVOICE_FIELDS.filter(
    (name) => draft && draft.values[name] !== draft.before[name],
  )
  const errors: Partial<Record<HeaderField, ValidationKey>> = {}
  const parsed = draft ? { ...draft.before } : null
  if (draft && parsed) {
    // Only edited fields are validated: an invalid extracted value left untouched
    // must not block correcting another field, since it is never sent.
    for (const name of INVOICE_FIELDS) {
      const result = CORRECTION_SCHEMA.shape[name].safeParse(draft.values[name])
      if (result.success) {
        if (changed.includes(name)) Object.assign(parsed, { [name]: result.data })
      } else if (changed.includes(name)) {
        errors[name] = result.error.issues[0]!.message as ValidationKey
      }
    }
  }
  const dirty = changed.length > 0
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && API_KEY_STORE.get() !== null && currentLocation.pathname !== nextLocation.pathname,
  )
  useEffect(() => {
    if (!dirty) return
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!API_KEY_STORE.get()) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])
  const cancel = () => setDraft(null)
  const change = (name: HeaderField, value: string) => {
    setDraft((current) => current && { ...current, values: { ...current.values, [name]: value } })
  }
  const save = async () => {
    if (!draft || !parsed || !doc || correct.isPending) return
    // An untouched record may contain invalid extracted values; empty saves still send nothing.
    if (!dirty) {
      cancel()
      return
    }
    if (Object.keys(errors).length) return
    const payload = toPayload(draft.before, parsed)
    if (!Object.keys(payload.fields).length) {
      cancel()
      return
    }
    try {
      const updated = await correct.mutateAsync(payload)
      setSaved({ source: doc, values: toForm(updated) })
      cancel()
    } catch {
      // The mutation owns the error toast; retain every draft value for retry.
    }
  }
  return {
    values,
    errors,
    changed,
    blocker,
    editing: draft !== null,
    pending: correct.isPending,
    errorCount: Object.keys(errors).length,
    edit: () => {
      if (base) setDraft({ before: base, values: base })
    },
    change,
    cancel,
    save,
    undo: (name: HeaderField) => {
      if (draft) change(name, draft.before[name])
    },
  }
}
export type InvoiceEdit = ReturnType<typeof useInvoiceEdit>
