import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation } from 'react-router'
import { VISIBLE_MODULES, type AppModule } from '@/app/modules'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'

export const SIDEBAR_ITEM =
  'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function SidebarPages({ module, close }: { module: AppModule; close: () => void }) {
  const { t } = useTranslation()
  return module.pages.map((page) => (
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
      {t(page.labelKey)}
    </NavLink>
  ))
}
export function SidebarModules({ collapsed, close }: { collapsed: boolean; close: () => void }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  return (
    <TooltipProvider>
      <nav aria-label={t('nav.main')} className="flex flex-col gap-2">
        {VISIBLE_MODULES.map((module) => {
          const label = t(module.labelKey)
          const active = pathname.startsWith(`${module.prefix}/`)
          const itemClass = cn(
            SIDEBAR_ITEM,
            active
              ? 'bg-primary font-medium text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted',
          )
          if (collapsed)
            return (
              <Tooltip key={module.id}>
                {module.pages.length > 1 ? (
                  <DropdownMenu>
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
          return (
            <div key={module.id}>
              <Link
                to={module.pages[0]?.to ?? module.prefix}
                onClick={close}
                aria-current={active ? 'page' : undefined}
                className={itemClass}
              >
                {module.icon}
                <span>{label}</span>
              </Link>
              <div className="ml-5 mt-1 border-l border-border pl-2">
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
  return module.pages.map((page) => (
    <DropdownMenuItem key={page.to} asChild>
      <NavLink
        to={page.to}
        onClick={close}
        className="aria-[current=page]:bg-muted aria-[current=page]:font-semibold"
      >
        {t(page.labelKey)}
      </NavLink>
    </DropdownMenuItem>
  ))
}
