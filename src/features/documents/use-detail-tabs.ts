import { TABLET_WIDTH_PX } from '@/lib/breakpoints'
import { useEffect, useState } from 'react'

export const DETAIL_TABS = ['observations', 'lines', 'history'] as const
export type DetailTab = (typeof DETAIL_TABS)[number]

export function usePhoneWidth() {
  const [phone, setPhone] = useState(() => window.innerWidth < TABLET_WIDTH_PX)
  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${TABLET_WIDTH_PX - 1}px)`)
    const update = () => setPhone(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return phone
}

export function useDetailTabs() {
  const [tab, setTab] = useState<DetailTab>('observations')
  const phone = usePhoneWidth()
  return { tab, setTab, phone }
}
