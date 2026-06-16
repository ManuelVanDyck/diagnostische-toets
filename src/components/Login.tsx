import { supabase } from '../lib/supabase'
import { useState } from 'react'

const ROL_KEY = 'diagnostische_toets_rol'

export default function Login() {
  const [rol, setRol] = useState<'leerling' | 'leerkracht' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    if (!rol) return
    setLoading(true)
    setError(null)

    // Rol bewaren in localStorage — overleeft de OAuth redirect
    localStorage.setItem(ROL_KEY, rol)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      })
      if (error) throw error
    } catch (e: any) {
      localStorage.removeItem(ROL_KEY)
      setError(e.message || 'Aanmelden mislukt')
      setLoading(false)
    }
  }

  if (!rol) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Diagnostische Toets
          </h1>
          <h2 className="text-xl text-indigo-600 font-medium mb-2">Wiskunde</h2>
          <p className="text-gray-500 mb-8">Begin 4de jaar — Wat weet je nog?</p>

          <p className="text-gray-600 mb-4">Ik ben...</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setRol('leerling')}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-lg"
            >
              🎓 Leerling
            </button>
            <button
              onClick={() => setRol('leerkracht')}
              className="w-full py-3 px-6 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium text-lg"
            >
              📊 Leerkracht
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <p className="text-gray-500 mb-6">
          Je meldt je aan als <strong className="text-gray-800">{rol}</strong>
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition flex items-center justify-center gap-3 font-medium disabled:opacity-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? 'Even geduld...' : 'Aanmelden met Google'}
        </button>

        <button
          onClick={() => { setRol(null); setError(null) }}
          className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← Andere rol kiezen
        </button>
      </div>
    </div>
  )
}
