import { Clock, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '@/components/atoms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu'
import { PreferenceMenus } from '../PublicPhonePreferences'
import { SIDEBAR_ITEM } from '../Sidebar/SidebarModules'

export type AccountMenuData = {
  company: string
  initials: string
  timeLeft: string | null
  signOut: () => void
}

export function AccountMenu({
  collapsed,
  company,
  initials,
  timeLeft,
  signOut,
}: AccountMenuData & { collapsed: boolean }) {
  const { t } = useTranslation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('sidebar.account')}
        title={company}
        className={
          collapsed
            ? 'flex h-control w-control items-center justify-center rounded-navigation focus-visible:ring-2 focus-visible:ring-ring'
            : SIDEBAR_ITEM
        }
      >
        <Avatar initials={initials} />
        {!collapsed && <span className="truncate">{company}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        className="w-account-menu rounded-card border-border p-0"
      >
        <div className="flex items-center gap-3 border-b border-border px-card py-shell-phone">
          <Avatar initials={initials} />
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold">{company}</p>
            {timeLeft && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3 shrink-0" aria-hidden="true" />
                {timeLeft}
              </p>
            )}
          </div>
        </div>
        <div className="border-b border-border px-card py-shell-phone">
          <PreferenceMenus />
        </div>
        <div className="p-2">
          <DropdownMenuItem
            onSelect={signOut}
            className="min-h-navigation max-md:min-h-control gap-3 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t('session.signOut')}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
