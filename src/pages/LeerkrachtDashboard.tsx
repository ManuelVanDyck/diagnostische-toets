import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { renderKatex } from '../lib/katex-utils'

const GEBIEDEN = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const GEBIED_NAMEN: Record<string, string> = {
  A: 'Getallenkennis', B: 'Bewerkingen', C: 'Algebra',
  D: 'Vergelijkingen', E: 'Functies', F: 'Meetkunde',
  G: 'Goniometrie & Pythagoras'
}

const SUB_NAMEN: Record<string, string> = {
  eigenschappen: '🔄 Eigenschappen van bewerkingen',
  volgorde: '🔢 Volgorde van bewerkingen',
  machten: '⬆️ Rekenen met machten',
  wortels: '√ Rekenen met vierkantswortels',
}

const SUB_FEEDBACK: Record<string, Record<number, { kan: string; werk_aan: string }>> = {
  eigenschappen: {
    0: { kan: 'Je herkent nog geen eigenschappen.', werk_aan: 'Oefen commutativiteit, associativiteit en distributiviteit met eenvoudige voorbeelden.' },
    1: { kan: 'Je herkent de basisbegrippen commutativiteit en associativiteit.', werk_aan: 'Leer ook de distributieve eigenschap en neutraal element herkennen.' },
    2: { kan: 'Je past de distributieve eigenschap toe en herkent het neutraal element.', werk_aan: 'Werk aan symmetrische en opslorpende elementen.' },
    3: { kan: 'Je bewijst dat bewerkingen niet-commutatief kunnen zijn.', werk_aan: 'Oefen met complexere combinaties van eigenschappen.' },
    4: { kan: 'Je combineert meerdere eigenschappen in complexe opgaven.', werk_aan: 'Verdiep je in abstracte bewijsvoering met eigenschappen.' },
    5: { kan: 'Je beheerst alle eigenschappen en past ze toe in onbekende situaties.', werk_aan: 'Blijf oefenen met open vragen en redeneringen.' },
  },
  volgorde: {
    0: { kan: 'Je past de volgorde nog niet correct toe.', werk_aan: 'Leer HMWVDOA: Haakjes, Machten/Wortels, Vermenigvuldigen/Delen, Optellen/Aftrekken.' },
    1: { kan: 'Je past de basisvolgorde toe (eerst vermenigvuldigen dan optellen).', werk_aan: 'Oefen met machten en haakjes in de volgorde.' },
    2: { kan: 'Je past de volgorde toe met haakjes, vermenigvuldigen en optellen.', werk_aan: 'Voeg machten en wortels toe aan de volgorde-oefeningen.' },
    3: { kan: 'Je combineert haakjes, machten, wortels in de juiste volgorde.', werk_aan: 'Werk aan complexere combinaties met negatieve getallen.' },
    4: { kan: 'Je lost complexe volgorde-opgaven op met alle bewerkingen.', werk_aan: 'Oefen met opgaven waar meerdere haakjes en machten gecombineerd worden.' },
    5: { kan: 'Je beheerst de volledige volgorde foutloos.', werk_aan: 'Blijf alert op valkuilen zoals -a^2 vs (-a)^2.' },
  },
  machten: {
    0: { kan: 'Je kent de rekenregels voor machten nog niet.', werk_aan: 'Begin met a^m * a^n = a^(m+n) en a^0 = 1.' },
    1: { kan: 'Je kent de basisregels: productregel en a^0.', werk_aan: 'Leer ook de quotientregel en macht van een macht.' },
    2: { kan: 'Je past product- en quotientregel toe op eenvoudige machten.', werk_aan: 'Oefen met negatieve exponenten en macht van een macht.' },
    3: { kan: 'Je werkt met negatieve exponenten en combineert meerdere regels.', werk_aan: 'Oefen met het vereenvoudigen van complexe machtsuitdrukkingen.' },
    4: { kan: 'Je combineert alle machtsregels in complexe uitdrukkingen.', werk_aan: 'Werk aan opgaven met variabelen zoals (a^2)^3 * a^(-4).' },
    5: { kan: 'Je beheerst alle machtsregels volledig.', werk_aan: 'Blijf oefenen met uitdagende combinaties van regels.' },
  },
  wortels: {
    0: { kan: 'Je kent de rekenregels voor vierkantswortels nog niet.', werk_aan: 'Begin met sqrt(a)*sqrt(b)=sqrt(ab) en vereenvoudigen.' },
    1: { kan: 'Je kent sqrt(81)=9 en herkent de productregel.', werk_aan: 'Leer wortels vereenvoudigen zoals sqrt(50)=5*sqrt(2).' },
    2: { kan: 'Je vereenvoudigt eenvoudige wortels en past de productregel toe.', werk_aan: 'Oefen met optellen en aftrekken van gelijksoortige wortels.' },
    3: { kan: 'Je combineert wortels in bewerkingen en vereenvoudigt correct.', werk_aan: 'Werk aan deling door wortels en het vereenvoudigen van breuken met wortels.' },
    4: { kan: 'Je lost complexe opgaven met wortels op.', werk_aan: 'Oefen met opgaven die wortels combineren met machten en haakjes.' },
    5: { kan: 'Je beheerst alle wortelregels volledig in complexe situaties.', werk_aan: 'Blijf oefenen met onbekende combinaties van wortels.' },
  },
}

const NIVEAU_INFO: Record<number, { kleur: string; label: string; bg: string }> = {
  0: { kleur: '#DC2626', label: '0', bg: 'bg-red-50 text-red-700' },
  1: { kleur: '#EA580C', label: '1', bg: 'bg-orange-50 text-orange-700' },
  2: { kleur: '#CA8A04', label: '2', bg: 'bg-amber-50 text-amber-700' },
  3: { kleur: '#65A30D', label: '3', bg: 'bg-lime-50 text-lime-700' },
  4: { kleur: '#059669', label: '4', bg: 'bg-emerald-50 text-emerald-700' },
  5: { kleur: '#4F46E5', label: '5', bg: 'bg-indigo-50 text-indigo-700' },
}

interface SubResultaat { niveau: number; correct: number; totaal: number; sub_gebied: string | null }
interface LeerlingResultaat {
  leerling_id: string
  voornaam: string
  naam: string
  klas: string
  gebieden: Record<string, SubResultaat[]>
}

export default function LeerkrachtDashboard() {
  const navigate = useNavigate()
  const [resultaten, setResultaten] = useState<LeerlingResultaat[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeerling, setSelectedLeerling] = useState<LeerlingResultaat | null>(null)
  const [detailAntwoorden, setDetailAntwoorden] = useState<any[]>([])
  const [klasFilter, setKlasFilter] = useState<string>('')

  useEffect(() => {
    laadData()
  }, [])

  const laadData = async () => {
    // Check of gebruiker leerkracht is
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return navigate('/')

    const { data: profiel } = await supabase
      .from('leerlingen')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (!profiel || profiel.rol !== 'leerkracht') {
      return navigate('/')
    }

    // Haal alle resultaten op (apart van leerlingen)
    const { data: alleResultaten } = await supabase
      .from('resultaten')
      .select('*')
      .order('gebied')

    // Haal alle leerlingen op
    const { data: alleLeerlingen } = await supabase
      .from('leerlingen')
      .select('id, voornaam, naam, klas, rol')
      .eq('rol', 'leerling')

    if (!alleResultaten || !alleLeerlingen) { setLoading(false); return }

    const leerlingMap = new Map<string, any>()
    for (const l of alleLeerlingen) {
      leerlingMap.set(l.id, l)
    }

    // Groepeer per leerling
    const map = new Map<string, LeerlingResultaat>()
    for (const r of alleResultaten) {
      const l = leerlingMap.get(r.leerling_id)
      if (!l) continue
      if (!map.has(l.id)) {
        map.set(l.id, {
          leerling_id: l.id,
          voornaam: l.voornaam,
          naam: l.naam,
          klas: l.klas || '',
          gebieden: {}
        })
      }
      const entry = map.get(l.id)!
      const gebKey = r.sub_gebied ? `${r.gebied}_${r.sub_gebied}` : r.gebied
      if (!entry.gebieden[gebKey]) entry.gebieden[gebKey] = []
      entry.gebieden[gebKey].push({
        niveau: r.beheersingsniveau,
        correct: r.aantal_correct,
        totaal: r.aantal_vragen,
        sub_gebied: r.sub_gebied
      })
    }

    setResultaten(Array.from(map.values()))
    setLoading(false)
  }

  const toonDetail = async (lr: LeerlingResultaat) => {
    setSelectedLeerling(lr)
    const { data } = await supabase
      .from('antwoorden')
      .select(`
        *,
        vragen(vraag_html, juist_antwoord, niveau, leerplandoel)
      `)
      .eq('sessie_id', (await supabase
        .from('toets_sessies')
        .select('id')
        .eq('leerling_id', lr.leerling_id)
        .order('gestart_op', { ascending: false })
        .limit(1)
        .single()
      ).data?.id)
      .order('gebied')
      .order('stap')

    setDetailAntwoorden(data || [])
  }

  // CSV export met feedback
  const exportCSV = () => {
    const headers = ['Voornaam', 'Naam', 'Klas', 'Gebied', 'Sub-onderwerp', 'Niveau', 'Correct/Totaal', 'Feedback']
    const rows: string[][] = []
    for (const lr of gefilterd) {
      for (const g of GEBIEDEN) {
        const subs = lr.gebieden[g]
        if (!subs || subs.length === 0) continue
        for (const s of subs) {
          const fb = s.sub_gebied ? SUB_FEEDBACK[s.sub_gebied]?.[s.niveau] : null
          rows.push([lr.voornaam, lr.naam, lr.klas, g, s.sub_gebied || '-', String(s.niveau), `${s.correct}/${s.totaal}`, fb ? fb.werk_aan.replace(/,/g, ' -') : '-'])
        }
      }
    }
    const csv = '\uFEFF' + [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `diagnostische-toets-${klasFilter || 'alle'}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  // Print-weergave
  const [printModus, setPrintModus] = useState(false)
  const printKlasOverzicht = () => {
    setPrintModus(true)
    setTimeout(() => window.print(), 300)
  }

  // Filter
  const klassen = [...new Set(resultaten.map(r => r.klas))]
  const gefilterd = klasFilter
    ? resultaten.filter(r => r.klas === klasFilter)
    : resultaten

  if (printModus) return <PrintOverzicht resultaten={gefilterd} klas={klasFilter} onClose={() => setPrintModus(false)} />

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Dashboard laden...</div>
  }

  // Detailweergave
  if (selectedLeerling) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedLeerling(null)}
            className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Terug naar overzicht
          </button>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {selectedLeerling.voornaam} {selectedLeerling.naam}
          </h2>
          <p className="text-gray-500 mb-6">Klas {selectedLeerling.klas}</p>

          {/* Per gebied met sub-gebieden + feedback */}
          <div className="space-y-3 mb-6">
            {GEBIEDEN.map(g => {
              const subs = selectedLeerling.gebieden[g]
              if (!subs || subs.length === 0) return null
              return (
                <div key={g} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-700 mb-3">{g}: {GEBIED_NAMEN[g]}</h3>
                  <div className="space-y-2">
                    {subs.map((s, i) => {
                      const info = NIVEAU_INFO[s.niveau] || NIVEAU_INFO[0]
                      const naam = s.sub_gebied ? (SUB_NAMEN[s.sub_gebied] || s.sub_gebied) : 'Algemeen'
                      const fb = s.sub_gebied ? SUB_FEEDBACK[s.sub_gebied]?.[s.niveau] : null
                      return (
                        <div key={i} className={`rounded-lg border p-3 ${info.bg}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">{naam}</span>
                            <span className="text-2xl">{['🔴','🟠','🟡','🟢','🔵','🟣'][s.niveau]}</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Niveau {s.niveau}/5</span>
                            <span>{s.correct}/{s.totaal} correct</span>
                          </div>
                          {fb && (
                            <div className="bg-white/60 rounded-lg p-2 text-sm space-y-1 mt-2">
                              <p>✅ <span className="font-medium">Wat de leerling al kan:</span> {fb.kan}</p>
                              <p>🎯 <span className="font-medium">Waar nog aan gewerkt moet worden:</span> {fb.werk_aan}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Antwoorden detail */}
          <h3 className="font-bold text-gray-700 mb-3">Antwoorden</h3>
          <div className="space-y-2">
            {detailAntwoorden.map((a: any) => (
              <div key={a.id} className={`p-3 rounded-lg border ${a.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="text-sm text-gray-500 mb-1">{a.gebied} · stap {a.stap}</div>
                <div
                  className="text-sm mb-1"
                  dangerouslySetInnerHTML={{ __html: renderKatex(a.vragen?.vraag_html || '') }}
                />
                <div className="text-xs">
                  <span className={a.is_correct ? 'text-green-700' : 'text-red-700'}>
                    {a.is_correct ? '✅' : '❌'} Jouw antwoord: {a.gegeven_antwoord}
                  </span>
                  {!a.is_correct && (
                    <span className="text-gray-500 ml-2">
                      Juist: {a.vragen?.juist_antwoord}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Klasgemiddelden
  const gemiddelden: Record<string, number> = {}
  for (const g of GEBIEDEN) {
    const niveaus = gefilterd
      .flatMap(r => (r.gebieden[g] || []).map(s => s.niveau))
    gemiddelden[g] = niveaus.length > 0
      ? Math.round(niveaus.reduce((a, b) => a + b, 0) / niveaus.length * 10) / 10
      : 0
  }

  // Leerlingen die hulp nodig hebben (niveau 0-1 op ≥2 sub-gebieden)
  const hulpNodig = gefilterd.filter(lr => {
    const alleSubs = Object.values(lr.gebieden).flat()
    const zwak = alleSubs.filter(s => s.niveau <= 1)
    return zwak.length >= 2
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 Leerkrachtendashboard</h1>
            <p className="text-gray-500 text-sm">{resultaten.length} leerlingen</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium">
              📥 CSV
            </button>
            <button onClick={printKlasOverzicht} className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium">
              🖨️ Print
            </button>
            <button onClick={() => navigate('/')} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
              ← Start
            </button>
          </div>
        </div>

        {/* Klasfilter */}
        {klassen.length > 1 && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => setKlasFilter('')}
              className={`px-3 py-1 rounded-lg text-sm ${!klasFilter ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
            >Alle</button>
            {klassen.map(k => (
              <button key={k} onClick={() => setKlasFilter(k)}
                className={`px-3 py-1 rounded-lg text-sm ${klasFilter === k ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
              >{k}</button>
            ))}
          </div>
        )}

        {/* Klasgemiddelden */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">KLASGEMIDDELDEN PER GEBIED</h2>
          <div className="grid grid-cols-7 gap-2">
            {GEBIEDEN.map(g => (
              <div key={g} className="text-center p-2 rounded-xl bg-gray-50">
                <div className="text-xs text-gray-500">{g}</div>
                <div className="font-bold text-lg text-gray-800">{gemiddelden[g]}</div>
                <div className="text-xs text-gray-400">/5</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actie: hulp nodig */}
        {hulpNodig.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <h2 className="font-semibold text-red-800 mb-2">⚠️ {hulpNodig.length} leerling(en) hebben extra ondersteuning nodig</h2>
            <div className="flex flex-wrap gap-2">
              {hulpNodig.map(lr => (
                <button
                  key={lr.leerling_id}
                  onClick={() => toonDetail(lr)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                >
                  {lr.voornaam} {lr.naam} ({lr.klas})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overzichtstabel */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-3 font-medium text-gray-500">Naam</th>
                  <th className="text-left p-3 font-medium text-gray-500">Klas</th>
                  {GEBIEDEN.map(g => (
                    <th key={g} className="p-3 text-center font-medium text-gray-500 w-14">{g}</th>
                  ))}
                  <th className="p-3 text-center font-medium text-gray-500 w-16">Gem</th>
                </tr>
              </thead>
              <tbody>
                {gefilterd.map(lr => {
                  // Gemiddelde over alle sub-resultaten
                  const alleNiveaus = Object.values(lr.gebieden).flat().map(s => s.niveau)
                  const gem = alleNiveaus.length > 0
                    ? alleNiveaus.reduce((a: number, b: number) => a + b, 0) / alleNiveaus.length
                    : NaN
                  return (
                    <tr
                      key={lr.leerling_id}
                      onClick={() => toonDetail(lr)}
                      className="border-b border-gray-50 hover:bg-indigo-50 cursor-pointer transition"
                    >
                      <td className="p-3 font-medium text-gray-800">{lr.voornaam} {lr.naam}</td>
                      <td className="p-3 text-gray-500">{lr.klas}</td>
                      {GEBIEDEN.map(g => {
                        const subs = lr.gebieden[g]
                        if (!subs || subs.length === 0) return <td key={g} className="p-1 text-center"><span className="text-gray-300">-</span></td>
                        // Toon gemiddelde van subs als er meerdere zijn, anders het enkele niveau
                        const gemNiv = subs.length === 1 ? subs[0].niveau : Math.round(subs.reduce((a, s) => a + s.niveau, 0) / subs.length)
                        const info = NIVEAU_INFO[gemNiv] || NIVEAU_INFO[0]
                        return (
                          <td key={g} className="p-1 text-center">
                            <span className={`inline-block w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${info.bg}`} title={subs.map(s => `${s.sub_gebied}: ${s.niveau}`).join(', ')}>
                              {info.label}
                            </span>
                          </td>
                        )
                      })}
                      <td className="p-3 text-center font-mono text-sm text-gray-600">
                        {isNaN(gem) ? '-' : gem.toFixed(1)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Print-vriendelijk overzicht per klas
function PrintOverzicht({ resultaten, klas, onClose }: { resultaten: LeerlingResultaat[], klas: string, onClose: () => void }) {
  const titel = klas ? `Klas ${klas}` : 'Alle klassen'
  return (
    <div className="p-6 max-w-[210mm] mx-auto print:p-0 print:max-w-none bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-xl font-bold">🖨️ Printweergave — {titel}</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">
            🖨️ Afdrukken
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500">← Terug</button>
        </div>
      </div>

      <h1 className="text-xl font-bold mb-1 hidden print:block">Diagnostische Toets Wiskunde — {titel}</h1>
      <p className="text-gray-500 text-sm mb-4 hidden print:block">{resultaten.length} leerlingen · {new Date().toLocaleDateString('nl-BE')}</p>

      {resultaten.map((lr, i) => (
        <div key={lr.leerling_id} className={`mb-6 pb-4 ${i < resultaten.length - 1 ? 'border-b border-gray-200' : ''}`}>
          <h2 className="font-bold text-gray-800 mb-3">
            {lr.voornaam} {lr.naam} {lr.klas && <span className="text-gray-500 font-normal">· {lr.klas}</span>}
          </h2>
          <div className="grid grid-cols-1 gap-2 print:grid-cols-2 print:gap-1">
            {GEBIEDEN.map(g => {
              const subs = lr.gebieden[g]
              if (!subs || subs.length === 0) return null
              return subs.map((s, i) => {
                const info = NIVEAU_INFO[s.niveau] || NIVEAU_INFO[0]
                const naam = s.sub_gebied ? (SUB_NAMEN[s.sub_gebied] || s.sub_gebied) : g
                const fb = s.sub_gebied ? SUB_FEEDBACK[s.sub_gebied]?.[s.niveau] : null
                return (
                  <div key={`${g}-${i}`} className={`rounded-lg border p-2 text-xs ${info.bg} print:text-[9px] print:p-1`}>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>{g}: {naam}</span>
                      <span>Niv {s.niveau}/5 ({s.correct}/{s.totaal})</span>
                    </div>
                    {fb && (
                      <div className="space-y-0.5 text-[10px] print:text-[7px]">
                        <div>✅ {fb.kan}</div>
                        <div>🎯 {fb.werk_aan}</div>
                      </div>
                    )}
                  </div>
                )
              })
            })}
          </div>
        </div>
      ))}

      {resultaten.length === 0 && (
        <p className="text-gray-500 text-center py-8">Geen resultaten beschikbaar.</p>
      )}
    </div>
  )
}
