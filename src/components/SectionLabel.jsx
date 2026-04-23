export default function SectionLabel({ children }) {
  return (
    <p className="font-mono text-gold uppercase tracking-widest mb-4" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
      {children}
    </p>
  )
}
