import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export default function Login() {
  const [rol, setRol] = useState<'leerling' | 'leerkracht' | null>(null)

  if (!rol) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Diagnostische Toets Wiskunde
          </h1>
          <p className="text-gray-500 mb-8">Begin 4de jaar — Wat weet je nog?</p>
          <p className="text-gray-600 mb-4">Ik ben...</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setRol('leerling')}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
            >
              🎓 Leerling
            </button>
            <button
              onClick={() => setRol('leerkracht')}
              className="w-full py-3 px-6 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
            >
              📊 Leerkracht
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <p className="text-center text-sm text-gray-500 mb-4">
          Je meldt je aan als <strong>{rol}</strong>
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          onlyThirdPartyProviders
          redirectTo={window.location.origin}
        />
        <button
          onClick={() => setRol(null)}
          className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600"
        >
          ← Andere rol kiezen
        </button>
      </div>
    </div>
  )
}
