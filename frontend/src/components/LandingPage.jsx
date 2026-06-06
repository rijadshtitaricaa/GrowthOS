import { useState } from 'react'

// ── Icon helpers ──────────────────────────────────────────────
const Icon = ({ d, d2, circle, type = 'path' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {circle && <circle cx={circle[0]} cy={circle[1]} r={circle[2]} />}
    {d && <path d={d} />}
    {d2 && <path d={d2} />}
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ChevronDown = ({ open }) => (
  <svg className={`faq-chevron${open ? ' open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// ── Data ──────────────────────────────────────────────────────
const FEATURES = [
  { icon: <Icon d="M3 3v18h18" d2="m19 9-5 5-4-4-3 3" />, title: 'Website Conversion Analysis', desc: 'Deep analysis of your messaging, structure, and UX to find exactly what is stopping visitors from converting.' },
  { icon: <Icon d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />, title: 'Growth Opportunity Detection', desc: 'Surfaces revenue opportunities you are leaving on the table — from pricing page gaps to missed upsell moments.' },
  { icon: <Icon d="M12 20h9" d2="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />, title: 'AI Landing Page Rewrite', desc: 'Get a rewritten headline, CTA, and value proposition crafted to convert your specific audience.' },
  { icon: <Icon d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />, title: 'Conversion Score', desc: 'A clear 0–100 growth score tells you at a glance how conversion-ready your website really is.' },
  { icon: <Icon d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />, title: 'Competitor Insights', desc: 'Understand what high-converting sites in your category do differently and how to close the gap.' },
  { icon: <Icon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />, title: 'Actionable Growth Plan', desc: 'Prioritized, specific action steps ordered by revenue impact — not vague advice, but real tasks.' },
]

const STEPS = [
  { n: '01', title: 'Paste Your Website URL', desc: 'Enter any public website URL. No install, no tracking code, no technical setup required.' },
  { n: '02', title: 'AI Analyzes Your Content', desc: 'GrowthOS scans your headlines, CTAs, structure, messaging, and trust signals in seconds.' },
  { n: '03', title: 'Conversion Problems Found', desc: 'Specific issues are identified and ranked by their impact on your revenue and conversion rate.' },
  { n: '04', title: 'Receive Growth Recommendations', desc: 'Concrete, prioritized fixes delivered in plain language. Each action is tied to a business outcome.' },
  { n: '05', title: 'Implement the Fixes', desc: 'Take the rewritten copy and fix list directly to your site. No interpretation needed.' },
  { n: '06', title: 'Watch Conversions Increase', desc: 'Fixes based on proven conversion principles that have been validated across thousands of sites.' },
]

const PERSONAS = [
  { icon: <Icon d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" d2="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />, title: 'SaaS Founders', desc: 'Stop guessing why your trial-to-paid rate is low. Find the messaging gaps killing your funnel.' },
  { icon: <Icon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />, title: 'Startups', desc: 'Validate your positioning and fix conversion issues before spending money on paid acquisition.' },
  { icon: <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" circle={[9, 7, 4]} />, title: 'Agencies', desc: 'Deliver instant, data-backed conversion audits to clients in minutes instead of days.' },
  { icon: <Icon d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" d2="M12 8v4l3 3" />, title: 'Freelancers', desc: 'Audit your own portfolio site or offer conversion analysis as a premium service to clients.' },
  { icon: <Icon d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" d2="M3 6h18M16 10a4 4 0 0 1-8 0" />, title: 'E-commerce Stores', desc: 'Identify why shoppers are not completing purchases and fix the messaging that causes drop-off.' },
  { icon: <Icon d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" d2="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5zM3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14zM14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H15.5c-.83 0-1.5-.67-1.5-1.5zM15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11H8.5c.83 0 1.5-.67 1.5-1.5zM8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />, title: 'Indie Hackers', desc: 'Get the same conversion insight that growth teams at funded companies pay consultants $500/hr for.' },
]

const PRICING = [
  {
    plan: 'Starter', price: '29', desc: 'For founders and solo builders who want to understand their conversion baseline.',
    features: ['5 website analyses per month', 'Full conversion report', 'Growth score', 'Problem identification', 'Basic fix recommendations'],
    btn: 'Get started', featured: false,
  },
  {
    plan: 'Growth', price: '79', desc: 'For teams actively optimizing their website to scale revenue. Most popular.',
    features: ['25 website analyses per month', 'Full conversion report', 'AI landing page rewrite', 'Competitor insights', 'Priority support', 'Export reports as PDF'],
    btn: 'Start free trial', featured: true,
  },
  {
    plan: 'Pro', price: '149', desc: 'For agencies and teams that need volume, white-label reports, and API access.',
    features: ['Unlimited analyses', 'White-label reports', 'API access', 'Custom branding', 'Team seats (up to 10)', 'Dedicated support'],
    btn: 'Contact sales', featured: false,
  },
]

const FAQS = [
  { q: 'How does GrowthOS work?', a: 'GrowthOS fetches your website, analyzes the content, messaging, structure, and key conversion elements, then sends this data to an AI model trained on conversion best practices. The AI returns a structured report with a growth score, specific problems, prioritized fixes, and rewritten copy.' },
  { q: 'Does it use AI?', a: 'Yes. GrowthOS uses a large language model (LLM) acting as a world-class growth consultant. It is prompted to be direct, specific, and non-generic — every finding references something it actually found on your website.' },
  { q: 'Can I analyze any website?', a: 'You can analyze any publicly accessible website. Private pages behind a login, password-protected sites, or local development URLs are not supported. If a site blocks automated access, the analysis may fail.' },
  { q: 'How accurate are the recommendations?', a: 'The recommendations are based on established conversion rate optimization principles applied specifically to your site\'s content. They are directionally correct and actionable, though results will vary depending on your audience and industry.' },
  { q: 'Do I need technical knowledge to use it?', a: 'No. You paste a URL and receive a plain-language report. The fixes are written for founders and marketers, not developers. No code, no integrations, no setup required.' },
  { q: 'How long does the analysis take?', a: 'Most analyses complete in 20–40 seconds, depending on the website size and server response time.' },
  { q: 'Can I analyze competitors\' websites?', a: 'Yes. You can analyze any public website — including competitors. This is useful for understanding why their site converts better than yours and identifying gaps in your own positioning.' },
  { q: 'Is my data private?', a: 'Your analysis results are stored securely and are only accessible to you. We do not share individual reports with third parties. See our Privacy Policy for full details.' },
]

// ── Sub-components ────────────────────────────────────────────
function UrlForm({ onAnalyze, error }) {
  const [inputUrl, setInputUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = inputUrl.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    await onAnalyze(trimmed)
    setIsSubmitting(false)
  }

  return (
    <>
      <form className="url-form" onSubmit={handleSubmit} style={{ margin: 0 }}>
        <div className="url-input-row">
          <input
            className="url-input"
            type="text"
            placeholder="https://yourwebsite.com"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={isSubmitting}
            autoComplete="off"
            spellCheck="false"
          />
          <button className="btn-primary" type="submit" disabled={isSubmitting || !inputUrl.trim()}>
            {isSubmitting ? 'Starting...' : 'Analyze My Website'}
            {!isSubmitting && <ArrowRight />}
          </button>
        </div>
      </form>
      {error && (
        <div className="error-banner" style={{ marginTop: 12 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </>
  )
}

function HeroMockup() {
  return (
    <div className="hero-mockup-wrap">
      <div className="mockup-window">
        <div className="mockup-titlebar">
          <span className="tb-dot r" /><span className="tb-dot y" /><span className="tb-dot g" />
          <span className="mockup-urlbar">growthos.app/report/acme-corp</span>
        </div>
        <div className="mockup-body">
          <div className="mockup-meta-row">
            <span className="mockup-domain">acmecorp.com</span>
            <span className="mockup-score-val">42<span> / 100</span></span>
          </div>
          <div className="mockup-sub-title">Problems Found</div>
          <div className="mockup-row"><span className="md h" />Headline does not state what the product does</div>
          <div className="mockup-row"><span className="md m" />CTA says &ldquo;Get Started&rdquo; — no outcome communicated</div>
          <div className="mockup-row"><span className="md l" />No social proof or customer logos visible</div>
          <div className="mockup-sub-title">Recommended Fixes</div>
          <div className="mockup-row"><span className="mockup-fix-no">1</span>Rewrite H1 to focus on the customer outcome</div>
          <div className="mockup-row"><span className="mockup-fix-no">2</span>Change CTA to &ldquo;Start collecting payments free&rdquo;</div>
          <div className="mockup-row"><span className="mockup-fix-no">3</span>Add 3 customer logos directly below the hero</div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function LandingPage({ onAnalyze, error, session, onSignIn, onSignOut, onDashboard }) {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="landing">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="wordmark">Growth<span>OS</span></div>
        <div className="navbar-center">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </div>
        <div className="navbar-right">
          {session ? (
            <>
              <button className="btn-ghost" onClick={onDashboard} style={{ fontSize: 13 }}>My Analyses</button>
              <div className="nav-avatar" title={session.user.email}>
                {session.user.email[0].toUpperCase()}
              </div>
              <button className="btn-ghost" onClick={onSignOut} style={{ fontSize: 13 }}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={onSignIn} style={{ fontSize: 13 }}>Sign In</button>
              <button className="btn-primary" onClick={onSignIn} style={{ padding: '8px 16px', fontSize: 13 }}>
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        <div className="hero-split fade-in">
          <div className="hero-left">
            <div className="badge" style={{ marginBottom: 24 }}>
              <span className="badge-dot" />
              AI-Powered Growth Analysis
            </div>
            <h1 className="hero-title" style={{ marginBottom: 16 }}>
              Understand Why Your Website Isn&apos;t Converting
            </h1>
            <p className="hero-subtitle" style={{ marginBottom: 32, maxWidth: 460 }}>
              GrowthOS analyzes your website, identifies growth blockers, and gives you a clear action plan to increase conversions.
            </p>
            <UrlForm onAnalyze={onAnalyze} error={error} />
            <div className="hero-cta-row">
              <a href="#sample-report" className="btn-outline">View Demo Report</a>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No signup · ~30 seconds</span>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="trust-strip">
        <div className="trust-inner">
          <p className="trust-tagline">Built for founders, indie hackers, agencies, and SaaS teams.</p>
          <div className="trust-stats">
            <div className="trust-stat"><span className="stat-value">14,200+</span><span className="stat-label">Websites Analyzed</span></div>
            <div className="trust-stat"><span className="stat-value">89,400+</span><span className="stat-label">Growth Opportunities Found</span></div>
            <div className="trust-stat"><span className="stat-value">34%</span><span className="stat-label">Avg. Conversion Improvement</span></div>
            <div className="trust-stat"><span className="stat-value">28 sec</span><span className="stat-label">Average Analysis Time</span></div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="mkt-section">
        <div className="mkt-inner">
          <span className="mkt-tag">Features</span>
          <h2 className="mkt-heading">Everything you need to grow</h2>
          <p className="mkt-subheading">Six tools working together to turn your website into a conversion machine.</p>
          <div className="features-6-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feat-card">
                <div className="feat-icon-wrap">{f.icon}</div>
                <p className="feat-title">{f.title}</p>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="mkt-section alt">
        <div className="mkt-inner">
          <span className="mkt-tag">How It Works</span>
          <h2 className="mkt-heading">From URL to action plan in 30 seconds</h2>
          <p className="mkt-subheading">No setup. No tracking code. No waiting. Just paste your URL and get your report.</p>
          <div className="steps-6-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-tag">Step {s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE REPORT ── */}
      <section id="sample-report" className="mkt-section">
        <div className="mkt-inner">
          <div className="report-split">
            <div>
              <span className="mkt-tag">Sample Report</span>
              <h2 className="mkt-heading">See exactly what you&apos;ll get</h2>
              <p className="mkt-subheading" style={{ marginBottom: 28 }}>
                Every report includes a growth score, specific conversion problems ranked by severity, actionable fixes, and AI-rewritten copy.
              </p>
              <div className="report-points">
                {[
                  'Growth score from 0–100 based on conversion readiness',
                  '3–5 specific problems with severity ratings',
                  'Prioritized fixes you can implement today',
                  'Rewritten headline, CTA, and value proposition',
                ].map((p) => (
                  <div key={p} className="report-point">
                    <span className="report-point-dot" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="report-preview">
              <div className="rp-titlebar">
                <span className="tb-dot r" /><span className="tb-dot y" /><span className="tb-dot g" />
                <span className="mockup-urlbar">growthos.app/report/example</span>
              </div>
              <div className="rp-body">
                <div className="rp-score-row">
                  <span className="rp-site">example-startup.com</span>
                  <div className="rp-score">
                    <span className="rp-score-big">72</span>
                    <span className="rp-score-small">/100</span>
                  </div>
                </div>
                <div className="rp-section-label">Problems Found</div>
                <div className="rp-row"><span className="rp-dot h" />Weak value proposition above the fold</div>
                <div className="rp-row"><span className="rp-dot m" />CTA is generic and has no urgency</div>
                <div className="rp-row"><span className="rp-dot l" />Missing trust signals and social proof</div>
                <div className="rp-section-label">Recommended Fixes</div>
                <div className="rp-row"><span className="rp-fix-num">1</span>Rewrite headline to lead with the customer outcome</div>
                <div className="rp-row"><span className="rp-fix-num">2</span>Add 3–5 testimonials from real customers</div>
                <div className="rp-row"><span className="rp-fix-num">3</span>Replace &ldquo;Get Started&rdquo; with a specific benefit CTA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="mkt-section alt">
        <div className="mkt-inner">
          <span className="mkt-tag mkt-heading-center" style={{ display: 'block', textAlign: 'center' }}>Who It&apos;s For</span>
          <h2 className="mkt-heading mkt-heading-center">Built for everyone who sells online</h2>
          <p className="mkt-subheading mkt-subheading-center">Whether you run a SaaS, agency, or online store — if your website has visitors that aren&apos;t converting, GrowthOS is for you.</p>
          <div className="personas-grid">
            {PERSONAS.map((p) => (
              <div key={p.title} className="persona-card">
                <div className="persona-icon-wrap">{p.icon}</div>
                <p className="persona-title">{p.title}</p>
                <p className="persona-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY GROWTHOS ── */}
      <section className="mkt-section">
        <div className="mkt-inner">
          <span className="mkt-tag mkt-heading-center" style={{ display: 'block', textAlign: 'center' }}>Why GrowthOS</span>
          <h2 className="mkt-heading mkt-heading-center">Analytics tells you what happened. GrowthOS tells you why.</h2>
          <p className="mkt-subheading mkt-subheading-center" style={{ marginBottom: 44 }}>Traditional tools show you numbers. GrowthOS tells you exactly what to do about them.</p>
          <div className="compare-grid">
            <div className="compare-card">
              <div className="compare-card-head">Traditional Analytics</div>
              {[
                'Shows you page views and bounce rates',
                'Requires data expertise to interpret',
                'Does not explain why visitors leave',
                'No guidance on what to fix',
                'Takes weeks to gather insight',
              ].map((item) => (
                <div key={item} className="compare-item">
                  <XIcon />{item}
                </div>
              ))}
            </div>
            <div className="compare-card growthos">
              <div className="compare-card-head">GrowthOS</div>
              {[
                'Explains exactly why visitors are not converting',
                'No expertise required — plain language reports',
                'Identifies root cause of every drop-off',
                'Gives prioritized, actionable fixes',
                'Results in under 30 seconds',
              ].map((item) => (
                <div key={item} className="compare-item good">
                  <CheckIcon />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="mkt-section alt">
        <div className="mkt-inner">
          <span className="mkt-tag mkt-heading-center" style={{ display: 'block', textAlign: 'center' }}>Pricing</span>
          <h2 className="mkt-heading mkt-heading-center">Simple, transparent pricing</h2>
          <p className="mkt-subheading mkt-subheading-center">No contracts. No hidden fees. Cancel anytime.</p>
          <div className="pricing-grid">
            {PRICING.map((p) => (
              <div key={p.plan} className={`price-card${p.featured ? ' featured' : ''}`}>
                {p.featured && <span className="price-popular-badge">Most Popular</span>}
                <div className="price-plan">{p.plan}</div>
                <div className="price-amount-row">
                  <span className="price-currency">$</span>
                  <span className="price-number">{p.price}</span>
                  <span className="price-period">/mo</span>
                </div>
                <p className="price-desc">{p.desc}</p>
                <ul className="price-features">
                  {p.features.map((f) => (
                    <li key={f} className="price-feat">
                      <CheckIcon />{f}
                    </li>
                  ))}
                </ul>
                <button className={`price-btn${p.featured ? ' filled' : ''}`}>{p.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mkt-section">
        <div className="mkt-inner">
          <span className="mkt-tag mkt-heading-center" style={{ display: 'block', textAlign: 'center' }}>FAQ</span>
          <h2 className="mkt-heading mkt-heading-center">Common questions</h2>
          <p className="mkt-subheading mkt-subheading-center" style={{ marginBottom: 40 }}>Everything you need to know before you start.</p>
          <div className="faq-wrap">
            {FAQS.map((item, i) => (
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {item.q}
                  <ChevronDown open={openFaq === i} />
                </button>
                {openFaq === i && <div className="faq-answer">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <h2 className="final-cta-title">Stop Guessing Why Customers Leave</h2>
        <p className="final-cta-sub">Get a detailed AI-powered growth report for your website in minutes.</p>
        <UrlForm onAnalyze={onAnalyze} error={null} />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>No signup required · Free to try</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div className="footer-brand">
              <div className="wordmark">Growth<span>OS</span></div>
              <p>AI-powered website conversion analysis for founders, teams, and agencies who want to grow.</p>
            </div>
            <div>
              <div className="footer-col-head">Product</div>
              <ul className="footer-link-list">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#sample-report">Sample Report</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-head">Company</div>
              <ul className="footer-link-list">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-head">Resources</div>
              <ul className="footer-link-list">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-head">Legal</div>
              <ul className="footer-link-list">
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 GrowthOS. All rights reserved.</span>
            <span className="footer-copy">Built for founders who want answers, not more data.</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
