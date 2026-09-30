import { Clock, Globe, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { LANGUAGES, setLanguage } from '@/app/i18n'
import { THEMES } from '@/lib/theme'
import { useThemeSwitch } from './use-theme-switch'
import { SIDEBAR_ITEM } from './SidebarModules'

const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor }
const MODE_ITEM =
  'h-control min-w-control justify-center rounded-full px-3 data-[state=checked]:bg-card'
const MODE_GROUP = 'flex rounded-full bg-muted p-1'

export type AccountMenuData = {
  company: string
  initials: string
  timeLeft: string | null
  signOut: () => void
}

export function AccountMenu({
  collapsed,
  company,
  initials,
  timeLeft,
  signOut,
}: AccountMenuData & { collapsed: boolean }) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeSwitch()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('sidebar.account')}
        title={t('sidebar.account')}
        className={
          collapsed
            ? 'flex min-h-control min-w-control items-center justify-center rounded-navigation focus-visible:ring-2 focus-visible:ring-ring'
            : SIDEBAR_ITEM
        }
      >
        <Avatar initials={initials} />
        {!collapsed && <span className="truncate">{company}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-account-menu rounded-card p-0">
        <div className="flex items-center gap-3 border-b border-border px-card py-shell-phone">
          <Avatar initials={initials} />
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold">{company}</p>
            {timeLeft && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3 shrink-0" aria-hidden="true" />
                {timeLeft}
              </p>
            )}
          </div>
        </div>
        <TooltipProvider>
          <div className="space-y-4 border-b border-border px-card py-shell-phone">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm">
                <Globe className="size-4" aria-hidden="true" />
                {t('sidebar.language')}
              </span>
              <DropdownMenuRadioGroup
                className={MODE_GROUP}
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
                    className={MODE_ITEM}
                  >
                    {language.toUpperCase()}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm">
                <Sun className="size-4" aria-hidden="true" />
                {t('sidebar.theme')}
              </span>
              <DropdownMenuRadioGroup
                className={MODE_GROUP}
                aria-label={t('sidebar.theme')}
                value={theme}
                onValueChange={(value) => {
                  const next = THEMES.find((candidate) => candidate === value)
                  if (next) setTheme(next)
                }}
              >
                {THEMES.map((value) => {
                  const Icon = THEME_ICONS[value]
                  const label = t(`sidebar.${value}`)
                  return (
                    <Tooltip key={value}>
                      <TooltipTrigger asChild>
                        <DropdownMenuRadioItem
                          value={value}
                          aria-label={label}
                          title={label}
                          className={MODE_ITEM}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </DropdownMenuRadioItem>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  )
                })}
              </DropdownMenuRadioGroup>
            </div>
          </div>
        </TooltipProvider>
        <div className="p-2">
          <DropdownMenuItem
            onSelect={signOut}
            className="min-h-navigation max-md:min-h-control gap-3 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t('session.signOut')}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
