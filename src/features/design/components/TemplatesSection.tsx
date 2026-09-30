import { Route, Routes } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppLayout, PublicLayout, PublicHeader } from '@/components/templates'
import { Card } from '@/components/atoms'
import { DesignSection } from './DesignSection'

export function TemplatesSection() {
  const { t } = useTranslation()
  const sample = <Card>{t('design.sample')}</Card>
  const account = { company: t('design.sample'), initials: 'CC', timeLeft: null, signOut: () => {} }
  return (
    <div className="space-y-10">
      <DesignSection name="PublicHeader">
        <PublicHeader />
      </DesignSection>
      <DesignSection name="PublicLayout">
        <Routes>
          <Route path="*" element={<PublicLayout />}>
            <Route path="*" element={sample} />
          </Route>
        </Routes>
      </DesignSection>
      <DesignSection name="AppLayout">
        <Routes>
          <Route path="*" element={<AppLayout account={account} />}>
            <Route path="*" element={sample} />
          </Route>
        </Routes>
      </DesignSection>
    </div>
  )
}
