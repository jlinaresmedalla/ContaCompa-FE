import { useTranslation } from 'react-i18next'

import { Button } from '@/components/atoms'

import { TOKEN_NAMES } from '../../utils/tokenNames'
import { useDesignTokens } from './useDesignTokens'

export function TokenSections() {
  const { t } = useTranslation()
  const tokens = useDesignTokens()
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
