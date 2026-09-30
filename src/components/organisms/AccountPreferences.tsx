import { useTranslation } from 'react-i18next'
import { ToggleGroup, ToggleGroupItem } from '@/components/atoms'
import { THEMES, type Theme } from '@/lib/theme'
import { LanguageSwitch } from './PreferenceSwitches'
import { useThemeSwitch } from './use-theme-switch'

export function AccountPreferences() {
  const { t } = useTranslation()
  const { theme, setTheme } = useThemeSwitch()
  return (
    <>
      <LanguageSwitch />
      <ToggleGroup
        type="single"
        role="radiogroup"
        aria-label={t('sidebar.theme')}
        value={theme}
        onValueChange={(value) => {
          if (value) setTheme(value as Theme)
        }}
        className="flex-wrap rounded-lg bg-muted p-1"
      >
        {THEMES.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="h-auto rounded-lg px-2 py-1 text-xs data-[state=on]:bg-card"
          >
            {t(`sidebar.${value}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  )
}
