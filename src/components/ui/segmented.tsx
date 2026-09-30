import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
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
  return (
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
          className="h-auto rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
