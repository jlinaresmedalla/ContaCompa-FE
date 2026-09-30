import { AppSelect } from '../AppSelect'
import { useSegmentedWidth } from './useSegmentedWidth'
import { ToggleGroup, ToggleGroupItem } from '@/components/atoms'
type SegmentedProps<T extends string> = {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  const { containerRef, compact } = useSegmentedWidth()
  return (
    <div ref={containerRef} className="min-w-0 w-full">
      {compact ? (
        <AppSelect label={label} value={value} options={options} onChange={onChange} />
      ) : (
        <ToggleGroup
          type="single"
          role="radiogroup"
          aria-label={label}
          value={value}
          spacing={1}
          onValueChange={(next) => {
            if (next) onChange(next as T)
          }}
          className="rounded-full bg-muted p-0.5"
        >
          {options.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="h-control-compact rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground data-[state=on]:bg-card data-[state=on]:text-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
    </div>
  )
}
