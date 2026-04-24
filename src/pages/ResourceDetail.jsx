import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import GoldRule from '../components/GoldRule.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import NotFound from './NotFound.jsx'
import { RESOURCES } from '../data/resources.js'
import { PRODUCTS } from '../data/products.js'
import { SERVICES } from '../data/services.js'

function ArticleContent({ content }) {
  const blocks = content.split('\n\n').filter(Boolean)
  return (
    <div className="space-y-5 font-body text-stone leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="font-display text-warm text-2xl font-semibold mt-10 mb-2">
              {block.replace('## ', '')}
            </h2>
          )
        }
        return <p key={i}>{block}</p>
      })}
    </div>
  )
}

function PlaceholderContent({ resource }) {
  return (
    <div className="space-y-6 font-body text-stone leading-relaxed">
      <p>
        {resource.excerpt}
      </p>
      <h2 className="font-display text-warm text-2xl font-semibold mt-8">Why This Matters</h2>
      <p>
        Understanding {resource.title.split(':')[0]} is one of the foundational skills for any organization serious about AI adoption. Most businesses jump directly to tools and automation without establishing the underlying architecture that makes those tools effective and governable. The result is AI infrastructure that creates risk rather than leverage.
      </p>
      <h2 className="font-display text-warm text-2xl font-semibold mt-8">The Core Framework</h2>
      <p>
        The correct sequence is: governance first, infrastructure second, automation third. This sequence is non-negotiable — organizations that invert it consistently end up with ungoverned AI use, inconsistent outputs, and compliance exposure. The governance layer doesn't slow implementation down. It makes implementation stick.
      </p>
      <p>
        Every framework in the By MAM Studio product catalog follows this sequence. The AI Readiness Scorecard measures your current position across six dimensions. The implementation playbooks execute in the correct order. The sprint services install governance before they build anything.
      </p>
      <h2 className="font-display text-warm text-2xl font-semibold mt-8">What to Do Next</h2>
      <p>
        If you're not sure where to start, the free AI Readiness Assessment is the right first step. 18 questions across five sections, a Claude-powered analysis, and a personalized 90-day plan. No account required — results in under five minutes.
      </p>
      <div className="bg-card border-l-4 border-gold px-5 py-4 rounded-r-lg mt-8">
        <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px' }}>BOTTOM LINE</p>
        <p className="text-sm">
          The organizations that win with AI aren't the ones that move first. They're the ones that build correctly — with governance, with infrastructure, and with a trained internal operator who can maintain the system over time.
        </p>
      </div>
    </div>
  )
}

export default function ResourceDetail() {
  const { slug } = useParams()
  const resource = RESOURCES.find((r) => r.slug === slug)

  if (!resource) return <NotFound />

  const relatedProducts = PRODUCTS.filter((p) => resource.relatedProducts?.includes(p.slug))
  const relatedServices = SERVICES.filter((s) => resource.relatedServices?.includes(s.slug))
  const primaryProduct = relatedProducts[0]

  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.metaDescription,
    author: { '@type': 'Person', name: 'Michael A. Marino' },
    publisher: { '@type': 'Organization', name: 'By MAM Studio' },
    datePublished: resource.publishDate,
    url: `https://bymamstudio.com/resources/${resource.slug}`,
  })

  return (
    <>
      <Helmet>
        <title>{resource.title} | By MAM Studio</title>
        <meta name="description" content={resource.metaDescription} />
        {resource.keywords && <meta name="keywords" content={resource.keywords.join(', ')} />}
        <link rel="canonical" href={`https://bymamstudio.com/resources/${resource.slug}`} />
        <meta property="og:title" content={resource.title} />
        <meta property="og:description" content={resource.metaDescription} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{articleSchema}</script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <div className="flex items-center gap-2 font-mono text-slate mb-8" style={{ fontSize: '11px' }}>
          <Link to="/" className="hover:text-stone transition-colors">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-stone transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-stone truncate max-w-[200px]">{resource.title}</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-gold border border-gold/30 px-2 py-0.5 rounded" style={{ fontSize: '10px' }}>
            {resource.category}
          </span>
          <span className="font-mono text-slate" style={{ fontSize: '10px' }}>{resource.readTime}</span>
        </div>

        <h1 className="font-display text-white font-semibold mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          {resource.title}
        </h1>

        <p className="font-mono text-slate mb-8" style={{ fontSize: '11px' }}>
          {new Date(resource.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {' · '}Michael A. Marino
        </p>

        <GoldRule className="mb-10" />

        <div className="mb-16">
          {resource.content
            ? <ArticleContent content={resource.content} />
            : <PlaceholderContent resource={resource} />
          }
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <SectionLabel>RELATED PRODUCTS</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {relatedServices.length > 0 && (
          <div className="mb-12">
            <SectionLabel>RELATED SERVICES</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        )}

        {primaryProduct && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <p className="font-mono text-gold uppercase mb-2" style={{ fontSize: '10px' }}>GET THE COMPLETE FRAMEWORK</p>
            <h3 className="font-display text-warm text-xl font-semibold mb-2">{primaryProduct.name}</h3>
            <p className="font-body text-stone text-sm mb-4">{primaryProduct.description}</p>
            <Link
              to={`/products/${primaryProduct.slug}`}
              className="inline-block bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
            >
              Get the Complete Framework →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
