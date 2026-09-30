import { SidebarModules } from '@/components/organisms'
import { DesignSection } from './DesignSection'

export function SidebarSection() {
  return (
    <DesignSection name="Sidebar">
      <div className="flex flex-wrap gap-6">
        <div className="w-sidebar max-w-full">
          <SidebarModules collapsed={false} close={() => {}} />
        </div>
        <div className="w-sidebar-rail">
          <SidebarModules collapsed close={() => {}} />
        </div>
      </div>
    </DesignSection>
  )
}
