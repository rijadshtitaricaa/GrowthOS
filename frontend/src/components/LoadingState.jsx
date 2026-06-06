import { useEffect, useState } from 'react'

const STEPS = [
  'Fetching website content',
  'Parsing page structure',
  'Running conversion analysis',
  'Generating growth fixes',
]

export default function LoadingState({ url }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="loading-page fade-in">
      <div className="loading-wordmark">
        Growth<span>OS</span>
      </div>

      <div className="spinner" />

      <div className="loading-text-group">
        <p className="loading-title">
          Analyzing your website for growth opportunities...
        </p>
        {url && <div className="loading-url">{url}</div>}
      </div>

      <div className="loading-steps">
        {STEPS.map((step, i) => {
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending'
          return (
            <div
              key={step}
              className="loading-step"
              style={{
                color:
                  state === 'pending'
                    ? 'var(--text-muted)'
                    : 'var(--text-primary)',
              }}
            >
              <span className={`step-indicator ${state}`} />
              {step}
            </div>
          )
        })}
      </div>
    </div>
  )
}
