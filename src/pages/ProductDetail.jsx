import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'
import GoldRule from '../components/GoldRule.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import NotFound from './NotFound.jsx'
import { PRODUCTS } from '../data/products.js'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = PRODUCTS.find((p) => p.slug === slug)
  const [activeTab, setActiveTab] = useState('overview')

  if (!product) return <NotFound />

  const productIndex = PRODUCTS.indexOf(product)
  const mailtoSubject = encodeURIComponent(`Purchase: ${product.name}`)

  const TABS = [
    { id: 'overview', label: "Overview" },
    { id: 'inside', label: "What's Inside" },
    { id: 'whofrom', label: "Who It's For" },
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <>
      <SEOHead
        title={`${product.name} | By MAM Studio`}
        description={product.description}
        canonical={`https://bymamstudio.com/products/${product.slug}`}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex items-center gap-2 font-mono text-slate mb-8" style={{ fontSize: '11px' }}>
          <Link to="/" className="hover:text-stone transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-stone transition-colors">Products</Link>
          <span>/</span>
          <span className="text-stone">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* LEFT COL */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="font-mono text-ink text-xs font-semibold px-2 py-1 rounded"
                style={{ backgroundColor: product.color, fontSize: '10px' }}
              >
                {product.category}
              </span>
              <span className="font-mono text-slate" style={{ fontSize: '10px' }}>
                #{String(productIndex + 1).padStart(2, '0')}
              </span>
            </div>

            <h1 className="font-display text-white font-semibold mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
              {product.name}
            </h1>
            <p className="font-body text-stone text-lg mb-6">{product.subtitle}</p>
            <p className="font-body text-stone leading-relaxed mb-8">{product.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Length', val: product.pageCount },
                { label: 'Modules', val: `${product.modules.length} modules` },
                { label: 'Format', val: 'PDF Download' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-lg p-4 text-center">
                  <p className="font-display text-gold font-semibold text-lg">{stat.val}</p>
                  <p className="font-mono text-slate mt-1" style={{ fontSize: '10px' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <h2 className="font-body text-warm font-semibold mb-4">What you'll walk away with</h2>
            <ul className="space-y-3">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-stone text-sm leading-relaxed">
                  <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT COL — STICKY PURCHASE CARD */}
          <div className="lg:col-span-2">
            <div
              className="bg-card rounded-lg p-6 sticky top-24"
              style={{ borderTop: `2px solid ${product.color}`, border: `1px solid #1E3060`, borderTopWidth: '2px', borderTopColor: product.color }}
            >
              <p className="font-display font-semibold mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: product.color }}>
                {product.price}
              </p>
              <p className="font-mono text-slate mb-6" style={{ fontSize: '11px' }}>{product.priceNote}</p>

              <a
                href={`mailto:hello@bymamstudio.com?subject=${mailtoSubject}`}
                className="block w-full text-center bg-gold text-ink font-body font-semibold py-3 rounded mb-6 hover:bg-goldlt transition-all"
              >
                Get This Product
              </a>

              <GoldRule className="mb-6" />

              <ul className="space-y-2 mb-6">
                {[
                  'Professionally designed PDF',
                  'Immediately deployable frameworks',
                  product.firstAction.slice(0, 60) + '...',
                  'By MAM Studio quality guarantee',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-body text-stone text-xs leading-relaxed">
                    <span className="text-gold flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="font-mono text-slate text-center" style={{ fontSize: '11px' }}>
                Questions?{' '}
                <a href="mailto:hello@bymamstudio.com" className="text-gold hover:text-goldlt transition-colors">
                  hello@bymamstudio.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-20">
          <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-mono px-5 py-3 whitespace-nowrap border-b-2 -mb-px transition-colors ${
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

          {activeTab === 'overview' && (
            <div className="max-w-2xl">
              <p className="font-body text-stone leading-relaxed mb-6">{product.longDescription}</p>
              <p className="font-body text-stone leading-relaxed mb-6">
                This product is built for practitioners who need results, not theory. Every framework has been developed through real implementation work — not academic exercise. You pick it up, read it, and begin implementing from the first session.
              </p>
              <div className="bg-card border-l-4 border-gold px-5 py-4 rounded-r-lg">
                <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px' }}>FIRST ACTION AFTER PURCHASE</p>
                <p className="font-body text-stone text-sm leading-relaxed">{product.firstAction}</p>
              </div>
            </div>
          )}

          {activeTab === 'inside' && (
            <div className="max-w-2xl">
              <div className="space-y-4">
                {product.modules.map((mod, i) => (
                  <div key={i} className="flex gap-4 bg-card border border-border rounded-lg p-5">
                    <span
                      className="font-mono text-ink text-xs font-bold w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: product.color, fontSize: '11px' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-body text-warm font-semibold text-sm mb-1">{mod.title}</h3>
                      <p className="font-body text-stone text-xs leading-relaxed">{mod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'whofrom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
              {product.whoFor.map((wf) => (
                <div key={wf.title} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-body text-warm font-semibold text-sm mb-3">{wf.title}</h3>
                  <p className="font-body text-stone text-xs leading-relaxed">{wf.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 max-w-2xl">
              {product.faq.map((item) => (
                <details key={item.q} className="bg-card border border-border rounded-lg px-5 py-4 group">
                  <summary className="font-body text-warm font-medium text-sm cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <span className="font-mono text-gold group-open:rotate-45 transition-transform text-lg ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="font-body text-stone text-sm mt-3 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
