import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NAV_LINKS } from '../data/navigation.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'bg-navy/95 backdrop-blur-md border-gold/30'
            : 'bg-navy border-gold/20'
        }`}
        style={{ borderTopWidth: '1px', borderTopColor: '#C9A84C' }}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
          <Link
            to="/"
            className="font-display text-gold text-lg font-semibold tracking-wide"
            onClick={close}
          >
            By MAM Studio
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `font-body text-sm transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-stone hover:text-warm'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="mailto:hello@bymamstudio.com?subject=Book a Discovery Call"
              className="font-body text-sm border border-gold text-gold px-4 py-2 rounded transition-all duration-200 hover:bg-gold hover:text-ink"
            >
              Book a Call
            </a>
          </div>

          <button
            className="md:hidden text-stone hover:text-warm"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/80" onClick={close} />
          <div className="absolute top-0 right-0 h-full w-72 bg-navy border-l border-border flex flex-col pt-20 pb-8 px-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={close}
                className={({ isActive }) =>
                  `font-body text-base py-3 border-b border-border/50 transition-colors ${
                    isActive ? 'text-gold' : 'text-stone hover:text-warm'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="mailto:hello@bymamstudio.com?subject=Book a Discovery Call"
              onClick={close}
              className="mt-6 font-body text-sm border border-gold text-gold px-4 py-3 rounded text-center hover:bg-gold hover:text-ink transition-all"
            >
              Book a Call
            </a>
          </div>
        </div>
      )}
    </>
  )
}
