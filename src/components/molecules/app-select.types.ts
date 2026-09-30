import type { Ref } from 'react'
import type { SelectInstance } from 'react-select'

export type AppSelectOption<T extends string> = { value: T; label: string }
type SharedProps<T extends string> = {
  label: string
  options: AppSelectOption<T>[]
  searchable?: boolean
  disabled?: boolean
  error?: string
  id?: string
  name?: string
  onBlur?: () => void
  inputRef?: Ref<SelectInstance<AppSelectOption<T>, boolean>>
}
export type AppSelectProps<T extends string> = SharedProps<T> &
  (
    | { multiple?: false; value: T | null; onChange: (value: T) => void }
    | { multiple: true; value: readonly T[]; onChange: (value: T[]) => void }
  )
