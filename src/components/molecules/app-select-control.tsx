import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import Select, { type MultiValue, type SingleValue } from 'react-select'

import { useSelectMessages } from './use-select-messages'
import { cn } from '@/lib/cn'
import type { AppSelectOption, AppSelectProps } from './app-select.types'

const SEARCH_OPTION_THRESHOLD = 5
const MENU_PORTAL_Z_INDEX = 50

export default function AppSelectControl<T extends string>({
  inputRef,
  ...props
}: AppSelectProps<T>) {
  const messages = useSelectMessages<T>()
  const instanceId = useId()
  const { t } = useTranslation()
  const errorId = `${instanceId}-error`
  return (
    <div className="min-w-0">
      <Select<AppSelectOption<T>, boolean>
        ref={inputRef}
        {...messages}
        instanceId={instanceId}
        inputId={props.id}
        name={props.name}
        aria-label={props.label}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.error ? errorId : undefined}
        options={props.options}
        value={props.options.filter((option) =>
          props.multiple ? props.value.includes(option.value) : option.value === props.value,
        )}
        onChange={(next: MultiValue<AppSelectOption<T>> | SingleValue<AppSelectOption<T>>) => {
          if (props.multiple)
            props.onChange((next as MultiValue<AppSelectOption<T>>).map((option) => option.value))
          else if (next) props.onChange((next as AppSelectOption<T>).value)
        }}
        onBlur={props.onBlur}
        isMulti={props.multiple ?? false}
        isSearchable={props.searchable ?? props.options.length > SEARCH_OPTION_THRESHOLD}
        isDisabled={props.disabled}
        isClearable={props.multiple ?? false}
        placeholder={t('common.selectPlaceholder')}
        noOptionsMessage={() => t('common.noOptions')}
        menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
        menuPosition="fixed"
        unstyled
        styles={{ menuPortal: (base) => ({ ...base, zIndex: MENU_PORTAL_Z_INDEX }) }}
        classNames={{
          control: (state) =>
            cn(
              'min-h-control rounded-control border bg-background px-3 text-sm text-foreground',
              props.error ? 'border-destructive' : 'border-input',
              state.isFocused && 'select-focus',
              state.isDisabled && 'opacity-50',
            ),
          valueContainer: () => 'gap-1 py-1',
          placeholder: () => 'text-muted-foreground',
          input: () => 'text-foreground',
          dropdownIndicator: () => 'ml-2 text-muted-foreground',
          clearIndicator: () => 'px-1 text-muted-foreground',
          menu: () =>
            'mt-1 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md',
          menuList: () => 'p-1',
          option: (state) =>
            cn(
              'rounded-lg px-3 py-2 text-sm',
              state.isFocused && 'bg-accent text-accent-foreground',
              state.isSelected && 'bg-primary text-primary-foreground',
            ),
          multiValue: () => 'min-h-chip rounded-full bg-muted text-foreground',
          multiValueLabel: () => 'px-1 text-sm',
          multiValueRemove: () =>
            'rounded-r-md px-1 hover:bg-destructive hover:text-destructive-foreground',
          noOptionsMessage: () => 'p-3 text-sm text-muted-foreground',
        }}
      />
      {props.error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {props.error}
        </p>
      ) : null}
    </div>
  )
}
