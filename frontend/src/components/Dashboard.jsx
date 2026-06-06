import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function ScoreBadge({ score }) {
  const cls = score >= 70 ? 'good' : score >= 40 ? 'mid' : 'bad'
  return <span className={`dash-score ${cls}`}>{score}</span>
}

export default function Dashboard({ session, onReset, onAnalyze }) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const fetchAnalyses = async () => {
      setLoading(true)
      setFetchError(null)
      console.log('[Dashboard] fetching for user_id:', session.user.id)
      const { data, error } = await supabase
        .from('analyses')
        .select('id, url, score, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      console.log('[Dashboard] result:', { data, error })
      if (error) setFetchError(error.message)
      if (data) setAnalyses(data)
      setLoading(false)
    }
    fetchAnalyses()
  }, [session])

  const fmt = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const domain = (url) => {
    try { return new URL(url).hostname.replace('www.', '') }
    catch { return url }
  }

  return (
    <div className="results-page fade-in">
      <header className="results-header">
        <button className="btn-back" onClick={onReset}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <div className="wordmark">Growth<span>OS</span></div>
        <button className="btn-primary" onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Analysis
        </button>
      </header>

      <div className="dash-body">
        <div className="dash-meta">
          <h1 className="dash-title">Your Analyses</h1>
          <p className="dash-email">{session.user.email}</p>
        </div>

        {loading && (
          <div className="dash-state">Loading your analyses...</div>
        )}

        {!loading && fetchError && (
          <div className="dash-state" style={{ color: 'var(--high)' }}>
            Error: {fetchError}
          </div>
        )}

        {!loading && !fetchError && analyses.length === 0 && (
          <div className="dash-state">
            <p>No analyses saved yet.</p>
            <button className="btn-primary" onClick={onReset} style={{ marginTop: 16 }}>
              Analyze Your First Website
            </button>
          </div>
        )}

        {!loading && analyses.length > 0 && (
          <div className="dash-list">
            {analyses.map((a) => (
              <div key={a.id} className="dash-card">
                <ScoreBadge score={a.score} />
                <div className="dash-card-info">
                  <span className="dash-card-domain">{domain(a.url)}</span>
                  <span className="dash-card-url">{a.url}</span>
                  <span className="dash-card-date">{fmt(a.created_at)}</span>
                </div>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 12, padding: '6px 14px', marginLeft: 'auto', flexShrink: 0 }}
                  onClick={() => onAnalyze(a.url)}
                >
                  Analyze again
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
