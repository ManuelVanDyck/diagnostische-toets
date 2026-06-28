import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const SUBS = [
  { key: 'eigenschappen', naam: 'Eigenschappen van bewerkingen', icon: '🔄', desc: 'Commutativiteit, associativiteit, distributiviteit, neutraal en opslorpend element' },
  { key: 'volgorde', naam: 'Volgorde van bewerkingen', icon: '🔢', desc: 'Haakjes, machten, vermenigvuldigen/delen, optellen/aftrekken' },
  { key: 'machten', naam: 'Rekenen met machten', icon: '⬆️', desc: 'Rekenregels: product, quotiënt, macht van macht, negatieve exponenten' },
  { key: 'wortels', naam: 'Rekenen met vierkantswortels', icon: '√', desc: 'Vereenvoudigen, product- en quotiëntregel, bewerkingen met wortels' },
]

export default function GebiedBIntro() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)

  const startToets = async () => {
    setStarted(true)
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data } = await supabase
      .from('toets_sessies')
      .insert({ leerling_id: user.id, gebied: 'B' })
      .select()
      .single()

    if (data) navigate(`/toets/B?sub=0&sessie=${data.id}`)
  }

  if (started) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Toets starten...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Gebied B: Bewerkingen & Rekenregels</h1>
        <p className="text-gray-600 mb-6">
          In dit onderdeel testen we je kennis over <strong>eigenschappen van bewerkingen</strong>, 
          de <strong>volgorde van bewerkingen</strong>, <strong>rekenen met machten</strong> en 
          <strong>rekenen met vierkantswortels</strong>.
        </p>

        <div className="space-y-3 mb-6">
          {SUBS.map(s => (
            <div key={s.key} className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{s.naam}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Hoe werkt het?</span><br />
            Per onderdeel start je op niveau 1. Bij een correct antwoord ga je naar het volgende niveau.
            Bij een fout krijg je één herkansing. Twee keer fout op een niveau? Dan stopt dat onderdeel.
            Je krijgt dus <strong>minstens 4 vragen per niveau</strong> — één per onderdeel.
          </p>
        </div>

        <button
          onClick={startToets}
          className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium text-lg"
        >
          Start toets
        </button>
      </div>
    </div>
  )
}

export { SUBS }
