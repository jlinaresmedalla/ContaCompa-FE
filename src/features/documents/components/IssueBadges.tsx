import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'

import { observationLabel } from '../observations'
import type { Issue } from '../types'

export function IssueBadges({ issues }: { issues: Issue[] }) {
  const { t } = useTranslation()
  if (issues.length === 0) return <Badge tone="success">{t('common.clean')}</Badge>
  return (
    <div className="flex flex-wrap gap-1">
      {issues.map((issue, index) => (
        <Badge
          key={`${issue.code}-${index}`}
          tone={issue.severity === 'warning' ? 'warning' : 'info'}
          title={issue.detail}
        >
          {observationLabel(t, issue.code)}
          {issue.line_number ? ` · L${issue.line_number}` : ''}
        </Badge>
      ))}
    </div>
  )
}
