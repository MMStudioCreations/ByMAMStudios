import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTIONS } from '../data/assessment.js'

export default function AssessmentWidget() {
  const [phase, setPhase] = useState('landing')
  const [sectionIdx, setSectionIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('plan')
  // 'checking' until /api/assessment answers; 'warming' while the API key isn't set yet.
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false
    fetch('/api/assessment', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : { ready: false }))
      .then((d) => { if (!cancelled) setStatus(d && d.ready ? 'ready' : 'warming') })
      .catch(() => { if (!cancelled) setStatus('warming') })
    return () => { cancelled = true }
  }, [])

  const currentSection = SECTIONS[sectionIdx]
  const totalSections = SECTIONS.length
  const progress = ((sectionIdx) / totalSections) * 100

  const allAnswered = currentSection.questions.every((q) => answers[q.id])

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (sectionIdx < totalSections - 1) {
      setSectionIdx((i) => i + 1)
    } else {
      submitAssessment()
    }
  }

  const handleBack = () => {
    if (sectionIdx > 0) setSectionIdx((i) => i - 1)
  }

  const submitAssessment = async () => {
    setPhase('processing')
    setError(null)

    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json().catch(() => ({}))

      if (data.error === 'warming_up') {
        setStatus('warming')
        setPhase('landing')
        return
      }
      if (!res.ok || !data.result) {
        setError({
          message: data.message || "We couldn't build your plan this time. Please try again, or book a free consult instead.",
          retry: res.status !== 429,
        })
        setPhase('error')
        return
      }
      setResults(data.result)
      setActiveTab('plan')
      setPhase('results')
    } catch {
      setError({ message: 'We could not reach the assessment service. Check your connection and try again.', retry: true })
      setPhase('error')
    }
  }

  const mailtoBundle = `mailto:hello@bymamstudio.com?subject=AI Assessment — Get the Complete Bundle&body=Hi,%0A%0AI just completed the By MAM Studio AI Readiness Assessment. My maturity tier is: ${results?.maturityTier || ''}.%0A%0AMy critical gap: ${results?.criticalGap || ''}%0A%0AI'd like to learn more about the complete product bundle.`


  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center">
          <p className="font-mono text-gold uppercase tracking-widest mb-6" style={{ fontSize: '11px' }}>
            FREE AI READINESS ASSESSMENT
          </p>
          <h1 className="font-display text-white font-semibold mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Where Does Your Organization <span className="text-gold">Actually Stand</span> on AI?
          </h1>
          <p className="font-body text-stone text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            18 questions. A Claude-powered analysis. A personalized 90-day plan with specific product and service recommendations — matched to your role, your gaps, and your timeline.
          </p>
          <p className="font-mono text-slate mb-10" style={{ fontSize: '12px' }}>
            Free · No account required · Powered by Claude AI · Takes ~4 minutes
          </p>
          {status === 'warming' ? (
            <div className="bg-card border border-border rounded-lg px-6 py-6 max-w-md mx-auto" role="status">
              <p className="font-body text-warm font-medium mb-4">
                Assessment is warming up. Book a free consult instead.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gold text-ink font-body font-semibold px-8 py-3 rounded transition-all duration-200 hover:bg-goldlt"
              >
                Book a Free Consult
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setPhase('assessment')}
              disabled={status !== 'ready'}
              className="bg-gold text-ink font-body font-semibold px-10 py-4 rounded text-lg transition-all duration-200 hover:bg-goldlt disabled:opacity-60 disabled:cursor-wait"
            >
              {status === 'ready' ? 'Start the Assessment' : 'Loading…'}
            </button>
          )}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/50 pt-10">
            {[
              { num: '18', label: 'Questions across 5 sections' },
              { num: '6', label: 'AI maturity dimensions scored' },
              { num: '90', label: 'Day personalized action plan' },
            ].map((stat) => (
              <div key={stat.num} className="text-center">
                <p className="font-display text-gold text-3xl font-semibold">{stat.num}</p>
                <p className="font-mono text-slate mt-1" style={{ fontSize: '11px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'assessment') {
    return (
      <div className="min-h-screen bg-ink px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-slate" style={{ fontSize: '11px' }}>
                Section {sectionIdx + 1} of {totalSections}
              </p>
              <p className="font-mono text-slate" style={{ fontSize: '11px' }}>
                {Math.round(progress)}% complete
              </p>
            </div>
            <div className="h-1 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <p className="font-mono text-gold uppercase tracking-widest mb-2" style={{ fontSize: '11px' }}>
              {currentSection.title}
            </p>
          </div>

          <div className="space-y-10">
            {currentSection.questions.map((question, qi) => (
              <div key={question.id}>
                <p className="font-body text-warm font-medium mb-4 leading-relaxed">
                  {qi + 1}. {question.text}
                </p>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(question.id, option)}
                      className={`w-full text-left px-4 py-3 rounded border font-body text-sm transition-all duration-150 ${
                        answers[question.id] === option
                          ? 'border-gold bg-gold/10 text-warm'
                          : 'border-border/60 bg-card/50 text-stone hover:border-stone/60 hover:text-warm'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-10">
            <button
              onClick={handleBack}
              disabled={sectionIdx === 0}
              className="font-body text-slate text-sm px-4 py-2 rounded border border-border/50 disabled:opacity-30 hover:text-stone hover:border-stone/50 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!allAnswered}
              className="font-body font-semibold px-8 py-3 rounded transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: allAnswered ? '#C9A84C' : '#1A2235',
                color: allAnswered ? '#0A0C10' : '#7A7570',
                border: allAnswered ? 'none' : '1px solid #1E3060',
              }}
            >
              {sectionIdx === totalSections - 1 ? 'Get My Plan →' : 'Next Section →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'processing') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <h2 className="font-display text-white text-2xl font-semibold mb-4">
            Analyzing your responses...
          </h2>
          <p className="font-body text-stone leading-relaxed">
            Claude is reviewing your 18 answers across all 5 sections and building your personalized AI maturity plan.
          </p>
          <p className="font-mono text-slate mt-4" style={{ fontSize: '11px' }}>
            This takes 15-30 seconds
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="text-center max-w-md" role="alert">
          <h2 className="font-display text-white text-2xl font-semibold mb-4">We couldn't finish your plan</h2>
          <p className="font-body text-stone mb-8">{error?.message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {error?.retry && (
              <button
                onClick={submitAssessment}
                className="bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
              >
                Try Again
              </button>
            )}
            <Link
              to="/contact"
              className={error?.retry
                ? 'border border-gold text-gold font-body px-6 py-3 rounded hover:bg-gold/10 transition-all'
                : 'bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all'}
            >
              Book a Free Consult
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'results' && results) {
    const TABS = [
      { id: 'plan', label: '90-Day Plan' },
      { id: 'dimensions', label: 'Dimension Scores' },
      { id: 'products', label: 'Recommendations' },
      { id: 'summary', label: 'Summary' },
    ]

    return (
      <div className="min-h-screen bg-ink px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-gold uppercase tracking-widest mb-3" style={{ fontSize: '11px' }}>
              YOUR AI READINESS RESULTS
            </p>
            <h1 className="font-display text-white font-semibold mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              {results.maturityTier}
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px bg-border flex-1 max-w-[100px]" />
              <span className="font-mono text-slate" style={{ fontSize: '11px' }}>
                Maturity Score: {results.maturityScore}/100
              </span>
              <div className="h-px bg-border flex-1 max-w-[100px]" />
            </div>
            <div className="bg-card border border-border rounded-lg px-6 py-4 max-w-xl mx-auto">
              <p className="font-mono text-gold uppercase mb-1" style={{ fontSize: '10px' }}>CRITICAL GAP</p>
              <p className="font-body text-warm text-sm leading-relaxed">{results.criticalGap}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-mono px-4 py-3 whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-slate hover:text-stone'
                }`}
                style={{ fontSize: '12px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'plan' && (
            <div className="space-y-6">
              {[
                { key: 'days30', label: '30 DAYS', color: '#C9A84C' },
                { key: 'days60', label: '60 DAYS', color: '#C45C28' },
                { key: 'days90', label: '90 DAYS', color: '#6B8AF0' },
              ].map(({ key, label, color }) => (
                <div key={key} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-mono text-ink text-xs font-semibold px-2 py-1 rounded"
                      style={{ backgroundColor: color, fontSize: '10px' }}
                    >
                      {label}
                    </span>
                    <h3 className="font-body text-warm font-medium">{results.plan[key]?.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {results.plan[key]?.actions?.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-stone text-sm">
                        <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="space-y-4">
              {results.dimensions?.map((dim) => (
                <div key={dim.name} className="bg-card border border-border rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-body text-warm font-medium text-sm">{dim.name}</h3>
                    <span className="font-mono text-gold" style={{ fontSize: '12px' }}>{dim.score}/5</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-700"
                      style={{ width: `${(dim.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="font-body text-slate text-xs mb-1"><span className="text-stone">Gap:</span> {dim.gap}</p>
                  <p className="font-body text-slate text-xs"><span className="text-stone">Next action:</span> {dim.action}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-card border-2 border-gold/40 rounded-lg p-6">
                <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px' }}>PRIMARY RECOMMENDATION</p>
                <h3 className="font-display text-warm text-xl font-semibold mb-1">{results.recommendations?.primary?.name}</h3>
                <p className="font-display text-gold text-2xl font-semibold mb-3">{results.recommendations?.primary?.price}</p>
                <p className="font-body text-stone text-sm leading-relaxed">{results.recommendations?.primary?.reason}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="font-mono text-stone uppercase mb-2" style={{ fontSize: '10px' }}>SECONDARY RECOMMENDATION</p>
                <h3 className="font-display text-warm text-lg font-semibold mb-1">{results.recommendations?.secondary?.name}</h3>
                <p className="font-display text-gold text-xl font-semibold mb-3">{results.recommendations?.secondary?.price}</p>
                <p className="font-body text-stone text-sm leading-relaxed">{results.recommendations?.secondary?.reason}</p>
              </div>

              <div className="bg-surface border border-border/50 rounded-lg p-6">
                <p className="font-mono text-slate uppercase mb-2" style={{ fontSize: '10px' }}>SELF-IMPLEMENT OPTION</p>
                <h3 className="font-body text-warm font-medium mb-1">{results.recommendations?.selfImplement?.name}</h3>
                <p className="font-display text-gold text-lg font-semibold mb-2">{results.recommendations?.selfImplement?.price}</p>
                <p className="font-body text-stone text-sm leading-relaxed">{results.recommendations?.selfImplement?.reason}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="font-body text-warm font-medium mb-2">Want all four products at once?</p>
                <p className="font-body text-stone text-sm mb-4">The complete By MAM Studio product bundle: all four playbooks at a bundled rate. Email us to ask about bundle pricing.</p>
                <a
                  href={mailtoBundle}
                  className="inline-block bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
                >
                  Get the Complete Bundle
                </a>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="font-mono text-gold uppercase mb-4" style={{ fontSize: '10px' }}>YOUR AI READINESS SUMMARY</p>
                <p className="font-body text-stone leading-relaxed">{results.summary}</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="font-body text-warm font-medium mb-1">Ready to move forward?</p>
                <p className="font-body text-stone text-sm mb-4">
                  Book a free consult. We'll review your results together and map the right engagement for where you are.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
                >
                  Book a Free Consult →
                </Link>
              </div>

              <button
                onClick={() => { setPhase('landing'); setAnswers({}); setSectionIdx(0); setResults(null) }}
                className="w-full border border-border text-slate font-body text-sm py-3 rounded hover:text-stone hover:border-stone/50 transition-all"
              >
                Retake Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
