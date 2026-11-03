import { useId } from 'react'

export default function DotGrid({ opacity = 0.04, color = '#C9A84C' }) {
  // Unique per instance (stable between prerender and hydration) to avoid duplicate ids.
  const id = `dots${useId().replace(/:/g, '')}`
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  )
}
