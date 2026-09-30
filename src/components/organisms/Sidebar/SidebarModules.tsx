import { Activity, FileText, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router'
import { VISIBLE_MODULES, type AppModule } from '@/app/modules'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms'
import { cn } from '@/lib/cn'
import { useRailMenu } from './useRailMenu'

export const SIDEBAR_ITEM =
  'flex w-full min-h-navigation max-md:min-h-control items-center gap-3 rounded-navigation px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

const PAGE_ICONS = { 'nav.purchaseDocs': FileText, 'nav.jobs': Upload, 'nav.costs': Activity }

export function SidebarPages({ module, close }: { module: AppModule; close: () => void }) {
  const { t } = useTranslation()
  return module.pages.map((page) => {
    const Icon = PAGE_ICONS[page.labelKey as keyof typeof PAGE_ICONS]
    return (
      <NavLink
        key={page.to}
        to={page.to}
        onClick={close}
        className={({ isActive }) =>
          cn(
            SIDEBAR_ITEM,
            isActive
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted',
          )
        }
      >
        {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
        {t(page.labelKey)}
      </NavLink>
    )
  })
}
export function SidebarModules({ collapsed, close }: { collapsed: boolean; close: () => void }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  return (
    <TooltipProvider>
      <nav
        aria-label={t('nav.main')}
        className={cn('flex flex-col gap-4', collapsed ? 'px-1' : 'px-3')}
      >
        {VISIBLE_MODULES.map((module) => {
          const label = t(module.labelKey)
          const active = pathname.startsWith(`${module.prefix}/`)
          const itemClass = cn(
            SIDEBAR_ITEM,
            collapsed && 'justify-center px-0',
            active
              ? 'bg-muted font-medium text-foreground'
              : 'text-muted-foreground hover:bg-muted',
          )
          if (collapsed)
            return (
              <RailModule
                key={module.id}
                module={module}
                label={label}
                active={active}
                itemClass={itemClass}
                close={close}
              />
            )

          return (
            <div key={module.id}>
              <div className="px-3 py-1 text-sm font-medium text-foreground">{label}</div>
              <div className="mt-1">
                <SidebarPages module={module} close={close} />
              </div>
            </div>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}
function SidebarPageMenu({ module, close }: { module: AppModule; close: () => void }) {
  const { t } = useTranslation()
  return module.pages.map((page) => {
    const Icon = PAGE_ICONS[page.labelKey as keyof typeof PAGE_ICONS]
    return (
      <DropdownMenuItem key={page.to} asChild>
        <NavLink
          to={page.to}
          onClick={close}
          className="aria-[current=page]:bg-muted aria-[current=page]:font-semibold"
        >
          {Icon && <Icon className="mr-2 size-4" aria-hidden="true" />}
          {t(page.labelKey)}
        </NavLink>
      </DropdownMenuItem>
    )
  })
}

function RailModule({
  module,
  label,
  active,
  itemClass,
  close,
}: {
  module: AppModule
  label: string
  active: boolean
  itemClass: string
  close: () => void
}) {
  const { menuOpen, tooltipOpen, setTooltipOpen, onMenuChange } = useRailMenu()
  return (
    <Tooltip open={tooltipOpen && !menuOpen} onOpenChange={setTooltipOpen}>
      {module.pages.length > 1 ? (
        <DropdownMenu open={menuOpen} onOpenChange={onMenuChange}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger aria-label={label} className={itemClass}>
              {module.icon}
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent side="right">
            <SidebarPageMenu module={module} close={close} />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <TooltipTrigger asChild>
          <Link
            to={module.pages[0]?.to ?? module.prefix}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={itemClass}
          >
            {module.icon}
          </Link>
        </TooltipTrigger>
      )}
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
