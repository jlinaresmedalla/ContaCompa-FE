import { useTranslation } from 'react-i18next'
import { Avatar } from '@/components/ui/avatar'
import { SidebarModules } from '@/components/layout/SidebarModules'

export function SidebarSection() {
  const { t } = useTranslation()
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('design.sections.Sidebar')}</h2>
      <div className="flex flex-wrap gap-6 rounded-2xl border border-border bg-card p-4">
        <div className="w-60 max-w-full">
          <SidebarModules collapsed={false} close={() => {}} />
        </div>
        <div className="w-14">
          <SidebarModules collapsed close={() => {}} />
        </div>
      </div>
      <h2 className="text-xl font-semibold">{t('design.sections.Avatar')}</h2>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <Avatar initials="CC" />
        <Avatar initials="C" />
      </div>
    </section>
  )
}
