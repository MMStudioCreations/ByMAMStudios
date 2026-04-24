import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import { RESOURCES } from '../data/resources.js'

const CATEGORIES = ['All', 'Guide', 'Explainer', 'How-To', 'Local Guide', 'Pillar', 'Insight', 'Report']

export default function Resources() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? RESOURCES
    : RESOURCES.filter((r) => r.category === filter)

  return (
    <>
      <SEOHead
        title="AI Resources & Guides | By MAM Studio"
        description="Guides, frameworks, and explainers on AI implementation, governance, and systems thinking for business leaders and operators."
        canonical="https://bymamstudio.com/resources"
      />

      <div className="bg-navy border-b border-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>RESOURCES</SectionLabel>
          <h1 className="font-display text-white font-semibold" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Resources
          </h1>
          <p className="font-body text-stone mt-4 max-w-xl leading-relaxed">
            Guides, frameworks, and explainers on AI implementation, governance, and systems thinking.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-mono px-4 py-1.5 rounded border transition-all ${
                filter === cat
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border/60 text-slate hover:text-stone hover:border-stone/50'
              }`}
              style={{ fontSize: '11px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource) => (
            <article key={resource.slug} className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-gold/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-gold border border-gold/30 px-2 py-0.5 rounded" style={{ fontSize: '10px' }}>
                  {resource.category}
                </span>
                <span className="font-mono text-slate" style={{ fontSize: '10px' }}>{resource.readTime}</span>
              </div>
              <h2 className="font-display text-warm text-lg font-semibold leading-snug">
                {resource.title}
              </h2>
              <p className="font-body text-stone text-sm leading-relaxed flex-1">{resource.excerpt}</p>
              <Link
                to={`/resources/${resource.slug}`}
                className="font-mono text-gold hover:text-goldlt transition-colors"
                style={{ fontSize: '11px' }}
              >
                Read Article →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
