import { useState } from 'react'
import { applyTheme, storedTheme, type Theme } from '@/lib/theme'

export function useThemeSwitch() {
  const [theme, updateTheme] = useState<Theme>(storedTheme)
  const setTheme = (next: Theme) => {
    applyTheme(next)
    updateTheme(next)
  }
  return { theme, setTheme }
}
