import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { path: '/', label: 'Home', end: true },
  { path: '/about', label: 'About' },
  { path: '/ministries', label: 'Ministries' },
  { path: '/events', label: 'Events' },
  { path: '/blogs', label: 'Blog' },
  { path: '/resources', label: 'Resources' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const isHeroPage = ['/', '/about', '/ministries', '/events', '/contact', '/gallery', '/resources', '/blogs', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/ministries/') || location.pathname.startsWith('/committees/') || location.pathname.startsWith('/special-committees/')

  const navBg = scrolled
    ? 'bg-navy/97 backdrop-blur-md shadow-lg py-3'
    : isHeroPage ? 'bg-transparent py-5' : 'bg-navy py-4'

  return (
    <nav className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/images/best logo.png"
              alt="MUTCU Logo"
              className={`transition-all duration-300 ${scrolled ? 'h-9' : 'h-11'}`}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className="hidden sm:block">
              <div className="font-montserrat font-bold text-white text-sm leading-tight">MUTCU</div>
              <div className="text-teal text-xs font-lato opacity-80">Inspire Love, Hope & Godliness</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-montserrat font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-orange bg-white/10'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="https://portal.mutcu.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 btn-primary btn-sm"
            >
              <i className="fas fa-user-circle mr-1" />
              Member Portal
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="bg-navy/95 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-montserrat font-semibold transition-all mb-1 ${
                    isActive ? 'text-orange bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="https://portal.mutcu.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 btn-primary text-center justify-center"
            >
              <i className="fas fa-user-circle mr-2" />
              Member Portal
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}