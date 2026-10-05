import { Link } from 'react-router-dom'
import SectionLabel from './SectionLabel.jsx'
import { SITE } from '../data/site.js'

// Etsy digital-products line (planned). Everything marked [PLACEHOLDER] must be filled in
// once the By MAM Studio Etsy shop and listings are live.
const LINES = [
  {
    tag: 'AI SKILL BUNDLES',
    title: 'Claude Skill Bundles',
    body: 'Ready-to-install AI skill packs for common small-business workflows, built with the same method as our custom skills library engagements.',
    price: '[PLACEHOLDER: price]',
  },
  {
    tag: 'AEO STARTER KIT',
    title: 'AEO Starter Kit',
    body: 'A do-it-yourself kit for answer engine optimization: the structured data, FAQ patterns, and llms.txt setup that help AI assistants find and cite your business.',
    price: '[PLACEHOLDER: price]',
  },
  {
    tag: 'TEMPLATES',
    title: 'Business & Website Templates',
    body: 'Templates for operators who want a professional starting point without a full engagement.',
    price: '[PLACEHOLDER: price]',
  },
]

export default function DigitalProducts() {
  return (
    <section id="digital-products" className="py-24 px-6 md:px-12 bg-surface/50" aria-labelledby="digital-products-heading">
      <div className="max-w-7xl mx-auto">
        <SectionLabel>DIGITAL PRODUCTS</SectionLabel>
        <h2 id="digital-products-heading" className="font-display text-white font-semibold mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.625rem)' }}>
          AI Skill Bundles, AEO Kits &amp; Templates
        </h2>
        <p className="font-body text-stone mb-12 max-w-2xl leading-relaxed">
          Self-serve digital products from By MAM Studio, sold through our Etsy shop
          ({SITE.etsyUrl}). For the full PDF playbooks, see the <Link to="/products" className="text-gold hover:text-goldlt">product catalog</Link>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LINES.map((l) => (
            <div key={l.title} className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
              <p className="font-mono text-gold uppercase" style={{ fontSize: '10px', letterSpacing: '0.15em' }}>{l.tag}</p>
              <h3 className="font-display text-warm text-xl font-semibold">{l.title}</h3>
              <p className="font-body text-stone text-sm leading-relaxed flex-1">{l.body}</p>
              <p className="font-mono text-slate" style={{ fontSize: '11px' }}>{l.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
