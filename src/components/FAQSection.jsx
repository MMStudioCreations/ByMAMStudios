import SectionLabel from './SectionLabel.jsx'

// Visible Q&A block. Pair it with FAQPage JSON-LD built from the same items (see faqSchema).
export function faqSchema(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export default function FAQSection({ items, heading = 'Frequently Asked Questions', label = 'FAQ', id = 'faq' }) {
  return (
    <section id={id} className="py-24 px-6 md:px-12 max-w-4xl mx-auto" aria-labelledby={`${id}-heading`}>
      <SectionLabel>{label}</SectionLabel>
      <h2 id={`${id}-heading`} className="font-display text-white font-semibold mb-10" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.625rem)' }}>
        {heading}
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <details key={item.q} className="bg-card border border-border rounded-lg px-5 py-4 group">
            <summary className="font-body text-warm font-medium cursor-pointer list-none flex items-center justify-between">
              <h3 className="text-base font-medium">{item.q}</h3>
              <span className="font-mono text-gold group-open:rotate-45 transition-transform text-lg ml-4 flex-shrink-0" aria-hidden="true">+</span>
            </summary>
            <p className="font-body text-stone text-sm mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
