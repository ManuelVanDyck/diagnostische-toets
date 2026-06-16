import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Diagnostische Toets</h1>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">
            Afmelden
          </button>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => navigate('/toets/1')}
            className="bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">📐 Deel 1 — Rekenfundering</h2>
            <p className="text-gray-500 text-sm mt-1">
              Getallenkennis · Bewerkingen · Algebra · Vergelijkingen (±45 min)
            </p>
          </button>

          <button
            onClick={() => navigate('/toets/2')}
            className="bg-white rounded-xl shadow p-6 text-left hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">📏 Deel 2 — Toegepaste Wiskunde</h2>
            <p className="text-gray-500 text-sm mt-1">
              Functies · Meetkunde · Goniometrie & Pythagoras (±45 min)
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
