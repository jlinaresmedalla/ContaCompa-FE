import { useState } from 'react'

export function useRailMenu() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tooltipOpen, updateTooltip] = useState(false)
  const [suppressTooltip, setSuppressTooltip] = useState(false)
  const onMenuChange = (open: boolean) => {
    setMenuOpen(open)
    updateTooltip(false)
    setSuppressTooltip(true)
  }
  const setTooltipOpen = (open: boolean) => {
    if (!open) setSuppressTooltip(false)
    updateTooltip(open && !suppressTooltip)
  }
  return { menuOpen, tooltipOpen, setTooltipOpen, onMenuChange }
}
