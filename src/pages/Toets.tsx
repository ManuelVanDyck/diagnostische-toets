import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { renderKatex, formatTijd } from '../lib/katex-utils'

// 7 gebieden per deel
const GEBIEDEN_DEEL1 = ['A', 'B', 'C', 'D']
const GEBIEDEN_DEEL2 = ['E', 'F', 'G']

interface Vraag {
  id: string
  gebied: string
  niveau: number
  type: 'meerkeuze' | 'invul' | 'meerkeuze_meervoudig'
  vraag_html: string
  keuzes_json: { label: string; waarde: string }[] | null
  juist_antwoord: string
  tolerantie: number | null
  uitleg_html: string | null
}

interface GebiedStatus {
  gebied: string
  status: 'open' | 'bezig' | 'afgerond'
  niveau?: number
}

export default function Toets() {
  const { deel } = useParams<{ deel: string }>()
  const navigate = useNavigate()
  const deelNr = parseInt(deel || '1')

  const gebieden = deelNr === 1 ? GEBIEDEN_DEEL1 : GEBIEDEN_DEEL2

  // State
  const [sessieId, setSessieId] = useState<string | null>(null)
  const [actiefGebied, setActiefGebied] = useState<string | null>(null)
  const [huidigeVraag, setHuidigeVraag] = useState<Vraag | null>(null)
  const [gekozenAntwoord, setGekozenAntwoord] = useState<string>('')
  const [antwoordStatus, setAntwoordStatus] = useState<'kies' | 'bevestigd' | 'feedback'>('kies')
  const [gebiedStatussen, setGebiedStatussen] = useState<GebiedStatus[]>(
    gebieden.map(g => ({ gebied: g, status: 'open' }))
  )
  const [stap, setStap] = useState(1)
  const [tijd, setTijd] = useState(0)
  const [toetsStart, setToetsStart] = useState(false)

  // Timer
  useEffect(() => {
    if (!toetsStart) return
    const interval = setInterval(() => setTijd(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [toetsStart])

  // Sessie starten
  const startSessie = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data } = await supabase
      .from('toets_sessies')
      .insert({ leerling_id: user.id, deel: deelNr })
      .select()
      .single()

    if (data) {
      setSessieId(data.id)
      setToetsStart(true)
      // Start met eerste open gebied
      const eerste = gebieden[0]
      setActiefGebied(eerste)
      laadVolgendeVraag(data.id, eerste)
    }
  }

  // Volgende vraag laden via Supabase functie
  const laadVolgendeVraag = async (sid: string, gebied: string) => {
    const { data } = await supabase
      .rpc('volgende_vraag', { p_sessie_id: sid, p_gebied: gebied })

    if (!data) {
      // Gebied afgerond
      voltooiGebied(gebied)
      return
    }

    // Haal volledige vraag op
    const { data: vraag } = await supabase
      .from('vragen')
      .select('*')
      .eq('id', data)
      .single()

    if (vraag) {
      setHuidigeVraag(vraag)
      setGekozenAntwoord('')
      setAntwoordStatus('kies')
    }
  }

  // Antwoord insturen
  const verstuurAntwoord = async () => {
    if (!sessieId || !huidigeVraag || !actiefGebied) return

    // Bepaal of antwoord correct is
    let isCorrect = false
    if (huidigeVraag.type === 'invul') {
      const tolerantie = huidigeVraag.tolerantie || 0.001
      const gegeven = parseFloat(gekozenAntwoord.replace(',', '.'))
      const juist = parseFloat(huidigeVraag.juist_antwoord)
      isCorrect = !isNaN(gegeven) && !isNaN(juist) && Math.abs(gegeven - juist) <= tolerantie
    } else {
      isCorrect = gekozeneAntwoord === huidigeVraag.juist_antwoord
    }

    // Sla antwoord op
    await supabase.from('antwoorden').insert({
      sessie_id: sessieId,
      vraag_id: huidigeVraag.id,
      gebied: actiefGebied,
      gegeven_antwoord: gekozeneAntwoord,
      is_correct: isCorrect,
      stap,
    })

    setAntwoordStatus('feedback')
  }

  // Volgende vraag of gebied afronden
  const volgendeVraag = async () => {
    if (!sessieId || !actiefGebied) return

    setStap(s => s + 1)
    await laadVolgendeVraag(sessieId, actiefGebied)
  }

  // Gebied voltooien
  const voltooiGebied = async (gebied: string) => {
    // Bereken beheersingsniveau
    const { data } = await supabase
      .rpc('bereken_beheersingsniveau', { p_sessie_id: sessieId, p_gebied: gebied })

    const niveau = data || 0

    // Update status
    setGebiedStatussen(prev =>
      prev.map(g => g.gebied === gebied ? { ...g, status: 'afgerond', niveau } : g)
    )
    setHuidigeVraag(null)
    setStap(1)

    // Ga naar volgende open gebied
    const volgende = gebieden.find(g => {
      const gs = gebiedStatussen.find(s => s.gebied === g)
      return gs && gs.status === 'open' && g !== gebied
    })

    if (volgende) {
      setActiefGebied(volgende)
      laadVolgendeVraag(sessieId!, volgende)
    } else {
      // Alle gebieden afgerond
      setActiefGebied(null)
      navigate(`/resultaat/${sessieId}`)
    }
  }

  // Startscherm
  if (!toetsStart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Deel {deel}: {deelNr === 1 ? 'Rekenfundering' : 'Toegepaste Wiskunde'}
          </h1>
          <p className="text-gray-500 mb-6">
            {deelNr === 1 ? 'Getallenkennis · Bewerkingen · Algebra · Vergelijkingen' :
             'Functies · Meetkunde · Goniometrie & Pythagoras'}
          </p>
          <p className="text-gray-600 mb-2">± 45 minuten</p>
          <p className="text-gray-400 text-sm mb-6">
            {gebieden.length} gebieden · max ±{gebieden.length * 3} vragen
          </p>
          <button
            onClick={startSessie}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium text-lg"
          >
            Start toets
          </button>
        </div>
      </div>
    )
  }

  // Gebiedenselectie (tussen vragen door)
  if (!actiefGebied && !huidigeVraag) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Toets afgerond!</h1>
          <button
            onClick={() => navigate(`/resultaat/${sessieId}`)}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
          >
            Bekijk je resultaat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Top bar */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Deel {deelNr}
            </span>
            <div className="flex gap-1">
              {gebiedStatussen.map(g => (
                <div
                  key={g.gebied}
                  className={`w-3 h-3 rounded-full ${
                    g.status === 'afgerond' ? 'bg-green-500' :
                    g.status === 'bezig' ? 'bg-indigo-500 animate-pulse' :
                    'bg-gray-300'
                  }`}
                  title={`Gebied ${g.gebied}: ${g.status}`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm font-mono text-gray-600">
            ⏱ {formatTijd(tijd)}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <span className="text-xs text-gray-400 font-medium">Gebied {actiefGebied}</span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="text-xs text-gray-400">Vraag {stap}</span>
        </div>
      </div>

      {/* Vraag */}
      {huidigeVraag && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <div
              className="prose max-w-none text-gray-800 mb-6 text-lg"
              dangerouslySetInnerHTML={{ __html: renderKatex(huidigeVraag.vraag_html) }}
            />

            {/* Antwoordopties */}
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
                      <span
                        className="font-medium"
                        dangerouslySetInnerHTML={{ __html: renderKatex(keuze.label) }}
                      />
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
                  placeholder="Jouw antwoord..."
                  className={`w-full p-4 text-lg rounded-xl border-2 transition ${
                    antwoordStatus === 'feedback'
                      ? gekozeneAntwoord === huidigeVraag.juist_antwoord
                        ? 'border-green-400 bg-green-50'
                        : 'border-red-400 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {antwoordStatus === 'feedback' && (
                  <p className="mt-2 text-sm text-gray-500">
                    Juiste antwoord: <strong dangerouslySetInnerHTML={{ __html: renderKatex(huidigeVraag.juist_antwoord) }} />
                  </p>
                )}
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
        </div>
      )}
    </div>
  )
}
