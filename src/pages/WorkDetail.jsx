import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import GoldRule from '../components/GoldRule.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import CTABanner from '../components/CTABanner.jsx'
import NotFound from './NotFound.jsx'
import { WORK } from '../data/work.js'

export default function WorkDetail() {
  const { slug } = useParams()
  const project = WORK.find((p) => p.slug === slug)

  if (!project) return <NotFound />

  return (
    <>
      <Helmet>
        <title>{project.name} | By MAM Studio</title>
        <meta name="description" content={project.subtitle} />
        <link rel="canonical" href={`https://bymamstudio.com/work/${project.slug}`} />
        <meta property="og:title" content={`${project.name} | By MAM Studio`} />
        <meta property="og:description" content={project.subtitle} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="bg-navy border-b border-border py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 font-mono text-slate mb-6" style={{ fontSize: '11px' }}>
            <Link to="/" className="hover:text-stone transition-colors">Home</Link>
            <span>/</span>
            <Link to="/work" className="hover:text-stone transition-colors">Work</Link>
            <span>/</span>
            <span className="text-stone truncate max-w-[200px]">{project.name}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span
              className="font-mono border px-2 py-0.5 rounded"
              style={{ fontSize: '10px', color: project.color, borderColor: `${project.color}44` }}
            >
              {project.category}
            </span>
            <span className="font-mono text-slate" style={{ fontSize: '10px' }}>{project.year}</span>
          </div>

          <h1 className="font-display text-white font-semibold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {project.name}
          </h1>
          <p className="font-body text-stone max-w-2xl leading-relaxed">{project.subtitle}</p>

          {project.links.length > 0 && (
            <div className="flex gap-3 mt-6 flex-wrap">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-sm border border-border text-stone px-5 py-2 rounded hover:border-stone/60 hover:text-warm transition-all"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <aside className="space-y-8">
            <div>
              <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>Engagement</p>
              <p className="font-body text-stone text-sm">{project.engagement}</p>
            </div>
            <div>
              <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>Year</p>
              <p className="font-body text-stone text-sm">{project.year}</p>
            </div>
            <div>
              <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>Tags</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="font-mono text-slate border border-border/60 px-2 py-0.5 rounded" style={{ fontSize: '10px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {project.metrics.length > 0 && project.metrics[0] !== 'Coming soon' && (
              <div>
                <p className="font-mono text-gold uppercase mb-3" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>Outcomes</p>
                <div className="space-y-2">
                  {project.metrics.map((m) => (
                    <div key={m} className="bg-card border border-border rounded p-3">
                      <p className="font-body text-stone text-sm">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="md:col-span-2 space-y-12">
            {project.problem.length > 0 && project.problem[0] !== 'In progress' && (
              <section>
                <SectionLabel>PROBLEM</SectionLabel>
                <GoldRule width="60px" className="mb-6" />
                <ul className="space-y-3">
                  {project.problem.map((item, i) => (
                    <li key={i} className="font-body text-stone leading-relaxed flex gap-3">
                      <span className="text-gold mt-1 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.approach.length > 0 && project.approach[0] !== 'In progress' && (
              <section>
                <SectionLabel>APPROACH</SectionLabel>
                <GoldRule width="60px" className="mb-6" />
                <ul className="space-y-3">
                  {project.approach.map((item, i) => (
                    <li key={i} className="font-body text-stone leading-relaxed flex gap-3">
                      <span className="text-gold mt-1 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.execution.length > 0 && project.execution[0] !== 'In progress' && (
              <section>
                <SectionLabel>EXECUTION</SectionLabel>
                <GoldRule width="60px" className="mb-6" />
                <ul className="space-y-3">
                  {project.execution.map((item, i) => (
                    <li key={i} className="font-body text-stone leading-relaxed flex gap-3">
                      <span className="text-gold mt-1 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.outcome.length > 0 && project.outcome[0] !== 'In progress' && (
              <section>
                <SectionLabel>OUTCOME</SectionLabel>
                <GoldRule width="60px" className="mb-6" />
                <ul className="space-y-3">
                  {project.outcome.map((item, i) => (
                    <li key={i} className="font-body text-stone leading-relaxed flex gap-3">
                      <span className="text-gold mt-1 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-border flex items-center justify-between">
          <Link to="/work" className="font-mono text-gold hover:text-goldlt transition-colors" style={{ fontSize: '12px' }}>
            ← Back to Work
          </Link>
          <Link to="/services" className="font-mono text-slate hover:text-stone transition-colors" style={{ fontSize: '12px' }}>
            View Services →
          </Link>
        </div>
      </div>

      <CTABanner
        heading="Start a new engagement"
        subheading="We work with select clients on brand systems, digital platforms, and infrastructure design."
        ctaText="Start a Conversation"
        ctaHref="mailto:hello@bymamstudio.com?subject=New Engagement Inquiry"
      />
    </>
  )
}
