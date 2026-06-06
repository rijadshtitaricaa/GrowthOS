import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import LoadingState from './components/LoadingState'
import ResultsPage from './components/ResultsPage'
import AuthModal from './components/AuthModal'
import Dashboard from './components/Dashboard'
import { supabase } from './lib/supabase'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [view, setView] = useState('landing')
  const [url, setUrl] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleAnalyze = async (inputUrl) => {
    setUrl(inputUrl)
    setError(null)
    setView('loading')
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`

      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: inputUrl }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Analysis failed. Please try again.')
      }

      const data = await res.json()
      setResults(data)
      setView('results')
    } catch (err) {
      setError(err.message)
      setView('landing')
    }
  }

  const handleReset = () => {
    setView('landing')
    setResults(null)
    setUrl('')
    setError(null)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setView('landing')
  }

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onAnalyze={handleAnalyze}
          error={error}
          session={session}
          onSignIn={() => setShowAuth(true)}
          onSignOut={handleSignOut}
          onDashboard={() => setView('dashboard')}
        />
      )}
      {view === 'loading' && <LoadingState url={url} />}
      {view === 'results' && results && (
        <ResultsPage results={results} onReset={handleReset} session={session} />
      )}
      {view === 'dashboard' && session && (
        <Dashboard session={session} onReset={handleReset} onAnalyze={handleAnalyze} />
      )}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(newSession) => { setSession(newSession); setShowAuth(false) }}
        />
      )}
    </>
  )
}
