import { useSyncExternalStore } from 'react'
import { TABLET_WIDTH_PX } from './breakpoints'

const PHONE_QUERY = `(width < ${TABLET_WIDTH_PX}px)`

function subscribe(onChange: () => void) {
  if (!window.matchMedia) return () => {}
  const query = window.matchMedia(PHONE_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia
    ? window.matchMedia(PHONE_QUERY).matches
    : window.innerWidth < TABLET_WIDTH_PX
}

export function usePhoneWidth() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
