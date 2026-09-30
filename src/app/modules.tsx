import { Activity, FileText, MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Messages } from '@/app/i18n/en'
import { PATHS } from '@/app/router/paths'

type NavKey = `nav.${keyof Messages['nav']}`

export type ModulePage = { to: string; labelKey: NavKey }

export type AppModule = {
  id: string
  labelKey: NavKey
  icon: ReactNode
  /** URL prefix owned by the module; every page of the module lives under it. */
  prefix: string
  visible: boolean
  /** The first page is the module's landing page. */
  pages: ModulePage[]
}

/** The same list for every company (backend ADR 0016). Adding a module is a code change. */
export const MODULES: AppModule[] = [
  {
    id: 'extraction',
    labelKey: 'nav.extraction',
    icon: <FileText className="size-5 shrink-0" aria-hidden="true" />,
    prefix: PATHS.extraction,
    visible: true,
    pages: [
      { to: PATHS.purchaseDocs, labelKey: 'nav.purchaseDocs' },
      { to: PATHS.jobs, labelKey: 'nav.jobs' },
    ],
  },
  {
    id: 'monitor',
    labelKey: 'nav.monitor',
    icon: <Activity className="size-5 shrink-0" aria-hidden="true" />,
    prefix: PATHS.monitor,
    visible: true,
    pages: [{ to: PATHS.costs, labelKey: 'nav.costs' }],
  },
  {
    id: 'assistant',
    labelKey: 'nav.assistant',
    icon: <MessageCircle className="size-5 shrink-0" aria-hidden="true" />,
    prefix: PATHS.assistant,
    visible: false,
    pages: [],
  },
]

export const VISIBLE_MODULES = MODULES.filter((module) => module.visible)

/** The module owning a pathname, or undefined for paths outside every prefix. */
export function moduleFor(pathname: string): AppModule | undefined {
  return VISIBLE_MODULES.find(
    (module) => pathname === module.prefix || pathname.startsWith(`${module.prefix}/`),
  )
}
