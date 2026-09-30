import { DESKTOP_WIDTH_PX, RAIL_WIDTH_PX } from '@/lib/breakpoints'
import { createContext, useContext, useEffect, useState } from 'react'

export const SIDEBAR_STORAGE_KEYS = { expanded: 'contacompa.sidebar.expanded' }

export function useSidebarState() {
  const [savedOpen, setOpen] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEYS.expanded) !== 'false'
    } catch {
      return true
    }
  })
  const [openMobile, setOpenMobile] = useState(false)
  const [width, setWidth] = useState(() => window.innerWidth)
  const isMobile = width < DESKTOP_WIDTH_PX
  const forcedRail = !isMobile && width < RAIL_WIDTH_PX
  const open = !forcedRail && savedOpen
  useEffect(() => {
    const update = () => {
      setWidth(window.innerWidth)
      setOpenMobile(false)
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const toggleSidebar = () => {
    if (isMobile) setOpenMobile((value) => !value)
    else if (!forcedRail)
      setOpen((value) => {
        const next = !value
        try {
          localStorage.setItem(SIDEBAR_STORAGE_KEYS.expanded, String(next))
        } catch {
          /* Storage unavailable. */
        }
        return next
      })
  }
  return { open, openMobile, setOpenMobile, isMobile, forcedRail, toggleSidebar }
}
export const SIDEBAR_CONTEXT = createContext<ReturnType<typeof useSidebarState> | null>(null)
export function useSidebar() {
  const sidebar = useContext(SIDEBAR_CONTEXT)
  if (!sidebar) throw new Error('Sidebar requires SidebarProvider')
  return sidebar
}
