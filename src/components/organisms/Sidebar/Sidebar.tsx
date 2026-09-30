import type { ReactNode } from 'react'
import { Dialog } from 'radix-ui'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/molecules'
import { SIDEBAR_CONTEXT, useSidebar, useSidebarState } from './useSidebar'
import { cn } from '@/lib/cn'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const state = useSidebarState()
  return (
    <SIDEBAR_CONTEXT.Provider value={state}>
      <Dialog.Root open={state.openMobile} onOpenChange={state.setOpenMobile}>
        <div className="flex min-h-screen w-full">{children}</div>
      </Dialog.Root>
    </SIDEBAR_CONTEXT.Provider>
  )
}
export function SidebarTrigger() {
  const { isMobile, open, forcedRail, toggleSidebar } = useSidebar()
  const { t } = useTranslation()
  if (isMobile)
    return (
      <Dialog.Trigger asChild>
        <IconButton
          variant="ghost"
          icon={Menu}
          label={t('nav.open')}
          className="min-h-control min-w-control"
        />
      </Dialog.Trigger>
    )
  return (
    <IconButton
      icon={open ? PanelLeftClose : PanelLeftOpen}
      label={t(open ? 'nav.collapse' : 'nav.expand')}
      variant="ghost"
      disabled={forcedRail}
      onClick={toggleSidebar}
    />
  )
}
export function Sidebar({ children, collapsible }: { children: ReactNode; collapsible: 'icon' }) {
  const { isMobile, open } = useSidebar()
  const { t } = useTranslation()
  const contentClass = 'flex flex-col gap-4 overflow-y-auto border-r border-border material'
  if (isMobile)
    return (
      <Dialog.Portal>
        <Dialog.Overlay
          data-testid="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-foreground/40"
        />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            contentClass,
            'fixed inset-y-0 left-0 z-50 w-sidebar max-w-full duration-200 data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left motion-reduce:animate-none',
          )}
        >
          <Dialog.Title className="sr-only">{t('nav.main')}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    )
  return (
    <aside
      data-collapsible={collapsible}
      data-state={open ? 'expanded' : 'collapsed'}
      className={cn(
        'sticky top-0 h-screen shrink-0',
        open ? 'w-sidebar' : 'w-sidebar-rail',
        contentClass,
      )}
    >
      {children}
    </aside>
  )
}
