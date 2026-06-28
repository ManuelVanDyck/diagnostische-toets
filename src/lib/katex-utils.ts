import katex from 'katex'

/** Render KaTeX string naar HTML — veilig voor dangerouslySetInnerHTML */
export function renderKatex(tex: string): string {
  let html = tex

  // Auto-wrap: als de tekst ^ of _ bevat maar geen $, wrap dan in $...$
  if (!html.includes('$') && /[\^_]/.test(html)) {
    html = `$${html}$`
  }

  // Vervang $$...$$ door display math
  html = html.replace(/\$\$(.+?)\$\$/gs, (_: string, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
    } catch {
      return formula
    }
  })

  // Vervang $...$ door inline math
  html = html.replace(/\$(.+?)\$/g, (_: string, formula: string) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return formula
    }
  })

  return html
}

/** Formatteer seconden naar mm:ss */
export function formatTijd(seconden: number): string {
  const m = Math.floor(seconden / 60)
  const s = seconden % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
