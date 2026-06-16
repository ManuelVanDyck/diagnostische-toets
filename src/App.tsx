import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Dashboard from './pages/Dashboard'
import Toets from './pages/Toets'
import Resultaat from './pages/Resultaat'
import LeerkrachtDashboard from './pages/LeerkrachtDashboard'

const ROL_KEY = 'diagnostische_toets_rol'

function AppContent() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        syncRol(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        syncRol(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Laden...</div>
  }

  if (!session) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/toets/:deel" element={<Toets />} />
      <Route path="/resultaat/:sessieId" element={<Resultaat />} />
      <Route path="/leerkracht" element={<LeerkrachtDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/** Na Google OAuth login: lees de gekozen rol uit localStorage en update de database */
async function syncRol(userId: string) {
  const rol = localStorage.getItem(ROL_KEY)
  if (!rol || (rol !== 'leerling' && rol !== 'leerkracht')) return

  try {
    // Check of er al een leerlingen-record is
    const { data } = await supabase
      .from('leerlingen')
      .select('rol')
      .eq('id', userId)
      .single()

    // Als het record nog de default 'leerling' heeft maar de gebruiker koos 'leerkracht'
    if (data && data.rol !== rol) {
      await supabase
        .from('leerlingen')
        .update({ rol })
        .eq('id', userId)
    }
  } catch {
    // Record bestaat mogelijk nog niet (trigger race condition)
    // Probeer opnieuw na korte vertraging
    setTimeout(() => syncRol(userId), 1000)
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
