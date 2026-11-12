import { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Calendar, FileText, Image, BookOpen,
  Mail, Heart, Users, LogOut, Globe, ChevronRight,
  Newspaper, BarChart2, Settings, Home, Church, Briefcase,
  ClipboardList, SlidersHorizontal, Menu, X, Shield, ScrollText
} from 'lucide-react'

// ─── Full nav definition with page keys for RBAC ─────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, page: 'dashboard' },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart2, page: 'analytics' },
    ]
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/homepage', label: 'Homepage', icon: Home, page: 'homepage' },
      { path: '/admin/events', label: 'Events', icon: Calendar, page: 'events' },
      { path: '/admin/blogs', label: 'Blogs', icon: FileText, page: 'blogs' },
      { path: '/admin/gallery', label: 'Gallery', icon: Image, page: 'gallery' },
      { path: '/admin/resources', label: 'Resources', icon: BookOpen, page: 'resources' },
    ]
  },
  {
    label: 'People',
    items: [
      { path: '/admin/leadership', label: 'Leadership', icon: Users, page: 'leadership' },
      { path: '/admin/ministries', label: 'Ministries', icon: Church, page: 'ministries' },
    ]
  },
  {
    label: 'Inbox',
    items: [
      { path: '/admin/contacts', label: 'Messages', icon: Mail, page: 'contacts' },
      { path: '/admin/prayer', label: 'Prayer Requests', icon: Heart, page: 'prayer' },
      { path: '/admin/newsletter', label: 'Newsletter', icon: Newspaper, page: 'newsletter' },
    ]
  },
  {
    label: 'Business Expo',
    items: [
      { path: '/admin/expo-registrations', label: 'Expo Registrations', icon: Briefcase, page: 'expo-registrations' },
      { path: '/admin/expo-settings', label: 'Expo Page Photos', icon: SlidersHorizontal, page: 'expo-settings' },
    ]
  },
  {
    label: 'Forms',
    items: [
      { path: '/admin/forms', label: 'Form Builder', icon: ClipboardList, page: 'forms' },
    ]
  },
  {
    label: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings', icon: Settings, page: 'settings' },
      { path: '/admin/users', label: 'Admin Users', icon: Shield, page: 'users', superOnly: true },
      { path: '/admin/audit-log', label: 'Audit Log', icon: ScrollText, page: 'audit-log', superOnly: true },
    ]
  }
]

// Role badge colours
const ROLE_COLORS = {
  super_admin:       'bg-orange/20 text-orange',
  secretary:         'bg-blue-500/20 text-blue-300',
  content_manager:   'bg-green-500/20 text-green-300',
  blog_manager:      'bg-purple-500/20 text-purple-300',
  gallery_manager:   'bg-teal/20 text-teal',
  newsletter_manager:'bg-yellow-500/20 text-yellow-300',
  prayer_manager:    'bg-red-500/20 text-red-300',
  analytics_manager: 'bg-indigo-500/20 text-indigo-300',
  expo_manager:      'bg-orange/20 text-orange',
}

function SidebarContent({ isActive, onLinkClick, user, logout, canAccess, isSuperAdmin, websiteRole, getRoleLabel }) {
  // Filter nav sections based on role
  const filteredSections = NAV_SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (item.superOnly) return isSuperAdmin()
      return canAccess(item.page)
    })
  })).filter(section => section.items.length > 0)

  const roleColor = ROLE_COLORS[websiteRole] || 'bg-white/10 text-white/60'

  return (
    <>
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
        {filteredSections.map(section => (
          <div key={section.label}>
            <div className="text-white/30 text-xs font-montserrat font-bold uppercase tracking-widest px-3 mb-1.5">{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <Link key={item.path} to={item.path} onClick={onLinkClick}
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

      {/* User + Role + Actions */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        {/* Role badge */}
        <div className={`mx-3 mb-2 px-2.5 py-1.5 rounded-xl text-xs font-montserrat font-bold ${roleColor}`}>
          {getRoleLabel()}
        </div>
        <div className="px-3 py-1.5 mb-1">
          <div className="text-white text-sm font-semibold truncate">{user?.name}</div>
          <div className="text-white/40 text-xs truncate">{user?.email}</div>
        </div>
        <Link to="/" target="_blank" onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm font-montserrat font-semibold transition-all">
          <Globe size={15} />View Website
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 text-sm font-montserrat font-semibold transition-all">
          <LogOut size={15} />Sign Out
        </button>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const { user, loading, logout, isAdmin, isSuperAdmin, canAccess, websiteRole, getRoleLabel } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) navigate('/admin/login')
  }, [user, loading, isAdmin, navigate])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // RBAC: check if current page is accessible
  useEffect(() => {
    if (!loading && user && isAdmin()) {
      const pathParts = location.pathname.split('/').filter(Boolean)
      const page = pathParts[1] || 'dashboard' // e.g. /admin/blogs → 'blogs'
      // Super admin can access everything
      if (isSuperAdmin()) return
      // Check access
      if (page && page !== 'admin' && !canAccess(page)) {
        navigate('/admin?access=denied')
      }
    }
  }, [location.pathname, user, loading])

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

  // Access denied banner
  const accessDenied = new URLSearchParams(location.search).get('access') === 'denied'

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Desktop Sidebar */}
      <aside className="w-60 bg-navy flex-col flex-shrink-0 fixed top-0 left-0 bottom-0 z-40 overflow-y-auto hidden lg:flex">
        <SidebarContent
          isActive={isActive}
          onLinkClick={() => {}}
          user={user}
          logout={logout}
          canAccess={canAccess}
          isSuperAdmin={isSuperAdmin}
          websiteRole={websiteRole}
          getRoleLabel={getRoleLabel}
        />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-navy flex flex-col z-50 lg:hidden transition-transform duration-300 ease-out overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all z-10">
          <X size={16} />
        </button>
        <SidebarContent
          isActive={isActive}
          onLinkClick={() => setMobileOpen(false)}
          user={user}
          logout={logout}
          canAccess={canAccess}
          isSuperAdmin={isSuperAdmin}
          websiteRole={websiteRole}
          getRoleLabel={getRoleLabel}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors"
              aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-navy font-semibold hidden sm:block">Admin</span>
              <ChevronRight size={14} className="hidden sm:block" />
              <span className="capitalize font-semibold text-gray-600 text-xs sm:text-sm truncate max-w-[160px] sm:max-w-none">{breadcrumb}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange transition-colors font-semibold">
              <Globe size={13} />mutcu.org
            </a>
            <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-montserrat font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Access denied banner */}
        {accessDenied && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm font-montserrat font-semibold">
            <Shield size={14} />
            You don't have permission to access that page. Contact your super admin.
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}