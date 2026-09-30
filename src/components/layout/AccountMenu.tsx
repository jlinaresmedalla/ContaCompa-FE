import { useTranslation } from 'react-i18next'
import { Avatar } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANGUAGES, setLanguage } from '@/app/i18n'
import { THEMES } from '@/lib/theme'
import { useThemeSwitch } from './use-theme-switch'
import { useAccountMenu } from './use-account-menu'
import { SIDEBAR_ITEM } from './SidebarModules'

export function AccountMenu({ collapsed }: { collapsed: boolean }) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeSwitch()
  const { company, initials, timeLeft, signOut } = useAccountMenu()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t('sidebar.account')} className={SIDEBAR_ITEM}>
        <Avatar initials={initials} />
        {!collapsed && <span className="truncate">{company}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-64">
        <p className="break-words px-3 py-2 text-sm font-semibold">{company}</p>
        {timeLeft && <p className="px-3 text-xs text-muted-foreground">{timeLeft}</p>}
        <div className="my-3 space-y-2 border-y border-border py-3">
          <DropdownMenuRadioGroup
            aria-label={t('sidebar.language')}
            value={i18n.language}
            onValueChange={(value) => {
              const language = LANGUAGES.find((candidate) => candidate === value)
              if (language) void setLanguage(language)
            }}
          >
            {LANGUAGES.map((language) => (
              <DropdownMenuRadioItem
                key={language}
                value={language}
                aria-label={t(`sidebar.${language}`)}
                title={t(`sidebar.${language}`)}
              >
                {language.toUpperCase()}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuRadioGroup
            aria-label={t('sidebar.theme')}
            value={theme}
            onValueChange={(value) => {
              const next = THEMES.find((candidate) => candidate === value)
              if (next) setTheme(next)
            }}
          >
            {THEMES.map((value) => (
              <DropdownMenuRadioItem key={value} value={value}>
                {t(`sidebar.${value}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>
        <DropdownMenuItem onSelect={signOut}>{t('session.signOut')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
