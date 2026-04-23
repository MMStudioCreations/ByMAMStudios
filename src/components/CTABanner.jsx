import { Link } from 'react-router-dom'
import DotGrid from './DotGrid.jsx'

export default function CTABanner({ heading, subheading, ctaText, ctaHref }) {
  const isExternal = ctaHref?.startsWith('mailto:') || ctaHref?.startsWith('http')

  return (
    <section className="relative bg-navy py-20 px-6 md:px-12 overflow-hidden" style={{ borderTop: '0.5px solid #C9A84C', borderBottom: '0.5px solid #C9A84C' }}>
      <DotGrid opacity={0.05} />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-white font-semibold mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.375rem)' }}>
          {heading}
        </h2>
        {subheading && (
          <p className="font-body text-stone mb-8 leading-relaxed">{subheading}</p>
        )}
        {isExternal ? (
          <a
            href={ctaHref}
            className="inline-block bg-gold text-ink font-body font-semibold px-8 py-3 rounded transition-all duration-200 hover:bg-goldlt"
          >
            {ctaText}
          </a>
        ) : (
          <Link
            to={ctaHref}
            className="inline-block bg-gold text-ink font-body font-semibold px-8 py-3 rounded transition-all duration-200 hover:bg-goldlt"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  )
}
