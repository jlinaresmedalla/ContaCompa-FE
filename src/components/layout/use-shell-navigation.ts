import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useSidebar } from '@/components/ui/use-sidebar'
export function useShellNavigation() {
  const { key } = useLocation()
  const sidebar = useSidebar()
  const { setOpenMobile } = sidebar
  useEffect(() => {
    setOpenMobile(false)
  }, [key, setOpenMobile])
  return { collapsed: !sidebar.isMobile && !sidebar.open, close: () => setOpenMobile(false) }
}
