import Select from 'react-select'

export type SelectOption<T extends string> = { value: T; label: string }

type AppSelectProps<T extends string> = {
  inputId: string
  options: SelectOption<T>[]
  value: T | null
  onChange: (value: T | null) => void
  onBlur?: () => void
  invalid?: boolean
}

/** The project's one select control (react-select), styled with the semantic tokens. */
export function AppSelect<T extends string>({
  inputId,
  options,
  value,
  onChange,
  onBlur,
  invalid,
}: AppSelectProps<T>) {
  return (
    <Select<SelectOption<T>, false>
      inputId={inputId}
      options={options}
      value={options.find((option) => option.value === value) ?? null}
      onChange={(option) => onChange(option?.value ?? null)}
      onBlur={onBlur}
      unstyled
      classNames={{
        control: (state) =>
          `min-h-9 rounded-lg border bg-card px-2 text-sm ${
            invalid
              ? 'border-danger'
              : state.isFocused
                ? 'border-ring ring-2 ring-ring'
                : 'border-border'
          }`,
        menu: () => 'mt-1 rounded-lg border border-border bg-card text-sm shadow-lg',
        option: (state) =>
          `px-3 py-2 ${state.isFocused ? 'bg-muted' : ''} ${state.isSelected ? 'font-semibold' : ''}`,
        placeholder: () => 'text-muted-foreground',
        indicatorsContainer: () => 'text-muted-foreground',
      }}
    />
  )
}
