export default function GoldRule({ width = 'full', className = '' }) {
  return (
    <div
      className={`h-px bg-gold ${width === 'full' ? 'w-full' : ''} ${className}`}
      style={width !== 'full' ? { width } : {}}
    />
  )
}
