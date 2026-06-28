import katex from 'katex'

/**
 * Render KaTeX. Herkent $...$, $$...$$, en auto-wrap losse exponenten/subscripts.
 */
export function renderKatex(tex: string): string {
  let html = tex

  // Auto-wrap exponenten en subscripts die niet al in $ staan
  if (!html.includes('$')) {
    // Wrap ^ patroon: a^2, x^{10}, a^{-4}, (a+b)^2 etc.
    html = html.replace(/([a-zA-Z0-9)])?\^(\{[^}]+\}|\-?[0-9a-zA-Z]+)/g, (match: string) => {
      return `$${match}$`
    })
    // Wrap _ subscript
    html = html.replace(/([a-zA-Z0-9)])?_(\{[^}]+\}|\-?[0-9a-zA-Z]+)/g, (match: string) => {
      if (match.includes('$')) return match
      return `$${match}$`
    })
    // Wrap \sqrt{...}
    html = html.replace(/(\\sqrt\{[^}]+\})/g, (match: string) => `$${match}$`)
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
