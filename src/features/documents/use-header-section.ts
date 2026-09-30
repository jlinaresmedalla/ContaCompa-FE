import { useState } from 'react'

import { HEADER_SECTIONS, type HeaderField, type HeaderSection } from './header-sections'
import { useCorrectDoc } from './hooks'
import { CORRECTION_SCHEMA, type CorrectionForm, type ValidationKey } from './schemas/correction'
import type { PurchaseDocDetail } from './types'
import { toForm, toPayload } from './utils'

type Draft = { before: CorrectionForm; values: CorrectionForm }
type Errors = Partial<Record<HeaderField, ValidationKey>>

export function useHeaderSection(doc: PurchaseDocDetail, section: HeaderSection) {
  const correct = useCorrectDoc(doc.id)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [saved, setSaved] = useState<{ source: PurchaseDocDetail; values: CorrectionForm } | null>(
    null,
  )
  const savedValues = saved?.source === doc ? saved.values : toForm(doc)
  const values = draft?.values ?? savedValues

  const edit = () => {
    setDraft({ before: savedValues, values: savedValues })
    setErrors({})
  }
  const change = (name: HeaderField, value: string) => {
    setDraft((current) => current && { ...current, values: { ...current.values, [name]: value } })
  }
  const cancel = () => {
    setDraft(null)
    setErrors({})
  }
  const save = async () => {
    if (!draft || correct.isPending) return
    const next = { ...draft.before }
    const nextErrors: Errors = {}
    for (const name of HEADER_SECTIONS[section]) {
      const result = CORRECTION_SCHEMA.shape[name].safeParse(draft.values[name])
      if (result.success) Object.assign(next, { [name]: result.data })
      else nextErrors[name] = result.error.issues[0]!.message as ValidationKey
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const payload = toPayload(draft.before, next)
    if (!Object.keys(payload.fields).length) {
      cancel()
      return
    }
    try {
      const updated = await correct.mutateAsync(payload)
      setSaved({ source: doc, values: toForm(updated) })
      cancel()
    } catch {
      // useCorrectDoc shows the error toast; preserve this section's draft.
    }
  }

  return {
    values,
    errors,
    editing: draft !== null,
    pending: correct.isPending,
    edit,
    change,
    cancel,
    save,
  }
}
