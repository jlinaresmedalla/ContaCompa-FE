import { Globe, Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LANGUAGES, setLanguage } from '@/app/i18n'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/atoms'

import { THEMES, type Theme } from '@/lib/theme'
import { useThemeSwitch } from './use-theme-switch'

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor }

export function PreferenceSwitches() {
  return (
    <>
      <LanguageSwitch />
      <TooltipProvider>
        <ThemeSwitch />
      </TooltipProvider>
    </>
  )
}

export function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  return (
    <TooltipProvider>
      <div
        role="group"
        aria-label={t('sidebar.language')}
        className="flex h-[2.625rem] shrink-0 items-center gap-0.5 rounded-full bg-muted p-1"
      >
        <Globe className="mx-1 size-4 text-muted-foreground" aria-hidden="true" />
        {LANGUAGES.map((language) => (
          <Tooltip key={language}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                aria-label={t(`sidebar.${language}`)}
                aria-pressed={i18n.language === language}
                className="h-8 px-3 aria-pressed:bg-card"
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
      className="h-[2.625rem] shrink-0 rounded-full bg-muted p-1"
    >
      {THEMES.map((value) => {
        const Icon = THEME_ICONS[value]
        return (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={value}
                aria-label={t(`sidebar.${value}`)}
                className="size-8 rounded-full p-0 text-muted-foreground hover:text-foreground data-[state=on]:bg-card data-[state=on]:text-foreground"
              >
                <Icon className="size-4" aria-hidden="true" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{t(`sidebar.${value}`)}</TooltipContent>
          </Tooltip>
        )
      })}
    </ToggleGroup>
  )
}
