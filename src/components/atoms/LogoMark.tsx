import { useId } from 'react'

import { cn } from '@/lib/cn'

interface LogoMarkProps {
  className?: string
  title?: string
}

export function LogoMark({ className, title }: LogoMarkProps) {
  const titleId = useId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={cn('size-8 shrink-0', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-labelledby={title ? titleId : undefined}
      focusable="false"
    >
      {title && <title id={titleId}>{title}</title>}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7 3h18a2 2 0 0 1 2 2v23l-3-2-3 2-3-2-3 2-3-2-3 2-3-2V5a2 2 0 0 1 2-2z M23.2 15a7.2 7.2 0 1 0-14.4 0 7.2 7.2 0 1 0 14.4 0z M21.2 15a5.2 5.2 0 1 0-10.4 0 5.2 5.2 0 1 0 10.4 0z M12.2 15.2l1.4-1.4 1.6 1.6 3.1-3.3 1.5 1.4-4.6 4.8z"
      />
    </svg>
  )
}
