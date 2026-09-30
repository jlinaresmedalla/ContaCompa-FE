import { Button } from '@/components/atoms'
import { useScrollRowFade } from './use-scroll-row-fade'

interface FilterPillsProps<T extends string> {
  label: string
  options: readonly { value: T; label: string; disabled?: boolean }[]
  value: T
  onChange: (value: T) => void
}

export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterPillsProps<T>) {
  const { ref, fade } = useScrollRowFade(options)
  return (
    <div
      ref={ref}
      data-fade={fade}
      role="group"
      aria-label={label}
      className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto scroll-row"
    >
      {options.map((option) => (
        <Button
          key={option.value}
          variant={option.value === value ? 'primary' : 'outline'}
          aria-pressed={option.value === value}
          disabled={option.disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
