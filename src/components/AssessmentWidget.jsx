import { useState } from 'react'

const SECTIONS = [
  {
    id: 'role',
    title: 'Your Role & Context',
    questions: [
      {
        id: 'role_type',
        text: 'Which best describes your primary role?',
        options: [
          'Marketing Director / Growth Lead',
          'HR Leader / People Operations',
          'Founder / Operator',
          'Consultant / Advisor',
          'Technical Lead / Developer',
          'Executive / VP',
        ],
      },
      {
        id: 'org_size',
        text: 'How large is your organization or team?',
        options: [
          'Solo / 1-5 people',
          '6-25 people',
          '26-100 people',
          '101-500 people',
          '500+ people',
        ],
      },
      {
        id: 'industry',
        text: 'Which industry are you in?',
        options: [
          'Technology / SaaS',
          'Professional Services / Consulting',
          'Healthcare / HR',
          'Retail / E-commerce',
          'Financial Services',
          'Agency / Creative',
          'Other',
        ],
      },
    ],
  },
  {
    id: 'current_ai',
    title: 'Current AI Usage',
    questions: [
      {
        id: 'ai_usage_frequency',
        text: 'How often does your team use AI tools today?',
        options: [
          'Never — we haven\'t started',
          'Occasionally — a few people experimenting',
          'Regularly — multiple people, multiple tools',
          'Daily — AI is part of our workflow',
          'Systematically — AI is infrastructure, not a tool',
        ],
      },
      {
        id: 'ai_tools_used',
        text: 'Which AI tools does your team currently use? (Pick the closest match)',
        options: [
          'None yet',
          'ChatGPT only',
          'Claude only',
          'Multiple: Claude, ChatGPT, Gemini, etc.',
          'Enterprise AI platforms (Copilot, etc.) plus individual tools',
        ],
      },
      {
        id: 'ai_output_quality',
        text: 'How would you describe the quality and consistency of your AI outputs?',
        options: [
          'We don\'t have outputs yet',
          'Inconsistent — quality varies a lot by who is prompting',
          'Okay — some good outputs but no reliable system',
          'Good — we have some prompts that work reliably',
          'Excellent — our outputs are consistent and brand-accurate',
        ],
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance & Infrastructure',
    questions: [
      {
        id: 'governance_state',
        text: 'What is your current AI governance status?',
        options: [
          'No governance — people use whatever they want',
          'Informal — some understanding but nothing documented',
          'Basic — we have a policy but no enforcement',
          'Structured — documented policy, ownership assigned',
          'Mature — policy, ownership, review cadence, compliance integration',
        ],
      },
      {
        id: 'data_readiness',
        text: 'How would you describe your organization\'s data and documentation readiness for AI?',
        options: [
          'Poor — data is scattered and not AI-accessible',
          'Developing — some structure but significant gaps',
          'Moderate — core data is organized but not optimized',
          'Good — well-structured, reasonably accessible',
          'Excellent — standardized, AI-formatted, well-governed',
        ],
      },
      {
        id: 'skills_infrastructure',
        text: 'Do you have a structured prompt or skills library for your team?',
        options: [
          'No — everyone prompts independently',
          'Informal — a few shared prompts in a doc somewhere',
          'Partial — some structured prompts for specific tasks',
          'Yes — a maintained prompt library with documentation',
          'Yes — a full skills library with governance and versioning',
        ],
      },
    ],
  },
  {
    id: 'gaps',
    title: 'Biggest Gaps & Priorities',
    questions: [
      {
        id: 'critical_gap',
        text: 'What is your single biggest AI-related challenge right now?',
        options: [
          'I don\'t know where to start',
          'Inconsistent outputs — quality varies too much',
          'No governance — uncontrolled AI use is a risk',
          'Slow adoption — team isn\'t using AI effectively',
          'Scaling — what works for one person doesn\'t scale to the team',
          'Maintenance — our AI systems degrade over time',
        ],
      },
      {
        id: 'primary_goal',
        text: 'What is your primary AI goal in the next 90 days?',
        options: [
          'Get a clear picture of where we stand (diagnostic)',
          'Implement AI in our marketing function',
          'Implement AI in our HR / people operations',
          'Build a custom Claude skills library',
          'Establish governance before we go further',
          'Maintain and improve existing AI systems',
        ],
      },
      {
        id: 'budget_authority',
        text: 'What is your decision-making authority for AI investments?',
        options: [
          'I\'m exploring — not yet in a buying position',
          'I can recommend but need leadership approval',
          'I have budget up to $5,000',
          'I have budget up to $15,000',
          'I have budget above $15,000 or can get it',
        ],
      },
    ],
  },
  {
    id: 'readiness',
    title: 'Implementation Readiness',
    questions: [
      {
        id: 'timeline',
        text: 'What is your desired implementation timeline?',
        options: [
          'ASAP — I need to move immediately',
          '30 days — this quarter',
          '60-90 days — this cycle',
          '3-6 months — deliberate rollout',
          'Exploring — no specific timeline yet',
        ],
      },
      {
        id: 'internal_capacity',
        text: 'Do you have internal capacity to maintain AI systems once implemented?',
        options: [
          'No — we need ongoing external support',
          'Limited — one person could own it if trained',
          'Moderate — a small team could manage it',
          'Yes — we have dedicated internal capacity',
          'Yes — we have a full AI/ops team',
        ],
      },
      {
        id: 'biggest_fear',
        text: 'What is your biggest concern about AI implementation?',
        options: [
          'Wasting money on tools we won\'t use',
          'Poor quality outputs damaging our brand',
          'Data security and compliance risk',
          'Team resistance and low adoption',
          'Building something that breaks when AI models update',
          'Not knowing if it\'s actually working',
        ],
      },
    ],
  },
]

const SYSTEM_PROMPT = `You are the AI Assessment Advisor for By MAM Studio, an AI systems and brand consulting studio based in NYC. Your job is to analyze a prospect's assessment responses and deliver a precise, personalized AI readiness plan.

By MAM Studio's services and products:

SERVICES:
- AI Audit & Roadmap: $1,500–$3,000 | 1-2 weeks | Scored diagnostic + 90-day roadmap + executive presentation
- Marketing AI Implementation Sprint: $5,000–$12,000 | 30-60 days | Full AI marketing system implementation
- HR AI Implementation Sprint: $6,000–$15,000 | 45-75 days | 5-layer HR AI architecture implementation
- Custom Claude Skills Library Build: $8,000–$20,000 | 30-60 days | Custom skills library designed, built, deployed
- AI Operations Retainer: $750–$2,500/month | Ongoing | Maintenance for deployed AI systems

PRODUCTS (self-implement):
- The AI Marketing Engine Playbook: $149 | 41 pages | 9 modules, 50-prompt library, 90-day calendar
- AI Readiness Scorecard & Transformation Roadmap: $249 | 16 pages | 6-dimension diagnostic + 365-day roadmap
- AI for HR & People Operations Playbook: $99 | 50+ pages | 5-layer HR AI architecture + transformation roadmap
- The Claude Skills Architecture Playbook: $199 | 46 pages | Complete methodology for building Claude skills libraries

MATURITY TIERS:
Tier 1 — Uninitialized: No AI usage, no governance, no infrastructure
Tier 2 — Developing: Experimental AI usage, informal governance, inconsistent outputs
Tier 3 — Emerging: Regular AI usage, some structure, governance in progress
Tier 4 — Scaling: Systematic AI usage, documented governance, expanding infrastructure
Tier 5 — AI-Native: AI is operational infrastructure, full governance, skills library, compounding value

Your response must be a valid JSON object with this exact structure:
{
  "maturityTier": "Tier X — [Name]",
  "maturityScore": [number 1-100],
  "criticalGap": "[one sentence describing the single most important gap]",
  "plan": {
    "days30": {
      "title": "[30-day milestone title]",
      "actions": ["action 1", "action 2", "action 3"]
    },
    "days60": {
      "title": "[60-day milestone title]",
      "actions": ["action 1", "action 2", "action 3"]
    },
    "days90": {
      "title": "[90-day milestone title]",
      "actions": ["action 1", "action 2", "action 3"]
    }
  },
  "dimensions": [
    {"name": "Strategy", "score": [1-5], "gap": "[specific gap]", "action": "[specific next action]"},
    {"name": "Governance", "score": [1-5], "gap": "[specific gap]", "action": "[specific next action]"},
    {"name": "Data & Documentation", "score": [1-5], "gap": "[specific gap]", "action": "[specific next action]"},
    {"name": "Skills & Infrastructure", "score": [1-5], "gap": "[specific gap]", "action": "[specific next action]"},
    {"name": "Team Adoption", "score": [1-5], "gap": "[specific gap]", "action": "[specific next action]"},
    {"name": "Output Quality", "score": [1-5], "gap": "[specific gap]", "action": "[specific next action]"}
  ],
  "recommendations": {
    "primary": {
      "type": "service or product",
      "name": "[exact product/service name]",
      "price": "[exact price]",
      "reason": "[2 sentences — why this is the right first step for this specific person]"
    },
    "secondary": {
      "type": "service or product",
      "name": "[exact product/service name]",
      "price": "[exact price]",
      "reason": "[1 sentence]"
    },
    "selfImplement": {
      "name": "[exact product name]",
      "price": "[exact price]",
      "reason": "[1 sentence — for someone who wants to start themselves before engaging services]"
    }
  },
  "summary": "[3-4 sentences: where they are, what their critical gap is, what the 90-day plan achieves, and what happens if they don't act on this now]"
}`

export default function AssessmentWidget() {
  const [phase, setPhase] = useState('landing')
  const [sectionIdx, setSectionIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('plan')

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

    const userContent = SECTIONS.flatMap((section) =>
      section.questions.map((q) => `${q.text}\nAnswer: ${answers[q.id] || 'Not answered'}`)
    ).join('\n\n')

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userContent }],
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      const text = data.content?.[0]?.text || ''

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid response format')

      const parsed = JSON.parse(jsonMatch[0])
      setResults(parsed)
      setPhase('results')
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
  }

  const mailtoBundle = `mailto:hello@bymamstudio.com?subject=AI Assessment — Get the Complete Bundle&body=Hi,%0A%0AI just completed the By MAM Studio AI Readiness Assessment. My maturity tier is: ${results?.maturityTier || ''}.%0A%0AMy critical gap: ${results?.criticalGap || ''}%0A%0AI'd like to learn more about the complete product bundle.`

  const mailtoContact = `mailto:hello@bymamstudio.com?subject=AI Assessment Follow-Up — ${encodeURIComponent(results?.maturityTier || 'Assessment Complete')}&body=Hi,%0A%0AI completed the By MAM Studio AI Readiness Assessment.%0A%0AMaturity Tier: ${encodeURIComponent(results?.maturityTier || '')}%0ACritical Gap: ${encodeURIComponent(results?.criticalGap || '')}%0A%0A${encodeURIComponent(results?.summary || '')}%0A%0AI'd like to discuss next steps.`

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
          <button
            onClick={() => setPhase('assessment')}
            className="bg-gold text-ink font-body font-semibold px-10 py-4 rounded text-lg transition-all duration-200 hover:bg-goldlt"
          >
            Start the Assessment
          </button>
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
        <div className="text-center max-w-md">
          <h2 className="font-display text-white text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="font-body text-stone mb-6">{error}</p>
          <button
            onClick={() => { setPhase('assessment'); setSectionIdx(0) }}
            className="bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
          >
            Try Again
          </button>
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
                    {results.plan[key]?.actions.map((action, i) => (
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
                  Book a free 20-minute discovery call. We'll review your results together and map the right engagement for where you are.
                </p>
                <a
                  href={mailtoContact}
                  className="inline-block bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
                >
                  Get in Touch →
                </a>
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
