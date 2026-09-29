import type { ReactNode } from 'react'

import type { Messages } from '@/app/i18n/es'
import { paths } from '@/app/router/paths'

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

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** The same list for every company (backend ADR 0016). Adding a module is a code change. */
export const modules: AppModule[] = [
  {
    id: 'extraction',
    labelKey: 'nav.extraction',
    icon: (
      <Icon>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </Icon>
    ),
    prefix: paths.extraction,
    visible: true,
    pages: [
      { to: paths.purchaseDocs, labelKey: 'nav.purchaseDocs' },
      { to: paths.jobs, labelKey: 'nav.jobs' },
    ],
  },
  {
    id: 'monitor',
    labelKey: 'nav.monitor',
    icon: (
      <Icon>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </Icon>
    ),
    prefix: paths.monitor,
    visible: true,
    pages: [{ to: paths.costs, labelKey: 'nav.costs' }],
  },
  {
    id: 'assistant',
    labelKey: 'nav.assistant',
    icon: (
      <Icon>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </Icon>
    ),
    prefix: paths.assistant,
    visible: false,
    pages: [],
  },
]

export const visibleModules = modules.filter((module) => module.visible)

/** The module owning a pathname, or undefined for paths outside every prefix. */
export function moduleFor(pathname: string): AppModule | undefined {
  return visibleModules.find(
    (module) => pathname === module.prefix || pathname.startsWith(`${module.prefix}/`),
  )
}
