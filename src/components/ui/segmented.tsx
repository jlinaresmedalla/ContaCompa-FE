import { cn } from '@/lib/cn'

type SegmentedProps<T extends string> = {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

/** A small radio group drawn as joined buttons (tabs, language, theme). */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-0.5 rounded-lg bg-muted p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            value === option.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
