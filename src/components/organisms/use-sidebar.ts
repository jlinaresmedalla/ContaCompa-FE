import { DESKTOP_WIDTH_PX } from '@/lib/breakpoints'
import { createContext, useContext, useEffect, useState } from 'react'

export const SIDEBAR_STORAGE_KEYS = { expanded: 'contacompa.sidebar.expanded' }

export function useSidebarState() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEYS.expanded) !== 'false'
    } catch {
      return true
    }
  })
  const [openMobile, setOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < DESKTOP_WIDTH_PX)
  useEffect(() => {
    if (!window.matchMedia) return
    const query = window.matchMedia(`(max-width: ${DESKTOP_WIDTH_PX - 1}px)`)
    const update = () => {
      setIsMobile(query.matches)
      setOpenMobile(false)
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  const toggleSidebar = () => {
    if (isMobile) setOpenMobile((value) => !value)
    else
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
  return { open, openMobile, setOpenMobile, isMobile, toggleSidebar }
}
export const SIDEBAR_CONTEXT = createContext<ReturnType<typeof useSidebarState> | null>(null)
export function useSidebar() {
  const sidebar = useContext(SIDEBAR_CONTEXT)
  if (!sidebar) throw new Error('Sidebar requires SidebarProvider')
  return sidebar
}
