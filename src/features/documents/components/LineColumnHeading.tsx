import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms'

export function LineColumnHeading({ label, fullName }: { label: string; fullName: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={fullName}
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent>{fullName}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
