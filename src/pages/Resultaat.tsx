import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const NIVEAU_KLEUREN: Record<number, { kleur: string; label: string; emoji: string }> = {
  0: { kleur: 'bg-red-100 text-red-800 border-red-300', label: 'Onvoldoende basis', emoji: '🔴' },
  1: { kleur: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Basis aanwezig, toepassing zwak', emoji: '🟠' },
  2: { kleur: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Voldoende, analyse ontbreekt', emoji: '🟡' },
  3: { kleur: 'bg-green-100 text-green-800 border-green-300', label: 'Goed tot gevorderd', emoji: '🟢' },
}

const GEBIED_NAMEN: Record<string, string> = {
  A: 'Getallenkennis & verzamelingen',
  B: 'Bewerkingen & rekenregels',
  C: 'Algebraïsche uitdrukkingen',
  D: 'Vergelijkingen & ongelijkheden',
  E: 'Functies',
  F: 'Meetkundige formules',
  G: 'Goniometrie & Pythagoras',
}

interface GebiedResultaat {
  gebied: string
  beheersingsniveau: number
  aantal_vragen: number
  aantal_correct: number
}

export default function Resultaat() {
  const { sessieId } = useParams<{ sessieId: string }>()
  const navigate = useNavigate()
  const [resultaten, setResultaten] = useState<GebiedResultaat[]>([])
  const [deel, setDeel] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    laadResultaten()
  }, [sessieId])

  const laadResultaten = async () => {
    if (!sessieId) return

    // Sessiegegevens
    const { data: sessie } = await supabase
      .from('toets_sessies')
      .select('deel')
      .eq('id', sessieId)
      .single()

    if (sessie) setDeel(sessie.deel)

    // Resultaten per gebied
    const { data } = await supabase
      .from('resultaten')
      .select('*')
      .eq('sessie_id', sessieId)
      .order('gebied')

    if (data) setResultaten(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Resultaten laden...</div>
  }

  const gemiddeld = resultaten.length > 0
    ? Math.round(resultaten.reduce((s, r) => s + r.beheersingsniveau, 0) / resultaten.length * 10) / 10
    : 0

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Jouw resultaat</h1>
        <p className="text-gray-500 mb-6">
          Deel {deel}: {deel === 1 ? 'Rekenfundering' : 'Toegepaste Wiskunde'}
        </p>

        {/* Overzicht */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Gemiddeld niveau</span>
            <span className="text-2xl font-bold text-indigo-600">{gemiddeld}/3</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${(gemiddeld / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Per gebied */}
        <div className="space-y-3 mb-6">
          {resultaten.map(r => {
            const info = NIVEAU_KLEUREN[r.beheersingsniveau]
            return (
              <div
                key={r.gebied}
                className={`rounded-xl border p-4 ${info.kleur}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-sm">
                      Gebied {r.gebied}: {GEBIED_NAMEN[r.gebied]}
                    </span>
                  </div>
                  <span className="text-2xl">{info.emoji}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Niveau {r.beheersingsniveau} — {info.label}</span>
                  <span>{r.aantal_correct}/{r.aantal_vragen} correct</span>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
        >
          Terug naar start
        </button>
      </div>
    </div>
  )
}
