import katex from 'katex'

/** Render KaTeX string naar HTML — veilig voor dangerouslySetInnerHTML */
export function renderKatex(tex: string): string {
  let html = tex

  // Auto-wrap: tekst met ^ of _ zonder $ → wrap in $
  html = html.replace(/([a-zA-Z0-9)])\^(\{?[a-zA-Z0-9+\-·]+\}?)/g, (_: string, base: string, exp: string) => {
    if (html.includes('$')) return `$${base}^${exp}$` // al in dollar, niet dubbel
    return `$${base}^${exp}$`
  })

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
