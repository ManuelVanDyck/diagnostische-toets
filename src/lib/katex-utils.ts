import katex from 'katex'

// Unicode superscript → ^N mapping
const SUPS: Record<string, string> = {
  '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6',
  '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁰': '^0', '¹': '^1',
}

/**
 * Render KaTeX. Herkent $...$, $$...$$, en auto-wrap exponenten/subscripts/wortels.
 *
 * Ondersteunt:
 *  - Exponenten: a^2, x^{10}, a^{-4}, (a+b)^2, a^(m+n), 10^{-2}
 *  - Subscripts: x_1, a_{n+1}
 *  - Vierkantswortels: √81, 4√5, √(a·b) (Unicode √ → \sqrt{})
 *  - Unicode superscripts: (−2)³, (−4)²
 *  - Multi-digit grondtal: 10^{-2} (niet splitsen)
 *  - Geneste expressies: (2^3)^2, (a^2)^3 · a^{-4}
 */
export function renderKatex(tex: string): string {
  let html = tex

  // Als er al $ in staat, sla de auto-wrap over (handmatige LaTeX mode)
  if (!html.includes('$')) {
    // 1. Unicode √ → \sqrt{}  (√81, √50, √(a·b))
    html = html.replace(/√(\d+|[a-zA-Z]|\([^)]*\))/g, (_match, inner: string) => {
      const clean = inner.startsWith('(') ? inner.slice(1, -1) : inner
      return `\\sqrt{${clean}}`
    })

    // 2. Unicode superscripts → ^N  ((−2)³ → (−2)^3)
    html = html.replace(/[²³⁴⁵⁶⁷⁸⁹⁰¹]/g, (ch: string) => SUPS[ch] || ch)

    // 3. Wrap exponenten (inclusief haakjes-exponenten, multi-digit grondtal, genest)
    html = html.replace(
      /([a-zA-Z0-9)]+|\([^)]*\))?\^(\{[^}]+\}|\([^)]*\)|\-?[0-9a-zA-Z]+)/g,
      (match: string) => `$${match}$`
    )

    // 4. Wrap subscripts
    html = html.replace(
      /([a-zA-Z0-9)]+)?_(\{[^}]+\}|\-?[0-9a-zA-Z]+)/g,
      (match: string) => match.includes('$') ? match : `$${match}$`
    )

    // 5. Wrap \sqrt{} met eventuele coëfficiënt-prefix (4\sqrt{5}, 3\sqrt{12})
    html = html.replace(
      /(\d+)?(\\sqrt\{[^}]+\})/g,
      (match: string) => match.includes('$') ? match : `$${match}$`
    )
  }

  // $$...$$ → display math
  html = html.replace(/\$\$(.+?)\$\$/gs, (_: string, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
    } catch {
      return formula
    }
  })

  // $...$ → inline math
  html = html.replace(/\$(.+?)\$/g, (_: string, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return formula
    }
  })

  return html
}

export function formatTijd(seconden: number): string {
  const m = Math.floor(seconden / 60)
  const s = seconden % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
