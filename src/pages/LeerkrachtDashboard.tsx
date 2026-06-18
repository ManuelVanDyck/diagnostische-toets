import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { renderKatex } from '../lib/katex-utils'
import { GEBIED_FEEDBACK } from '../lib/feedback'

const GEBIEDEN = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const GEBIED_NAMEN: Record<string, string> = {
  A: 'Getallenkennis', B: 'Bewerkingen', C: 'Algebra',
  D: 'Vergelijkingen', E: 'Functies', F: 'Meetkunde',
  G: 'Goniometrie & Pythagoras'
}

const NIVEAU_INFO: Record<number, { kleur: string; label: string; bg: string }> = {
  0: { kleur: '#DC2626', label: '0', bg: 'bg-red-50 text-red-700' },
  1: { kleur: '#EA580C', label: '1', bg: 'bg-orange-50 text-orange-700' },
  2: { kleur: '#CA8A04', label: '2', bg: 'bg-amber-50 text-amber-700' },
  3: { kleur: '#65A30D', label: '3', bg: 'bg-lime-50 text-lime-700' },
  4: { kleur: '#059669', label: '4', bg: 'bg-emerald-50 text-emerald-700' },
  5: { kleur: '#4F46E5', label: '5', bg: 'bg-indigo-50 text-indigo-700' },
}

interface LeerlingResultaat {
  leerling_id: string
  voornaam: string
  naam: string
  klas: string
  gebieden: Record<string, { niveau: number; correct: number; totaal: number }>
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

    // Haal alle resultaten op
    const { data: alleResultaten } = await supabase
      .from('resultaten')
      .select(`
        *,
        leerlingen!inner(id, voornaam, naam, klas)
      `)
      .order('gebied')

    if (!alleResultaten) { setLoading(false); return }

    // Groepeer per leerling
    const map = new Map<string, LeerlingResultaat>()
    for (const r of alleResultaten) {
      const l = (r as any).leerlingen
      if (!map.has(l.id)) {
        map.set(l.id, {
          leerling_id: l.id,
          voornaam: l.voornaam,
          naam: l.naam,
          klas: l.klas,
          gebieden: {}
        })
      }
      const entry = map.get(l.id)!
      entry.gebieden[r.gebied] = {
        niveau: r.beheersingsniveau,
        correct: r.aantal_correct,
        totaal: r.aantal_vragen
      }
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
    const headers = ['Voornaam', 'Naam', 'Klas', 
      ...GEBIEDEN.flatMap(g => [`${g} (niveau)`, `${g} (correct)`, `${g} (feedback)`]), 
      'Gemiddeld']
    const rows = gefilterd.map(lr => {
      const gebiedenData = GEBIEDEN.flatMap(g => {
        const d = lr.gebieden[g]
        const fb = d ? GEBIED_FEEDBACK[g]?.[d.niveau] : null
        return [
          d?.niveau ?? '-',
          d ? `${d.correct}/${d.totaal}` : '-',
          fb ? fb.werk_aan.replace(/,/g, ' -') : '-'
        ]
      })
      const niveaus = GEBIEDEN.map(g => lr.gebieden[g]?.niveau).filter(n => n !== undefined) as number[]
      const gem = niveaus.length > 0 ? (niveaus.reduce((a,b) => a+b, 0) / niveaus.length).toFixed(1) : '-'
      return [lr.voornaam, lr.naam, lr.klas, ...gebiedenData, gem]
    })
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

  if (printModus) return <PrintOverzicht resultaten={gefilterd} klas={klasFilter} onClose={() => setPrintModus(false)} />

  // Filter
  const klassen = [...new Set(resultaten.map(r => r.klas))]
  const gefilterd = klasFilter
    ? resultaten.filter(r => r.klas === klasFilter)
    : resultaten

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

          {/* Per gebied met feedback */}
          <div className="space-y-3 mb-6">
            {GEBIEDEN.map(g => {
              const gData = selectedLeerling.gebieden[g]
              if (!gData) return null
              const info = NIVEAU_INFO[gData.niveau]
              const fb = GEBIED_FEEDBACK[g]?.[gData.niveau]
              return (
                <div key={g} className={`rounded-xl border-2 p-4 ${info.bg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{g}: {GEBIED_NAMEN[g]}</span>
                    <span>Niveau {info.label} — {gData.correct}/{gData.totaal} correct</span>
                  </div>
                  {fb && (
                    <div className="mt-2 pt-2 border-t border-gray-200/50 text-xs space-y-1">
                      <p><span className="font-medium">✅ Kan:</span> {fb.kan}</p>
                      <p><span className="font-medium">📋 Beheerst:</span> {fb.beheerst}</p>
                      <p><span className="font-medium">🎯 Werk aan:</span> {fb.werk_aan}</p>
                    </div>
                  )}
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
      .map(r => r.gebieden[g]?.niveau)
      .filter(n => n !== undefined) as number[]
    gemiddelden[g] = niveaus.length > 0
      ? Math.round(niveaus.reduce((a, b) => a + b, 0) / niveaus.length * 10) / 10
      : 0
  }

  // Leerlingen die hulp nodig hebben (niveau 0-1 op ≥2 gebieden)
  const hulpNodig = gefilterd.filter(lr => {
    const zwak = GEBIEDEN.filter(g => {
      const n = lr.gebieden[g]?.niveau
      return n !== undefined && n <= 1
    })
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
                  const niveaus = GEBIEDEN.map(g => lr.gebieden[g]?.niveau)
                  const gem = niveaus
                    .filter(n => n !== undefined)
                    .reduce((a: number, b: any) => a + (b as number), 0) / niveaus.filter(n => n !== undefined).length
                  return (
                    <tr
                      key={lr.leerling_id}
                      onClick={() => toonDetail(lr)}
                      className="border-b border-gray-50 hover:bg-indigo-50 cursor-pointer transition"
                    >
                      <td className="p-3 font-medium text-gray-800">{lr.voornaam} {lr.naam}</td>
                      <td className="p-3 text-gray-500">{lr.klas}</td>
                      {GEBIEDEN.map(g => {
                        const n = lr.gebieden[g]?.niveau
                        const info = n !== undefined ? NIVEAU_INFO[n] : null
                        return (
                          <td key={g} className="p-1 text-center">
                            {info ? (
                              <span className={`inline-block w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${info.bg}`}>
                                {info.label}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
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
              const d = lr.gebieden[g]
              if (!d) return null
              const info = NIVEAU_INFO[d.niveau]
              const fb = GEBIED_FEEDBACK[g]?.[d.niveau]
              return (
                <div key={g} className={`rounded-lg border p-2 text-xs ${info.bg} print:text-[9px] print:p-1`}>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>{g}: {GEBIED_NAMEN[g]}</span>
                    <span>Niv {info.label} ({d.correct}/{d.totaal})</span>
                  </div>
                  {fb && (
                    <div className="space-y-0.5 text-[10px] print:text-[7px]">
                      <div>✅ {fb.kan}</div>
                      <div>📋 {fb.beheerst}</div>
                      <div>🎯 {fb.werk_aan}</div>
                    </div>
                  )}
                </div>
              )
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
