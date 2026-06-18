import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { GEBIED_FEEDBACK } from '../lib/feedback'

const NIVEAU_INFO: Record<number, { kleur: string; label: string; emoji: string; advies: string }> = {
  0: { kleur: 'bg-red-50 text-red-800 border-red-300', label: 'Onvoldoende basis', emoji: '🔴', advies: 'Begin met de basisoefeningen uit jaar 1.' },
  1: { kleur: 'bg-orange-50 text-orange-800 border-orange-300', label: 'Basisbegrip aanwezig', emoji: '🟠', advies: 'Je herkent de basisbegrippen. Oefen op eenvoudige toepassingen.' },
  2: { kleur: 'bg-amber-50 text-amber-800 border-amber-300', label: 'Eenvoudige toepassing', emoji: '🟡', advies: 'Je kunt eenvoudige opgaven maken. Bouw verder aan standaardprocedures.' },
  3: { kleur: 'bg-lime-50 text-lime-800 border-lime-300', label: 'Standaard toepassing', emoji: '🟢', advies: 'Je beheerst de standaardbewerkingen. Werk aan complexere opgaven.' },
  4: { kleur: 'bg-emerald-50 text-emerald-800 border-emerald-300', label: 'Analyse & combinatie', emoji: '🔵', advies: 'Je kunt verbanden leggen en meerdere stappen combineren. Uitstekend!' },
  5: { kleur: 'bg-indigo-50 text-indigo-800 border-indigo-300', label: 'Inzicht & redeneren', emoji: '🟣', advies: 'Je hebt diep inzicht en kunt zelfstandig redeneren. Topniveau!' },
}

const GEBIED_NAMEN: Record<string, string> = {
  A: 'Getallenkennis & verzamelingen', B: 'Bewerkingen & rekenregels',
  C: 'Algebraïsche uitdrukkingen', D: 'Vergelijkingen & ongelijkheden',
  E: 'Functies', F: 'Meetkundige formules', G: 'Goniometrie & Pythagoras',
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
  const [resultaat, setResultaat] = useState<GebiedResultaat | null>(null)
  const [gebied, setGebied] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    laadResultaat()
  }, [sessieId])

  const laadResultaat = async () => {
    if (!sessieId) return

    // Sessie ophalen voor gebied-naam
    const { data: sessie } = await supabase
      .from('toets_sessies')
      .select('gebied')
      .eq('id', sessieId)
      .single()

    if (sessie) setGebied(sessie.gebied)

    // Resultaat ophalen
    const { data } = await supabase
      .from('resultaten')
      .select('*')
      .eq('sessie_id', sessieId)
      .single()

    if (data) setResultaat(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Resultaat laden...</div>
  }

  if (!resultaat) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Geen resultaat gevonden voor deze sessie.</p>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Terug naar start
          </button>
        </div>
      </div>
    )
  }

  const info = NIVEAU_INFO[resultaat.beheersingsniveau]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Jouw resultaat</h1>
        <p className="text-gray-500 mb-6">
          Gebied {gebied}: {GEBIED_NAMEN[gebied] || ''}
        </p>

        {/* Niveau indicator */}
        <div className={`rounded-2xl border-2 p-6 mb-6 ${info.kleur} text-center`}>
          <span className="text-5xl mb-2 block">{info.emoji}</span>
          <p className="text-2xl font-bold">Niveau {resultaat.beheersingsniveau}/5</p>
          <p className="text-sm mt-1">{info.label}</p>
          <p className="text-xs mt-2 opacity-75">{info.advies}</p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Vragen beantwoord</span>
            <span className="font-bold text-gray-800">{resultaat.aantal_vragen}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Vragen correct</span>
            <span className="font-bold text-green-600">{resultaat.aantal_correct}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${(resultaat.aantal_correct / Math.max(resultaat.aantal_vragen, 1)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {Math.round((resultaat.aantal_correct / Math.max(resultaat.aantal_vragen, 1)) * 100)}% correct
          </p>
        </div>

        {/* Gedetailleerde feedback */}
        {gebied && GEBIED_FEEDBACK[gebied]?.[resultaat.beheersingsniveau] && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Feedback</h3>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg mt-0.5">✅</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Wat je al kan:</p>
                <p className="text-sm text-gray-600">{GEBIED_FEEDBACK[gebied][resultaat.beheersingsniveau].kan}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-lg mt-0.5">📋</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Wat je beheerst:</p>
                <p className="text-sm text-gray-600">{GEBIED_FEEDBACK[gebied][resultaat.beheersingsniveau].beheerst}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-lg mt-0.5">🎯</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Waar je nog aan kan werken:</p>
                <p className="text-sm text-gray-600">{GEBIED_FEEDBACK[gebied][resultaat.beheersingsniveau].werk_aan}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
        >
          Terug naar overzicht
        </button>
      </div>
    </div>
  )
}
