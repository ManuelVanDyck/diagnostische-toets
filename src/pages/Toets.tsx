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
  id: string; gebied: string; niveau: number
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
    } else {
      isCorrect = gekozeneAntwoord.trim() === huidigeVraag.juist_antwoord.trim()
    }

    await supabase.from('antwoorden').insert({
      sessie_id: sessieId,
      vraag_id: huidigeVraag.id,
      gebied,
      gegeven_antwoord: gekozeneAntwoord,
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
                      else if (keuze.waarde === gekozeneAntwoord) knopKleur = 'border-red-400 bg-red-50'
                    } else if (keuze.waarde === gekozeneAntwoord) {
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
