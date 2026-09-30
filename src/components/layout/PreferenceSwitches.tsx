import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LANGUAGES, setLanguage, type Language } from '@/app/i18n'
import { Segmented } from '@/components/ui/segmented'
import { applyTheme, storedTheme, THEMES, type Theme } from '@/lib/theme'

export function PreferenceSwitches() {
  return (
    <>
      <LanguageSwitch />
      <ThemeSwitch />
    </>
  )
}

function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  return (
    <Segmented<Language>
      label={t('sidebar.language')}
      value={i18n.language === 'en' ? 'en' : 'es'}
      options={LANGUAGES.map((language) => ({ value: language, label: t(`sidebar.${language}`) }))}
      onChange={setLanguage}
    />
  )
}

function ThemeSwitch() {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<Theme>(storedTheme)
  return (
    <Segmented<Theme>
      label={t('sidebar.theme')}
      value={theme}
      options={THEMES.map((value) => ({ value, label: t(`sidebar.${value}`) }))}
      onChange={(next) => {
        applyTheme(next)
        setTheme(next)
      }}
    />
  )
}
