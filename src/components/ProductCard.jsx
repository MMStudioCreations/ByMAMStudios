import { Link } from 'react-router-dom'

export default function ProductCard({ product, index }) {
  return (
    <div
      className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 group"
      style={{
        '--hover-border': product.color,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = product.color
        e.currentTarget.style.boxShadow = `0 8px 32px ${product.color}22`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-ink text-xs font-medium px-2 py-0.5 rounded"
          style={{ backgroundColor: product.color, fontSize: '10px' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-slate text-xs border border-slate/30 px-2 py-0.5 rounded" style={{ fontSize: '10px' }}>
          {product.category}
        </span>
      </div>

      <div>
        <h3 className="font-display text-warm text-xl font-semibold leading-snug mb-1">
          {product.name}
        </h3>
        <p className="font-body text-slate text-xs leading-relaxed">{product.subtitle}</p>
      </div>

      <ul className="space-y-1.5 flex-1">
        {product.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-stone text-xs leading-relaxed">
            <span className="text-gold mt-0.5 flex-shrink-0">·</span>
            {bullet}
          </li>
        ))}
      </ul>

      <div>
        <p className="font-display text-3xl font-semibold" style={{ color: product.color }}>
          {product.price}
        </p>
      </div>

      <Link
        to={`/products/${product.slug}`}
        className="w-full border border-stone/40 text-stone text-xs font-body py-2.5 rounded text-center transition-all duration-200 hover:border-warm hover:text-warm"
        style={{ fontSize: '12px' }}
      >
        Get This Product
      </Link>

      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <span className="font-mono text-slate" style={{ fontSize: '10px' }}>{product.pageCount}</span>
        <span className="font-mono text-slate" style={{ fontSize: '10px' }}>PDF · Instant Download</span>
      </div>
    </div>
  )
}
