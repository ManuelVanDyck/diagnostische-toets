import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [rol, setRol] = useState<string | null>(null)
  const [naam, setNaam] = useState('')

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
  }

  const handleLogout = async () => {
    localStorage.removeItem('diagnostische_toets_rol')
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Diagnostische Toets</h1>
            <p className="text-gray-500 text-sm">Welkom, {naam}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-600 transition">
            Afmelden
          </button>
        </div>

        {rol === 'leerkracht' ? (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/leerkracht')}
              className="w-full bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">📊 Leerkrachtendashboard</h2>
              <p className="text-gray-500 text-sm mt-1">
                Klasoverzicht, resultaten per gebied, export naar CSV
              </p>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            <button
              onClick={() => navigate('/toets/1')}
              className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">📐 Deel 1 — Rekenfundering</h2>
              <p className="text-gray-500 text-sm mt-1">
                Getallenkennis · Bewerkingen · Algebra · Vergelijkingen (±45 min)
              </p>
            </button>

            <button
              onClick={() => navigate('/toets/2')}
              className="bg-white rounded-2xl shadow-lg p-6 text-left hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">📏 Deel 2 — Toegepaste Wiskunde</h2>
              <p className="text-gray-500 text-sm mt-1">
                Functies · Meetkunde · Goniometrie & Pythagoras (±45 min)
              </p>
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Diagnostische Adaptieve Toets Wiskunde · Begin 4de jaar ASO
        </p>
      </div>
    </div>
  )
}
