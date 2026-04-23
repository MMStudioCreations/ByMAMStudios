import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { PRODUCTS } from '../data/products.js'

const FILTERS = ['All', 'Playbook', 'Framework', 'System']

const FAQ = [
  { q: 'Are these physical products?', a: 'No. All products are professionally designed PDF downloads delivered instantly upon purchase.' },
  { q: 'Can I use these for client work?', a: 'Yes. The frameworks are designed to be implemented for your organization or adapted for client engagements. Single-license purchase covers one organization.' },
  { q: 'Do I need AI experience to use these?', a: 'No. Each product is written for practitioners, not technologists. If you can use Claude.ai or ChatGPT, you can implement every framework.' },
  { q: 'What is your refund policy?', a: 'Due to the digital nature of the products, all sales are final. If you have questions about fit before purchasing, email hello@bymamstudio.com.' },
  { q: 'Do products get updated when Claude models change?', a: 'Yes. All product owners receive update notifications when major Claude model changes affect the frameworks. Updates are delivered at no additional cost.' },
]

export default function Products() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <SEOHead
        title="AI Intelligence Products | By MAM Studio"
        description="Four professionally designed AI implementation products: The AI Marketing Engine Playbook ($149), AI Readiness Scorecard ($249), AI for HR Playbook ($99), and Claude Skills Architecture Playbook ($199)."
        canonical="https://bymamstudio.com/products"
      />

      <div className="bg-navy border-b border-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-mono text-slate mb-4" style={{ fontSize: '11px' }}>
            <Link to="/" className="hover:text-stone transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone">Products</span>
          </div>
          <SectionLabel>THE PRODUCT CATALOG</SectionLabel>
          <h1 className="font-display text-white font-semibold" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Self-Implement the Methodology
          </h1>
          <p className="font-body text-stone mt-4 max-w-xl leading-relaxed">
            Every service methodology is available as a standalone product. Professionally designed PDFs with immediately deployable frameworks — no consulting required.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono px-4 py-1.5 rounded border transition-all ${
                filter === f
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-border/60 text-slate hover:text-stone hover:border-stone/50'
              }`}
              style={{ fontSize: '11px' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>

        <div className="mt-24">
          <h2 className="font-display text-white font-semibold text-2xl mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="bg-card border border-border rounded-lg px-5 py-4 group">
                <summary className="font-body text-warm font-medium text-sm cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="font-mono text-gold group-open:rotate-45 transition-transform text-lg ml-4 flex-shrink-0">+</span>
                </summary>
                <p className="font-body text-stone text-sm mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
