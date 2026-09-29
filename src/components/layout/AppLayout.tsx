import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useLocation } from 'react-router'

import { LANGUAGES, setLanguage, type Language } from '@/app/i18n'
import { moduleFor, visibleModules, type AppModule } from '@/app/modules'
import { Segmented } from '@/components/ui/segmented'
import { SessionPanel } from '@/features/session'
import { cn } from '@/lib/cn'
import { applyTheme, storedTheme, THEMES, type Theme } from '@/lib/theme'

export function AppLayout() {
  const { t } = useTranslation()
  const { pathname, key } = useLocation()
  // Below md the sidebar shows only icons; the toggle opens it over the page. Any navigation
  // (Back and Forward too) closes it: the state remembers the location it was opened on.
  const [menu, setMenu] = useState({ open: false, key })
  if (menu.key !== key) setMenu({ open: false, key })
  const open = menu.open
  const close = () => setMenu({ open: false, key })
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu((current) => ({ ...current, open: false }))
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])
  const current = moduleFor(pathname)
  const labelClass = open ? '' : 'sr-only md:not-sr-only'
  return (
    <div className="min-h-screen">
      {open ? (
        <div
          data-testid="sidebar-backdrop"
          aria-hidden="true"
          className="fixed inset-0 z-10 bg-foreground/40 md:hidden"
          onClick={close}
        />
      ) : null}
      <aside
        id="sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-20 flex flex-col gap-4 overflow-y-auto border-r border-border bg-card p-2',
          open ? 'w-60 shadow-lg md:shadow-none' : 'w-14',
          'md:w-60',
        )}
      >
        <button
          type="button"
          aria-controls="sidebar"
          aria-expanded={open}
          aria-label={open ? t('nav.close') : t('nav.open')}
          onClick={() => setMenu({ open: !open, key })}
          className={cn(SIDEBAR_ITEM, SIDEBAR_IDLE, 'md:hidden')}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav aria-label={t('nav.main')} className="flex flex-col gap-1">
          {visibleModules.map((module) => {
            const label = t(module.labelKey)
            return (
              <Link
                key={module.id}
                to={module.pages[0]?.to ?? module.prefix}
                title={label}
                aria-current={current?.id === module.id ? 'page' : undefined}
                className={cn(
                  SIDEBAR_ITEM,
                  current?.id === module.id ? SIDEBAR_ACTIVE : SIDEBAR_IDLE,
                )}
              >
                {module.icon}
                <span className={labelClass}>{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className={cn('mt-auto flex-col gap-3 px-1 pb-1', open ? 'flex' : 'hidden md:flex')}>
          <LanguageSwitch />
          <ThemeSwitch />
          <SessionPanel />
        </div>
      </aside>
      <main className="mx-auto max-w-7xl px-4 py-6 pl-[4.5rem] md:pl-64">
        {current && current.pages.length > 1 ? <ModuleTabs module={current} /> : null}
        <Outlet />
      </main>
    </div>
  )
}

const SIDEBAR_ITEM =
  'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
const SIDEBAR_ACTIVE = 'bg-primary font-medium text-primary-foreground'
const SIDEBAR_IDLE = 'text-muted-foreground hover:bg-muted hover:text-foreground'

/** A module's own pages as tabs; the purchase doc detail keeps the Purchase docs tab active. */
function ModuleTabs({ module }: { module: AppModule }) {
  const { t } = useTranslation()
  return (
    <nav className="mb-6 flex flex-wrap gap-1" aria-label={t('nav.pages')}>
      {module.pages.map((page) => (
        <NavLink
          key={page.to}
          to={page.to}
          className={({ isActive }) =>
            cn(
              'rounded-lg px-3 py-1.5 text-sm',
              isActive
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          {t(page.labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}

function LanguageSwitch() {
  const { t, i18n } = useTranslation()
  return (
    <Segmented<Language>
      label={t('sidebar.language')}
      value={i18n.language === 'en' ? 'en' : 'es'}
      options={LANGUAGES.map((language) => ({ value: language, label: language.toUpperCase() }))}
      onChange={setLanguage}
    />
  )
}

function ThemeSwitch() {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<Theme>(storedTheme)
  return (
    <Segmented<Theme>
      label={t('sidebar.theme')}
      value={theme}
      options={THEMES.map((value) => ({ value, label: t(`sidebar.${value}`) }))}
      onChange={(next) => {
        applyTheme(next)
        setTheme(next)
      }}
    />
  )
}
