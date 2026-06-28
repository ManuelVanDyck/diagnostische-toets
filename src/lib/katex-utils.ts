import katex from 'katex'

/**
 * Render KaTeX: herken $...$ en $$...$$, en auto-wrap losse wiskunde.
 * Exponenten zoals a^m, x^2, 3x^2 worden automatisch herkend.
 */
export function renderKatex(tex: string): string {
  let html = tex

  // Auto-wrap: tekst met wiskundige patronen maar zonder $ → wrap in $
  if (!html.includes('$')) {
    const hasMath = /[\^_]|\\sqrt|\\frac|\\cdot|\\pi|\\infty|\\sum|\\int/.test(html)
    if (hasMath) {
      html = `$${html}$`
    }
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
