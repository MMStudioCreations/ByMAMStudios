import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="404 — Page Not Found | By MAM Studio"
        description="The page you're looking for doesn't exist."
      />
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="font-mono text-gold text-6xl font-bold mb-6">404</p>
          <h1 className="font-display text-white text-3xl font-semibold mb-4">Page Not Found</h1>
          <p className="font-body text-stone mb-8 leading-relaxed">
            The page you're looking for doesn't exist or may have moved.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/"
              className="bg-gold text-ink font-body font-semibold px-6 py-3 rounded hover:bg-goldlt transition-all"
            >
              Go Home
            </Link>
            <Link
              to="/services"
              className="border border-border text-stone font-body px-6 py-3 rounded hover:border-stone/60 hover:text-warm transition-all"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
