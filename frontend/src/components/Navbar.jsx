import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { path: '/', label: 'Home', end: true },
  { path: '/about', label: 'About' },
  {
    label: 'Ministries', path: '/ministries',
    dropdown: [
      { path: '/ministries', label: 'All Ministries' },
      { path: '/find-your-ministry', label: '✨ Find Your Ministry (AI)' },
      { path: '/ministries/prayer-ministry', label: 'Prayer Ministry' },
      { path: '/ministries/music-ministry', label: 'Music Ministry' },
      { path: '/ministries/missions-evangelism', label: 'Missions & Evangelism' },
      { path: '/ministries/bible-study', label: 'Bible Study & Training' },
      { path: '/ministries/creative-arts', label: 'Creative Arts (CREAM)' },
      { path: '/ministries/technical-department', label: 'Technical & Media' },
      { path: '/ministries/hospitality-ministry', label: 'Hospitality' },
      { path: '/ministries/welfare-committee', label: 'Welfare' },
      { path: '/special-committees', label: 'Special Committees' },
    ]
  },
  { path: '/events', label: 'Events' },
  { path: '/blogs', label: 'Blog' },
  {
    label: 'Resources', path: '/resources',
    dropdown: [
      { path: '/resources', label: 'All Resources' },
      { path: '/sermons', label: 'Sermon Archive' },
      { path: '/blogs', label: 'Blog & Devotionals' },
    ]
  },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
]

// Pages where hero is dark (navbar can be transparent)
const DARK_HERO_PAGES = ['/', '/about', '/ministries', '/events', '/contact', '/gallery', '/resources', '/blogs', '/register']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)

  const isDarkHeroPage = DARK_HERO_PAGES.includes(location.pathname) ||
    location.pathname.startsWith('/ministries/') ||
    location.pathname.startsWith('/committees/') ||
    location.pathname.startsWith('/special-committees/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setActiveDropdown(null) }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null)
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('[data-menu-toggle]')) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Navbar background logic
  const navBg = scrolled
    ? 'bg-navy/98 backdrop-blur-md shadow-xl'
    : isDarkHeroPage
      ? 'bg-transparent'
      : 'bg-navy'

  const navPy = scrolled ? 'py-3' : 'py-4'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg} ${navPy}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <img
                src="/assets/images/best logo.png"
                alt="MUTCU Logo"
                className={`transition-all duration-300 ${scrolled ? 'h-9' : 'h-11'}`}
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="hidden sm:block">
                <div className="font-montserrat font-black text-white text-sm leading-tight group-hover:text-orange transition-colors">MUTCU</div>
                <div className="text-teal text-xs font-lato opacity-75 leading-tight">Inspire Love, Hope & Godliness</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
              {NAV_LINKS.map(link => (
                link.dropdown ? (
                  <div key={link.path} className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.path ? null : link.path)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-montserrat font-semibold transition-all duration-200 ${
                        location.pathname.startsWith(link.path)
                          ? 'text-orange bg-white/10'
                          : 'text-white/85 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                      <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${activeDropdown === link.path ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                      activeDropdown === link.path ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      {link.dropdown.map((item, i) => (
                        <Link key={item.path} to={item.path}
                          className={`block px-4 py-2.5 text-sm font-montserrat font-semibold transition-all hover:bg-orange/5 hover:text-orange ${
                            i === 0 ? 'text-navy border-b border-gray-100 font-bold' : 'text-gray-600'
                          }`}
                          onClick={() => setActiveDropdown(null)}>
                          {i === 0 ? <><i className="fas fa-th-large mr-2 text-orange text-xs" />{item.label}</> : item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg text-sm font-montserrat font-semibold transition-all duration-200 ${
                        isActive ? 'text-orange bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              ))}

              <a
                href="https://portal.mutcu.org"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 flex items-center gap-2 bg-orange hover:bg-orange/90 text-white px-4 py-2 rounded-xl text-sm font-montserrat font-bold transition-all hover:shadow-lg hover:shadow-orange/30 hover:-translate-y-0.5"
              >
                <i className="fas fa-user-circle text-sm" />
                Member Portal
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              data-menu-toggle
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-navy z-50 lg:hidden transition-transform duration-300 ease-out overflow-y-auto ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/assets/images/best logo.png" alt="MUTCU" className="h-9"
              onError={e => { e.target.style.display = 'none' }} />
            <div>
              <div className="font-montserrat font-black text-white text-sm">MUTCU</div>
              <div className="text-teal text-xs opacity-70">Inspire Love, Hope & Godliness</div>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white p-1">
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1">
          {NAV_LINKS.map(link => (
            link.dropdown ? (
              <div key={link.path}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === link.path ? null : link.path)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-sm font-montserrat font-semibold transition-all"
                >
                  {link.label}
                  <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${activeDropdown === link.path ? 'rotate-180 text-orange' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === link.path ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="pl-4 space-y-0.5 py-1">
                    {link.dropdown.map(item => (
                      <Link key={item.path} to={item.path}
                        className="block px-4 py-2.5 rounded-xl text-white/60 hover:text-orange hover:bg-white/5 text-sm font-montserrat font-semibold transition-all">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-montserrat font-semibold transition-all ${
                    isActive ? 'text-orange bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          ))}
        </nav>

        {/* Portal CTA */}
        <div className="p-4 border-t border-white/10 mt-2">
          <a
            href="https://portal.mutcu.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-orange text-white px-4 py-3 rounded-xl font-montserrat font-bold text-sm hover:bg-orange/90 transition-all"
          >
            <i className="fas fa-user-circle" />
            Access Member Portal
          </a>
          <p className="text-white/30 text-xs text-center mt-3">portal.mutcu.org</p>
        </div>
      </div>
    </>
  )
}