import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router'
import { PATHS } from '@/app/router/paths'
import { Logo, LogoMark } from '@/components/brand'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AccountMenu } from './AccountMenu'
import { SIDEBAR_ITEM, SidebarModules } from './SidebarModules'
import { useShellNavigation } from './use-shell-navigation'

export function AppLayout() {
  return (
    <SidebarProvider>
      <ShellContent />
    </SidebarProvider>
  )
}
function ShellContent() {
  const { t } = useTranslation()
  const { collapsed, close } = useShellNavigation()
  return (
    <>
      <Sidebar collapsible="icon">
        <Link
          to={PATHS.home}
          onClick={close}
          aria-label={t('pageStates.home')}
          className={SIDEBAR_ITEM}
        >
          {collapsed ? <LogoMark className="size-8 shrink-0 text-primary" /> : <Logo />}
        </Link>
        <SidebarModules collapsed={collapsed} close={close} />
        <div className="mt-auto">
          <AccountMenu collapsed={collapsed} />
        </div>
      </Sidebar>
      <div className="min-w-0 flex-1">
        <header className="p-2">
          <SidebarTrigger />
        </header>
        <main className="mx-auto min-w-0 max-w-7xl px-4 pb-6 [overflow-wrap:anywhere]">
          <Outlet />
        </main>
      </div>
    </>
  )
}
