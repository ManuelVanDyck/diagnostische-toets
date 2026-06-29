import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const GEBIEDEN = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const GEBIED_INFO: Record<string, { naam: string; icon: string; kleur: string }> = {
  A: { naam: 'Getallenkennis & verzamelingen', icon: '🔢', kleur: 'border-l-indigo-500' },
  B: { naam: 'Bewerkingen & rekenregels', icon: '➕', kleur: 'border-l-blue-500' },
  C: { naam: 'Algebraïsche uitdrukkingen', icon: '📐', kleur: 'border-l-emerald-500' },
  D: { naam: 'Vergelijkingen & ongelijkheden', icon: '⚖️', kleur: 'border-l-amber-500' },
  E: { naam: 'Functies', icon: '📈', kleur: 'border-l-purple-500' },
  F: { naam: 'Meetkundige formules', icon: '📏', kleur: 'border-l-rose-500' },
  G: { naam: 'Goniometrie & Pythagoras', icon: '📐', kleur: 'border-l-teal-500' },
}

interface Voortgang {
  gebied: string
  status: 'niet_gestart' | 'bezig' | 'afgerond'
  niveau?: number
  sessie_id?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [rol, setRol] = useState<string | null>(null)
  const [naam, setNaam] = useState('')
  const [voortgang, setVoortgang] = useState<Voortgang[]>(
    GEBIEDEN.map(g => ({ gebied: g, status: 'niet_gestart' }))
  )

  useEffect(() => {
    laadProfiel()
  }, [])

  const laadProfiel = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data } = await supabase
      .from('leerlingen')
      .select('rol, voornaam, naam')
      .eq('id', user.id)
      .single()

    if (data) {
      setRol(data.rol)
      setNaam(data.voornaam)
    }

    // Haal bestaande sessies en resultaten op
    if (data?.rol === 'leerling') {
      const { data: sessies } = await supabase
        .from('toets_sessies')
        .select('id, gebied, status')
        .eq('leerling_id', user.id)

      const { data: resultaten } = await supabase
        .from('resultaten')
        .select('gebied, beheersingsniveau')
        .eq('leerling_id', user.id)

      setVoortgang(GEBIEDEN.map(g => {
        const sessie = sessies?.find(s => s.gebied === g)
        const resultaat = resultaten?.find(r => r.gebied === g)
        return {
          gebied: g,
          status: resultaat ? 'afgerond' : sessie ? 'bezig' : 'niet_gestart',
          niveau: resultaat?.beheersingsniveau,
          sessie_id: sessie?.id,
        }
      }))
    }
  }

  const startToets = async (gebied: string) => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    // Gebied B heeft een aparte sub-gebied flow
    if (gebied === 'B') {
      const { data: afgerond } = await supabase
        .from('toets_sessies')
        .select('id')
        .eq('leerling_id', user.id)
        .eq('gebied', 'B')
        .eq('status', 'afgerond')
        .order('gestart_op', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (afgerond) {
        navigate(`/toets/B?sessie=${afgerond.id}`)
        return
      }
      navigate('/gebied-b')
      return
    }

    // Check of er al een actieve sessie is
    const { data: bestaand } = await supabase
      .from('toets_sessies')
      .select('id')
      .eq('leerling_id', user.id)
      .eq('gebied', gebied)
      .eq('status', 'bezig')
      .single()

    if (bestaand) {
      navigate(`/toets/${gebied}?sessie=${bestaand.id}`)
      return
    }

    // Nieuwe sessie
    const { data: nieuw } = await supabase
      .from('toets_sessies')
      .insert({ leerling_id: user.id, gebied })
      .select()
      .single()

    if (nieuw) {
      navigate(`/toets/${gebied}?sessie=${nieuw.id}`)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('diagnostische_toets_rol')
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Diagnostische Toets</h1>
            <p className="text-gray-500 text-sm">Welkom, {naam}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-600 transition">
            Afmelden
          </button>
        </div>

        {rol === 'leerkracht' ? (
          <button
            onClick={() => navigate('/leerkracht')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">📊 Leerkrachtendashboard</h2>
            <p className="text-gray-500 text-sm mt-1">Klasoverzicht, resultaten per gebied, export</p>
          </button>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">
              Kies een gebied om te starten. Je kunt de toetsen in elke volgorde maken — thuis of op school.
            </p>
            <div className="grid gap-3">
              {voortgang.map(v => {
                const info = GEBIED_INFO[v.gebied]
                const NIVEAU_KLEUR: Record<number, string> = {
                  0: 'bg-red-100 text-red-700', 1: 'bg-orange-100 text-orange-700',
                  2: 'bg-amber-100 text-amber-700', 3: 'bg-lime-100 text-lime-700',
                  4: 'bg-emerald-100 text-emerald-700', 5: 'bg-indigo-100 text-indigo-700'
                }
                return (
                  <button
                    key={v.gebied}
                    onClick={() => startToets(v.gebied)}
                    className={`bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition border-l-4 ${info.kleur} flex items-center justify-between`}
                  >
                    <div>
                      <span className="text-xl mr-2">{info.icon}</span>
                      <span className="font-medium text-gray-800">
                        Gebied {v.gebied}: {info.naam}
                      </span>
                    </div>
                    <div>
                      {v.status === 'afgerond' && v.niveau !== undefined && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${NIVEAU_KLEUR[v.niveau]}`}>
                          Niveau {v.niveau}/5
                        </span>
                      )}
                      {v.status === 'bezig' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">
                          Bezig
                        </span>
                      )}
                      {v.status === 'niet_gestart' && (
                        <span className="text-xs text-gray-400">Start →</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Diagnostische Adaptieve Toets Wiskunde · Begin 4de jaar ASO
        </p>
      </div>
    </div>
  )
}
