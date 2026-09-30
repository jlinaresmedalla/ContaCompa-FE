import { useTranslation } from 'react-i18next'

import { LANGUAGES, setLanguage } from '@/app/i18n'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { THEMES, type Theme } from '@/lib/theme'
import { useThemeSwitch } from './use-theme-switch'

export function PreferenceSwitches() {
  return (
    <>
      <LanguageSwitch />
      <ThemeSwitch />
    </>
  )
}

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  return (
    <TooltipProvider>
      <div role="group" aria-label={t('sidebar.language')} className="flex shrink-0 gap-1">
        {LANGUAGES.map((language) => (
          <Tooltip key={language}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                aria-label={t(`sidebar.${language}`)}
                aria-pressed={i18n.language === language}
                className="px-2 aria-pressed:bg-muted"
                onClick={() => {
                  void setLanguage(language)
                }}
              >
                {language.toUpperCase()}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t(`sidebar.${language}`)}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

function ThemeSwitch() {
  const { t } = useTranslation()
  const { theme, setTheme } = useThemeSwitch()
  return (
    <ToggleGroup
      type="single"
      role="radiogroup"
      aria-label={t('sidebar.theme')}
      value={theme}
      spacing={1}
      onValueChange={(value) => {
        if (value) setTheme(value as Theme)
      }}
      className="shrink-0 rounded-full bg-muted p-0.5"
    >
      {THEMES.map((value) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className="h-auto rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-sm"
        >
          {t(`sidebar.${value}`)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
