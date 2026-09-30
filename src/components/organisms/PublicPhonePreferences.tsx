import { Globe, Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, setLanguage } from '@/app/i18n'
import { IconButton } from '@/components/molecules'
import { THEMES } from '@/lib/theme'
import { useThemeSwitch } from './use-theme-switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './dropdown-menu'

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor }

export function PublicPhonePreferences() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeSwitch()
  return (
    <div className="flex gap-1 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={Globe}
            label={`${t('sidebar.language')}: ${t(`sidebar.${i18n.language === 'es' ? 'es' : 'en'}`)}`}
            className="size-[3.25rem] rounded-control"
          />
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
          <IconButton
            icon={THEME_ICONS[theme]}
            label={`${t('sidebar.theme')}: ${t(`sidebar.${theme}`)}`}
            className="size-[3.25rem] rounded-control"
          />
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
