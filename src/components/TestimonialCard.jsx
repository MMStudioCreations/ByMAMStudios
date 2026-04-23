export default function TestimonialCard({ quote, name, title }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4">
      <p className="font-body text-stone text-sm leading-relaxed italic">"{quote}"</p>
      <div>
        <p className="font-body text-warm text-sm font-medium">{name}</p>
        <p className="font-mono text-slate" style={{ fontSize: '11px' }}>{title}</p>
      </div>
    </div>
  )
}
