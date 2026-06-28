import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { renderKatex } from '../lib/katex-utils'

const GEBIED_NAMEN: Record<string, string> = {
  A: 'Getallenkennis & verzamelingen', B: 'Bewerkingen & rekenregels',
  C: 'Algebraïsche uitdrukkingen', D: 'Vergelijkingen & ongelijkheden',
  E: 'Functies', F: 'Meetkundige formules', G: 'Goniometrie & Pythagoras',
}

interface Vraag {
  id: string; gebied: string; niveau: number; leerplandoel: string
  type: 'meerkeuze' | 'invul' | 'meerkeuze_meervoudig'
  vraag_html: string
  keuzes_json: { label: string; waarde: string }[] | null
  juist_antwoord: string; tolerantie: number | null
  uitleg_html: string | null
}

export default function Toets() {
  const { gebied } = useParams<{ gebied: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [sessieId, setSessieId] = useState<string | null>(searchParams.get('sessie'))
  const [huidigeVraag, setHuidigeVraag] = useState<Vraag | null>(null)
  const [gekozenAntwoord, setGekozenAntwoord] = useState<string>('')
  const [antwoordStatus, setAntwoordStatus] = useState<'kies' | 'feedback'>('kies')
  const [stap, setStap] = useState(0)
  const [isGestart, setIsGestart] = useState(false)
  const [loading, setLoading] = useState(false)

  // Sessie starten
  useEffect(() => {
    if (sessieId && !isGestart) {
      setIsGestart(true)
      laadVolgendeVraag(sessieId)
    } else if (!sessieId && gebied) {
      startNieuweSessie()
    }
  }, [sessieId, gebied])

  const startNieuweSessie = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user || !gebied) return

    const { data } = await supabase
      .from('toets_sessies')
      .insert({ leerling_id: user.id, gebied })
      .select()
      .single()

    if (data) {
      setSessieId(data.id)
      setIsGestart(true)
      laadVolgendeVraag(data.id)
    }
  }

  const laadVolgendeVraag = async (sid: string) => {
    if (!gebied) return
    setLoading(true)

    const { data: vraagId } = await supabase
      .rpc('volgende_vraag', { p_sessie_id: sid, p_gebied: gebied })

    if (!vraagId) {
      // Gebied afgerond
      voltooiToets(sid)
      return
    }

    const { data: vraag } = await supabase
      .from('vragen')
      .select('*')
      .eq('id', vraagId)
      .single()

    if (vraag) {
      setHuidigeVraag(vraag)
      setGekozenAntwoord('')
      setAntwoordStatus('kies')
      setStap(s => s + 1)
    }
    setLoading(false)
  }

  const verstuurAntwoord = async () => {
    if (!sessieId || !huidigeVraag || !gebied) return

    // Bepaal correctheid
    let isCorrect = false
    if (huidigeVraag.type === 'invul') {
      const tolerantie = huidigeVraag.tolerantie || 0.001
      const gegeven = parseFloat(gekozenAntwoord.replace(',', '.'))
      const juist = parseFloat(huidigeVraag.juist_antwoord)
      isCorrect = !isNaN(gegeven) && !isNaN(juist) && Math.abs(gegeven - juist) <= tolerantie
    } else if (huidigeVraag.type === 'meerkeuze_meervoudig') {
      // Sorteer beide sets alfabetisch en vergelijk
      const gegeven = gekozenAntwoord.split(',').map(s => s.trim()).filter(s => s).sort().join(',')
      const juist = huidigeVraag.juist_antwoord.split(',').map(s => s.trim()).sort().join(',')
      isCorrect = gegeven === juist
    } else {
      isCorrect = gekozenAntwoord.trim() === huidigeVraag.juist_antwoord.trim()
    }

    await supabase.from('antwoorden').insert({
      sessie_id: sessieId,
      vraag_id: huidigeVraag.id,
      gebied,
      gegeven_antwoord: gekozenAntwoord,
      is_correct: isCorrect,
      stap,
    })

    setAntwoordStatus('feedback')
  }

  const volgendeVraag = async () => {
    if (!sessieId) return
    await laadVolgendeVraag(sessieId)
  }

  const voltooiToets = async (sid: string) => {
    if (!gebied) return
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    // Bereken niveau
    const { data: niveau } = await supabase
      .rpc('bereken_beheersingsniveau', { p_sessie_id: sid, p_gebied: gebied })

    // Sla resultaat op
    const { count: aantalVragen } = await supabase
      .from('antwoorden')
      .select('*', { count: 'exact', head: true })
      .eq('sessie_id', sid)

    const { count: aantalCorrect } = await supabase
      .from('antwoorden')
      .select('*', { count: 'exact', head: true })
      .eq('sessie_id', sid)
      .eq('is_correct', true)

    await supabase.from('resultaten').upsert({
      sessie_id: sid,
      leerling_id: user.id,
      gebied,
      beheersingsniveau: niveau || 0,
      aantal_vragen: aantalVragen || 0,
      aantal_correct: aantalCorrect || 0,
    }, { onConflict: 'sessie_id,gebied' })

    // Update sessie
    await supabase.from('toets_sessies')
      .update({ status: 'afgerond', beeindigd_op: new Date().toISOString() })
      .eq('id', sid)

    // Toon resultaat
    navigate(`/resultaat/${sid}`)
  }

  if (!isGestart || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">Toets laden...</p>
          <p className="text-gray-400 text-sm">Gebied {gebied}: {GEBIED_NAMEN[gebied || ''] || ''}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="mb-4">
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-2">
            ← Terug naar overzicht
          </button>
          <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Gebied {gebied}</span>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-500">{GEBIED_NAMEN[gebied || '']}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">Vraag {stap}</span>
          </div>
        </div>

        {/* Vraag */}
        {huidigeVraag && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  Niveau {huidigeVraag.niveau}
                </span>
                <span className="text-xs text-gray-400">{huidigeVraag.leerplandoel}</span>
              </div>

              <div
                className="prose max-w-none text-gray-800 mb-6 text-lg"
                dangerouslySetInnerHTML={{ __html: renderKatex(huidigeVraag.vraag_html) }}
              />

              {/* Meerkeuze */}
              {huidigeVraag.type === 'meerkeuze' && huidigeVraag.keuzes_json && (
                <div className="space-y-3">
                  {huidigeVraag.keuzes_json.map((keuze, i) => {
                    const isJuist = keuze.waarde === huidigeVraag.juist_antwoord
                    let knopKleur = 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                    if (antwoordStatus === 'feedback') {
                      if (isJuist) knopKleur = 'border-green-400 bg-green-50'
                      else if (keuze.waarde === gekozenAntwoord) knopKleur = 'border-red-400 bg-red-50'
                    } else if (keuze.waarde === gekozenAntwoord) {
                      knopKleur = 'border-indigo-400 bg-indigo-50'
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => antwoordStatus === 'kies' && setGekozenAntwoord(keuze.waarde)}
                        disabled={antwoordStatus !== 'kies'}
                        className={`w-full text-left p-4 rounded-xl border-2 transition ${knopKleur}`}
                      >
                        <span dangerouslySetInnerHTML={{ __html: renderKatex(keuze.label) }} />
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Meerkeuze meervoudig */}
              {huidigeVraag.type === 'meerkeuze_meervoudig' && huidigeVraag.keuzes_json && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-2">Selecteer alle juiste uitspraken:</p>
                  {huidigeVraag.keuzes_json.map((keuze, i) => {
                    const geselecteerd = gekozenAntwoord.split(',').includes(keuze.waarde)
                    const juisteSet = huidigeVraag.juist_antwoord.split(',').map(s => s.trim())
                    const isJuist = juisteSet.includes(keuze.waarde)
                    let knopKleur = 'border-gray-200 hover:border-indigo-400'
                    if (antwoordStatus === 'feedback') {
                      if (isJuist && geselecteerd) knopKleur = 'border-green-400 bg-green-50'
                      else if (isJuist && !geselecteerd) knopKleur = 'border-yellow-400 bg-yellow-50'
                      else if (!isJuist && geselecteerd) knopKleur = 'border-red-400 bg-red-50'
                    } else if (geselecteerd) {
                      knopKleur = 'border-indigo-400 bg-indigo-50'
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (antwoordStatus !== 'kies') return
                          const huidig = gekozenAntwoord.split(',').filter(s => s)
                          const nieuw = huidig.includes(keuze.waarde)
                            ? huidig.filter(s => s !== keuze.waarde)
                            : [...huidig, keuze.waarde]
                          setGekozenAntwoord(nieuw.join(','))
                        }}
                        disabled={antwoordStatus !== 'kies'}
                        className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-3 ${knopKleur}`}
                      >
                        <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                          geselecteerd ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300'
                        }`}>
                          {geselecteerd ? '✓' : ''}
                        </span>
                        <span dangerouslySetInnerHTML={{ __html: renderKatex(keuze.label) }} />
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Invulvraag */}
              {huidigeVraag.type === 'invul' && (
                <div>
                  <input
                    type="text"
                    value={gekozenAntwoord}
                    onChange={e => setGekozenAntwoord(e.target.value)}
                    disabled={antwoordStatus !== 'kies'}
                    onKeyDown={e => e.key === 'Enter' && antwoordStatus === 'kies' && verstuurAntwoord()}
                    placeholder="Jouw antwoord..."
                    className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Toon juist antwoord na feedback */}
            {antwoordStatus === 'feedback' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm font-medium text-blue-700">Juiste antwoord: </span>
                <span className="text-sm text-blue-800 font-mono" dangerouslySetInnerHTML={{ __html: renderKatex('$' + huidigeVraag.juist_antwoord + '$') }} />
              </div>
            )}
          </div>

            {/* Actieknoppen */}
            <div className="flex gap-3">
              {antwoordStatus === 'kies' && (
                <button
                  onClick={verstuurAntwoord}
                  disabled={!gekozenAntwoord}
                  className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                >
                  Antwoord controleren
                </button>
              )}
              {antwoordStatus === 'feedback' && (
                <button
                  onClick={volgendeVraag}
                  className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                  Volgende vraag →
                </button>
              )}
            </div>

            {/* Feedback */}
            {antwoordStatus === 'feedback' && huidigeVraag.uitleg_html && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-medium text-amber-800 mb-1">Uitleg:</p>
                <div
                  className="text-sm text-amber-700"
                  dangerouslySetInnerHTML={{ __html: renderKatex(huidigeVraag.uitleg_html) }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
