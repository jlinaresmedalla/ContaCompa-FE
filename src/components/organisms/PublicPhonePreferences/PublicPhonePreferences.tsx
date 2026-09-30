import { Globe, Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, setLanguage } from '@/app/i18n'
import { Button } from '@/components/atoms'
import { THEMES } from '@/lib/theme'
import { useThemeSwitch } from './useThemeSwitch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../DropdownMenu'

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor }

export function PreferenceMenus() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeSwitch()
  const ThemeIcon = THEME_ICONS[theme]
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${t('sidebar.language')}: ${t(`sidebar.${i18n.language === 'es' ? 'es' : 'en'}`)}`}
            className="max-md:size-[3.25rem] rounded-control"
          >
            <Globe className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={i18n.language}
            onValueChange={(value) => {
              const language = LANGUAGES.find((candidate) => candidate === value)
              if (language) void setLanguage(language)
            }}
          >
            {LANGUAGES.map((language) => (
              <DropdownMenuRadioItem key={language} value={language}>
                {language.toUpperCase()} — {t(`sidebar.${language}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`${t('sidebar.theme')}: ${t(`sidebar.${theme}`)}`}
            className="max-md:size-[3.25rem] rounded-control"
          >
            <ThemeIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => {
              const next = THEMES.find((candidate) => candidate === value)
              if (next) setTheme(next)
            }}
          >
            {THEMES.map((value) => {
              const Icon = THEME_ICONS[value]
              return (
                <DropdownMenuRadioItem key={value} value={value}>
                  <Icon className="mr-2 size-4" aria-hidden="true" />
                  {t(`sidebar.${value}`)}
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const PublicPhonePreferences = PreferenceMenus
