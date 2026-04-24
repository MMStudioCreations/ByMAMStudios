import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import CTABanner from '../components/CTABanner.jsx'
import { WORK } from '../data/work.js'

const TAGS = ['All', 'Infrastructure', 'Identity', 'Digital', 'Visual', 'Commerce']

export default function Work() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? WORK
    : WORK.filter((p) => p.tags.includes(filter))

  return (
    <>
      <SEOHead
        title="Work | By MAM Studio"
        description="Select engagements across brand systems, digital experiences, and design infrastructure. Active projects from the By MAM Studio portfolio."
        canonical="https://bymamstudio.com/work"
      />

      <div className="bg-navy border-b border-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-mono text-slate mb-4" style={{ fontSize: '11px' }}>
            <Link to="/" className="hover:text-stone transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone">Work</span>
          </div>
          <SectionLabel>PORTFOLIO</SectionLabel>
          <h1 className="font-display text-white font-semibold" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Active Work
          </h1>
          <p className="font-body text-stone mt-4 max-w-2xl leading-relaxed">
            Select engagements across brand systems, digital experiences, and infrastructure design. Each project represents a distinct operating environment with its own constraints and requirements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-2 flex-wrap">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`font-mono px-4 py-1.5 rounded border transition-all ${
                filter === tag
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border/60 text-slate hover:text-stone hover:border-stone/50'
              }`}
              style={{ fontSize: '11px' }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <CTABanner
        heading="Start a new engagement"
        subheading="We work with select clients on brand systems, digital platforms, and infrastructure design."
        ctaText="Start a Conversation"
        ctaHref="mailto:hello@bymamstudio.com?subject=New Engagement Inquiry"
      />
    </>
  )
}

function WorkCard({ project }) {
  const handleMouseEnter = (e) => {
    e.currentTarget.style.borderColor = project.color
    e.currentTarget.style.boxShadow = `0 0 0 1px ${project.color}22`
  }
  const handleMouseLeave = (e) => {
    e.currentTarget.style.borderColor = ''
    e.currentTarget.style.boxShadow = ''
  }

  if (project.comingSoon) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 opacity-60">
        <div className="flex items-center justify-between">
          <span
            className="font-mono border px-2 py-0.5 rounded"
            style={{ fontSize: '10px', color: project.color, borderColor: `${project.color}44` }}
          >
            {project.category}
          </span>
          <span className="font-mono text-slate border border-border/60 rounded-full px-2 py-0.5" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
            COMING SOON
          </span>
        </div>
        <h2 className="font-display text-warm text-lg font-semibold leading-snug">{project.name}</h2>
        <p className="font-body text-stone text-sm leading-relaxed flex-1">{project.subtitle}</p>
        <p className="font-mono text-slate" style={{ fontSize: '10px' }}>
          {project.engagement} · {project.year}
        </p>
      </div>
    )
  }

  return (
    <Link
      to={`/work/${project.slug}`}
      className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 hover:border-gold/40 transition-colors group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono border px-2 py-0.5 rounded"
          style={{ fontSize: '10px', color: project.color, borderColor: `${project.color}44` }}
        >
          {project.category}
        </span>
        <span className="font-mono text-slate" style={{ fontSize: '10px' }}>{project.year}</span>
      </div>
      <h2 className="font-display text-warm text-lg font-semibold leading-snug group-hover:text-white transition-colors">
        {project.name}
      </h2>
      <p className="font-body text-stone text-sm leading-relaxed flex-1">{project.subtitle}</p>
      <div className="flex items-center justify-between">
        <p className="font-mono text-slate" style={{ fontSize: '10px' }}>{project.engagement}</p>
        <span className="font-mono text-gold group-hover:text-goldlt transition-colors" style={{ fontSize: '11px' }}>
          View Case →
        </span>
      </div>
    </Link>
  )
}
