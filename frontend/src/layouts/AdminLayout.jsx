import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Calendar, FileText, Image, BookOpen,
  Mail, Heart, Users, LogOut, Globe, ChevronRight,
  Newspaper, BarChart2, Settings, Home, Church
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    ]
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/homepage', label: 'Homepage', icon: Home },
      { path: '/admin/events', label: 'Events', icon: Calendar },
      { path: '/admin/blogs', label: 'Blogs', icon: FileText },
      { path: '/admin/gallery', label: 'Gallery', icon: Image },
      { path: '/admin/resources', label: 'Resources', icon: BookOpen },
    ]
  },
  {
    label: 'People',
    items: [
      { path: '/admin/leadership', label: 'Leadership', icon: Users },
      { path: '/admin/ministries', label: 'Ministries', icon: Church },
    ]
  },
  {
    label: 'Inbox',
    items: [
      { path: '/admin/contacts', label: 'Messages', icon: Mail },
      { path: '/admin/prayer', label: 'Prayer Requests', icon: Heart },
      { path: '/admin/newsletter', label: 'Newsletter', icon: Newspaper },
    ]
  },
  {
    label: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export default function AdminLayout() {
  const { user, loading, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) navigate('/admin/login')
  }, [user, loading, isAdmin, navigate])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
    </div>
  )

  if (!user || !isAdmin()) return null

  const isActive = (path, end) => end ? location.pathname === path : location.pathname.startsWith(path)

  // Breadcrumb
  const pathParts = location.pathname.split('/').filter(Boolean)
  const breadcrumb = pathParts.slice(1).map(p => p.replace(/-/g, ' ')).join(' / ') || 'Dashboard'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ─── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-60 bg-navy flex flex-col flex-shrink-0 fixed top-0 left-0 bottom-0 z-40 overflow-y-auto">
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/assets/images/best logo.png" alt="MUTCU" className="h-8"
              onError={e => { e.target.style.display = 'none' }} />
            <div>
              <div className="font-montserrat font-bold text-white text-sm leading-tight">MUTCU</div>
              <div className="text-white/40 text-xs">Website CMS</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <div className="text-white/30 text-xs font-montserrat font-bold uppercase tracking-widest px-3 mb-1.5">{section.label}</div>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-montserrat font-semibold transition-all ${
                      isActive(item.path, item.end) ? 'bg-orange text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}>
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Actions */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <div className="px-3 py-2 mb-1">
            <div className="text-white text-sm font-semibold truncate">{user.name}</div>
            <div className="text-white/40 text-xs capitalize">{user.role?.replace(/_/g, ' ')}</div>
          </div>
          <Link to="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm font-montserrat font-semibold transition-all">
            <Globe size={15} />View Website
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 text-sm font-montserrat font-semibold transition-all">
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col ml-60">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-navy font-semibold">Admin</span>
            <ChevronRight size={14} />
            <span className="capitalize font-semibold text-gray-600">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange transition-colors font-semibold">
              <Globe size={13} />mutcu.org
            </a>
            <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-montserrat font-bold text-sm">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}