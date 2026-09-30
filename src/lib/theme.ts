/** Light / dark / system. The choice is a data-theme attribute on <html>; index.html applies the
 * stored value before first paint, so there is no flash. No React Context. */
export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = (typeof THEMES)[number]

const STORAGE_KEYS = { theme: 'doc-extraction.theme' }

export function storedTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.theme)
    return THEMES.find((theme) => theme === value) ?? 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'system') delete root.dataset.theme
  else root.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  } catch {
    /* private mode: the choice lasts until reload */
  }
}
