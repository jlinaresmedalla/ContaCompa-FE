import { Outlet } from 'react-router'
import { Logo } from '@/components/molecules'
import { LogoMark } from '@/components/atoms'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/organisms'
import { AccountMenu, SidebarModules, type AccountMenuData } from '@/components/organisms'
import { useShellNavigation } from './useShellNavigation'

export function AppLayout({ account }: { account: AccountMenuData }) {
  return (
    <SidebarProvider>
      <ShellContent account={account} />
    </SidebarProvider>
  )
}
function ShellContent({ account }: { account: AccountMenuData }) {
  const { isMobile, collapsed, close } = useShellNavigation()
  return (
    <>
      <Sidebar collapsible="icon">
        <div
          className={
            collapsed
              ? 'flex shrink-0 flex-col items-center gap-4 pt-4'
              : 'flex h-shell-header shrink-0 items-center justify-between gap-1 px-3'
          }
        >
          <div className="flex min-w-0 items-center">
            {collapsed ? <LogoMark className="size-4 shrink-0 text-primary" /> : <Logo />}
          </div>
          {!isMobile && <SidebarTrigger />}
        </div>
        <SidebarModules collapsed={collapsed} close={close} />
        <div
          className={
            collapsed
              ? 'mt-auto flex justify-center border-t border-border px-1 py-4'
              : 'mt-auto border-t border-border p-3'
          }
        >
          <AccountMenu collapsed={collapsed} {...account} />
        </div>
      </Sidebar>
      <div className="min-w-0 flex-1">
        {isMobile && (
          <header className="flex h-shell-mobile-header items-center justify-between gap-2 border-b border-border material px-shell-phone">
            <SidebarTrigger />
            <div className="flex h-control items-center">
              <Logo />
            </div>
            <AccountMenu collapsed {...account} />
          </header>
        )}
        <main className="mx-auto w-full min-w-0 max-w-shell-content px-shell-fluid pt-shell-top pb-shell-sides">
          <Outlet />
        </main>
      </div>
    </>
  )
}
