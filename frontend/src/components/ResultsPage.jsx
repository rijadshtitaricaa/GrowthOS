function ScoreRing({ score }) {
  const cls =
    score >= 70 ? 'score-good' : score >= 40 ? 'score-mid' : 'score-bad'
  const desc =
    score >= 70
      ? 'Strong foundation — optimize for scale.'
      : score >= 40
      ? 'Some critical improvements needed.'
      : 'Significant issues are blocking conversions.'

  return (
    <div className="score-wrap">
      <div className={`score-ring ${cls}`}>
        <span className="score-num">{score}</span>
        <span className="score-denom">/ 100</span>
      </div>
      <span className="score-label">Growth Score</span>
      <p className="score-desc">{desc}</p>
    </div>
  )
}

function SeverityPill({ severity }) {
  return (
    <span className={`severity-pill ${severity.toLowerCase()}`}>
      {severity}
    </span>
  )
}

function ImpactTag({ impact }) {
  return (
    <span className="fix-impact-tag">
      <span className={`impact-dot ${impact.toLowerCase()}`} />
      {impact} impact
    </span>
  )
}

export default function ResultsPage({ results, onReset, session }) {
  const { url, score, problems, fixes, rewrite } = results

  return (
    <div className="results-page fade-in">
      <header className="results-header">
        <button className="btn-back" onClick={onReset}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          New analysis
        </button>
        <div className="wordmark">Growth<span>OS</span></div>
        {session && (
          <span className="saved-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved
          </span>
        )}
      </header>

      {/* Score hero */}
      <div className="results-hero">
        <div className="results-url-label">{url}</div>
        <ScoreRing score={score} />
      </div>

      {/* Main content */}
      <div className="results-body">

        {/* Section 1 — Problems */}
        <section className="results-section">
          <div className="section-head">
            <div className="section-num">1</div>
            <h2 className="section-title">Why you&apos;re losing customers</h2>
          </div>
          <div className="problems-list">
            {problems.map((p, i) => (
              <div key={i} className="problem-card">
                <div className="problem-top">
                  <span className="problem-title">{p.title}</span>
                  <SeverityPill severity={p.severity} />
                </div>
                <p className="problem-explanation">{p.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Fixes */}
        <section className="results-section">
          <div className="section-head">
            <div className="section-num">2</div>
            <h2 className="section-title">Do this today</h2>
          </div>
          <div className="fixes-list">
            {fixes.map((f, i) => (
              <div key={i} className="fix-card">
                <div className="fix-num">{f.step}</div>
                <div className="fix-body">
                  <p className="fix-action">{f.action}</p>
                  <ImpactTag impact={f.impact} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — AI Rewrite */}
        <section className="results-section">
          <div className="section-head">
            <div className="section-num">3</div>
            <h2 className="section-title">AI-rewritten copy</h2>
          </div>
          <div className="rewrite-stack">
            <div className="rewrite-block is-headline">
              <div className="rewrite-label">New headline</div>
              <div className="rewrite-content">{rewrite.headline}</div>
            </div>
            <div className="rewrite-block is-cta">
              <div className="rewrite-label">New CTA</div>
              <div className="rewrite-content">{rewrite.cta}</div>
            </div>
            <div className="rewrite-block">
              <div className="rewrite-label">Value proposition</div>
              <div className="rewrite-content">{rewrite.value_proposition}</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
