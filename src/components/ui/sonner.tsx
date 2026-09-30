import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import type { Theme } from '@/lib/theme'

function readTheme(): Theme {
  const theme = document.documentElement.dataset.theme
  return theme === 'light' || theme === 'dark' ? theme : 'system'
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { t } = useTranslation()
  const theme = useSyncExternalStore(subscribeTheme, readTheme)
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      visibleToasts={3}
      closeButton={false}
      containerAriaLabel={t('notifications.region')}
      toastOptions={{
        closeButtonAriaLabel: t('notifications.close'),
        classNames: { toast: 'material rounded-2xl text-foreground' },
      }}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--material)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius-2xl)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
