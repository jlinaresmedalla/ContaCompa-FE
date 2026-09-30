import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

import { TOKEN_NAMES } from '../constants'

// Keep references from the actual active CSS rules; computed custom properties resolve var().
function readTokens() {
  const root = document.documentElement
  const computed = getComputedStyle(root)
  const references: Record<string, string> = {}
  function visit(rules: CSSRuleList) {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSMediaRule && !window.matchMedia?.(rule.conditionText).matches) continue
      if (
        typeof CSSSupportsRule !== 'undefined' &&
        rule instanceof CSSSupportsRule &&
        !CSS.supports(rule.conditionText)
      )
        continue
      if (rule instanceof CSSStyleRule && root.matches(rule.selectorText)) {
        for (const name of TOKEN_NAMES.semantic) {
          const raw = rule.style.getPropertyValue(name)
          if (raw) references[name] = raw.match(/var\(\s*(--[\w-]+)/)?.[1] ?? raw.trim()
        }
      }
      if ('cssRules' in rule) visit((rule as CSSGroupingRule).cssRules)
    }
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      visit(sheet.cssRules)
    } catch {
      /* Cross-origin sheets cannot expose their rules. */
    }
  }
  return Object.fromEntries(
    Object.values(TOKEN_NAMES)
      .flat()
      .map((name) => [
        name,
        {
          value: computed.getPropertyValue(name).trim(),
          reference: references[name],
        },
      ]),
  )
}

export function TokenSections() {
  const { t } = useTranslation()
  const [tokens, setTokens] = useState<ReturnType<typeof readTokens>>({})
  useEffect(() => {
    const update = () => setTokens(readTokens())
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    media?.addEventListener('change', update)
    return () => {
      observer.disconnect()
      media?.removeEventListener('change', update)
    }
  }, [])
  return (
    <div className="space-y-10">
      {(Object.keys(TOKEN_NAMES) as (keyof typeof TOKEN_NAMES)[]).map((group) => (
        <section key={group} className="min-w-0 space-y-4">
          <h2 className="text-xl font-semibold">{t(`design.${group}`)}</h2>
          <div
            className={
              group === 'type'
                ? 'grid min-w-0 gap-3'
                : 'grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
            }
          >
            {TOKEN_NAMES[group].map((name) => {
              const token = tokens[name]
              return (
                <div key={name} className="min-w-0 rounded-2xl border border-border bg-card p-4">
                  {(group === 'colors' ||
                    (group === 'semantic' && !name.startsWith('--shadow'))) && (
                    <div
                      aria-hidden="true"
                      className="mb-3 h-12 rounded-lg border border-border"
                      style={{ background: token?.value }}
                    />
                  )}
                  {group === 'type' && (
                    <div className="overflow-x-auto">
                      <p
                        className="w-fit whitespace-nowrap"
                        style={
                          name.startsWith('--type')
                            ? { fontSize: token?.value }
                            : name === '--font-family-inter'
                              ? { fontFamily: token?.value }
                              : { letterSpacing: token?.value }
                        }
                      >
                        {t('design.sample')}
                      </p>
                    </div>
                  )}
                  {group === 'spacing' && (
                    <div
                      aria-hidden="true"
                      className="mb-3 h-3 max-w-full rounded-full bg-primary"
                      style={{ width: token?.value }}
                    />
                  )}
                  {group === 'radius' && (
                    <div
                      aria-hidden="true"
                      className="mb-3 h-12 w-20 border border-border bg-muted"
                      style={{ borderRadius: token?.value }}
                    />
                  )}
                  {(group === 'shadow' ||
                    (group === 'semantic' && name.startsWith('--shadow'))) && (
                    <div
                      aria-hidden="true"
                      className="mb-5 h-12 rounded-lg bg-card"
                      style={{ boxShadow: token?.value }}
                    />
                  )}
                  {group === 'motion' && (
                    <Button
                      variant="outline"
                      className="mb-3 h-auto min-h-9 max-w-full whitespace-normal py-2 motion-safe:transition-transform motion-safe:hover:translate-x-1 motion-safe:focus-visible:translate-x-1 motion-reduce:transition-none"
                      style={{
                        transitionDuration: name.startsWith('--duration')
                          ? token?.value
                          : tokens['--duration-base']?.value,
                        transitionTimingFunction: tokens['--ease-standard']?.value,
                      }}
                    >
                      {t('design.hover')}
                    </Button>
                  )}
                  {group === 'glass' && (
                    <div aria-hidden="true" className="material mb-3 h-12 rounded-lg" />
                  )}
                  <code className="block break-all text-xs">{name}</code>
                  <p className="mt-1 break-words text-xs text-muted-foreground">{token?.value}</p>
                  {token?.reference && (
                    <code className="mt-1 block break-all text-xs text-muted-foreground">
                      {token.reference}
                    </code>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
