import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { Logo } from '@/components/molecules'
import { LogoMark } from '@/components/atoms'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/organisms'
import { AccountMenu, SidebarModules, type AccountMenuData } from '@/components/organisms'
import { useShellNavigation } from './use-shell-navigation'

export function AppLayout({ account }: { account: AccountMenuData }) {
  return (
    <SidebarProvider>
      <ShellContent account={account} />
    </SidebarProvider>
  )
}
function ShellContent({ account }: { account: AccountMenuData }) {
  const { t } = useTranslation()
  const { isMobile, collapsed, close } = useShellNavigation()
  return (
    <>
      <Sidebar collapsible="icon">
        <div
          className={
            collapsed
              ? 'flex h-shell-header shrink-0 flex-col items-center justify-center'
              : 'flex h-shell-header shrink-0 items-center justify-between gap-1 px-3'
          }
        >
          <Link
            to={PATHS.home}
            onClick={close}
            aria-label={t('pageStates.home')}
            className="flex min-w-0 max-md:min-h-control items-center rounded-navigation outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsed ? <LogoMark className="size-8 shrink-0 text-primary" /> : <Logo />}
          </Link>
          {!isMobile && <SidebarTrigger />}
        </div>
        <SidebarModules collapsed={collapsed} close={close} />
        <div
          className={
            collapsed ? 'mt-auto border-t border-border p-1' : 'mt-auto border-t border-border p-3'
          }
        >
          <AccountMenu collapsed={collapsed} {...account} />
        </div>
      </Sidebar>
      <div className="min-w-0 flex-1">
        {isMobile && (
          <header className="flex h-shell-mobile-header items-center justify-between gap-2 border-b border-border material px-shell-phone">
            <SidebarTrigger />
            <Link
              to={PATHS.home}
              aria-label={t('pageStates.home')}
              className="flex h-control items-center rounded-navigation focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Logo />
            </Link>
            <AccountMenu collapsed {...account} />
          </header>
        )}
        <main className="min-w-0 max-w-shell-content px-shell-phone pt-shell-top pb-shell-sides md:px-shell-sides [overflow-wrap:anywhere]">
          <Outlet />
        </main>
      </div>
    </>
  )
}
