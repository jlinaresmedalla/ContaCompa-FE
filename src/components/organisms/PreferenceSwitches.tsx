import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LANGUAGES, setLanguage } from '@/app/i18n'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms'

import { PreferenceMenus } from './PublicPhonePreferences'

export function PreferenceSwitches() {
  return <PreferenceMenus />
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
