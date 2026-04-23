import { Link } from 'react-router-dom'

export default function ServiceCard({ service }) {
  return (
    <div
      className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = service.color
        e.currentTarget.style.boxShadow = `0 8px 32px ${service.color}22`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <span
        className="font-mono text-xs border px-2 py-0.5 rounded w-fit"
        style={{ color: service.color, borderColor: `${service.color}50`, fontSize: '10px' }}
      >
        {service.category}
      </span>

      <div>
        <h3 className="font-display text-warm text-lg font-semibold leading-snug mb-1">
          {service.name}
        </h3>
        <p className="font-body text-slate text-xs leading-relaxed">{service.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-display text-xl font-semibold" style={{ color: service.color }}>
          {service.price}
        </span>
        <span className="font-mono text-slate" style={{ fontSize: '10px' }}>{service.duration}</span>
      </div>

      <ul className="space-y-1.5 flex-1">
        {service.deliverables.slice(0, 3).map((d, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-stone text-xs leading-relaxed">
            <span className="text-gold mt-0.5 flex-shrink-0">✓</span>
            {d}
          </li>
        ))}
      </ul>

      <Link
        to={`/services/${service.slug}`}
        className="font-mono text-gold hover:text-goldlt transition-colors text-xs mt-auto"
        style={{ fontSize: '11px' }}
      >
        Learn More →
      </Link>
    </div>
  )
}
