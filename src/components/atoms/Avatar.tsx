import { Avatar as Primitive } from 'radix-ui'

export function Avatar({ initials, dense = false }: { initials: string; dense?: boolean }) {
  return (
    <Primitive.Root
      data-dense={dense}
      className="inline-flex size-avatar data-[dense=true]:size-avatar-dense shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
    >
      <Primitive.Fallback>{initials}</Primitive.Fallback>
    </Primitive.Root>
  )
}
