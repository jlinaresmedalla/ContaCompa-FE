import { useTranslation } from 'react-i18next'
import { DesignSection } from './DesignSection'
import { Plus } from 'lucide-react'
import { LogoMark, Backdrop, Badge, Button, Card, Skeleton } from '@/components/atoms'
import { AtomExtras } from './AtomExtras'

export function AtomsSection() {
  const { t } = useTranslation()
  return (
    <div className="space-y-10">
      <DesignSection name="Backdrop">
        <div className="relative isolate rounded-2xl p-8">
          <Backdrop />
          <Card className="material mx-auto max-w-sm">
            <p className="font-semibold">{t('design.sample')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('design.description')}</p>
          </Card>
        </div>
      </DesignSection>
      <DesignSection name="Button">
        <div className="space-y-4">
          {(['primary', 'outline', 'ghost', 'danger', 'success'] as const).map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              {(['sm', 'md', 'icon'] as const).map((size) => (
                <Button
                  key={size}
                  variant={variant}
                  size={size}
                  aria-label={
                    size === 'icon' ? `${t(`design.${variant}`)} · ${t('design.icon')}` : undefined
                  }
                >
                  {size === 'icon' ? (
                    <Plus aria-hidden="true" className="size-4" />
                  ) : (
                    `${t(`design.${variant}`)} · ${t(`design.${size}`)}`
                  )}
                </Button>
              ))}
              <Button variant={variant} disabled>
                {t('design.disabled')}
              </Button>
            </div>
          ))}
        </div>
      </DesignSection>
      <DesignSection name="Badge">
        <div className="flex flex-wrap gap-3">
          {(['neutral', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
            <Badge key={tone} tone={tone}>
              {t(`design.${tone}`)}
            </Badge>
          ))}
        </div>
      </DesignSection>
      <DesignSection name="Card">
        <Card>
          <p className="font-semibold">{t('design.sample')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('design.description')}</p>
        </Card>
      </DesignSection>
      <DesignSection name="Skeleton">
        <div className="space-y-3" role="status" aria-label={t('design.loading')}>
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </DesignSection>
      <AtomExtras />
      <DesignSection name="Brand">
        <LogoMark className="size-icon-tile text-primary" />
      </DesignSection>
    </div>
  )
}
