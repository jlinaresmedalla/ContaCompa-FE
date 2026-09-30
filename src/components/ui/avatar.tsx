import { Avatar as Primitive } from 'radix-ui'

export function Avatar({ initials }: { initials: string }) {
  return (
    <Primitive.Root className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
      <Primitive.Fallback>{initials}</Primitive.Fallback>
    </Primitive.Root>
  )
}
