import { useEffect, useState } from 'react'

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

export function useDesignTokens() {
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
  return tokens
}
