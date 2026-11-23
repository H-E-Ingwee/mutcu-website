import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, expoAPI, formsAPI } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import {
  Calendar, FileText, Image, Mail, Heart, Users,
  Settings, Home, BarChart2, Globe, ExternalLink,
  Newspaper, Church, TrendingUp, ArrowRight, Briefcase,
  ClipboardList, SlidersHorizontal, CheckCircle, XCircle,
  Zap, Database, RefreshCw, Activity, Sun, Shield
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, color, bg, link, sub }) {
  return (
    <Link to={link} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all hover:-translate-y-0.5 block group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={color} />
      </div>
      <div className="text-xl sm:text-2xl font-montserrat font-black text-navy mb-0.5">{value ?? '—'}</div>
      <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gray-300 mt-0.5">{sub}</div>}
    </Link>
  )
}

function HealthDot({ status }) {
  if (status === 'checking') return <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
  if (status === 'ok') return <div className="w-2 h-2 rounded-full bg-green-500" />
  return <div className="w-2 h-2 rounded-full bg-red-400" />
}

// Role-specific quick actions
const ROLE_QUICK_ACTIONS = {
  super_admin: [
    { label: 'Homepage', icon: Home, link: '/admin/homepage', color: 'bg-indigo-500', desc: 'Hero, events, sections' },
    { label: 'Add Event', icon: Calendar, link: '/admin/events', color: 'bg-blue-500', desc: 'Services & activities' },
    { label: 'Write Blog', icon: FileText, link: '/admin/blogs', color: 'bg-purple-500', desc: 'WYSIWYG editor' },
    { label: 'Gallery', icon: Image, link: '/admin/gallery', color: 'bg-green-500', desc: 'Upload photos' },
    { label: 'Leadership', icon: Users, link: '/admin/leadership', color: 'bg-navy', desc: 'EC roster & bios' },
    { label: 'Expo Regs', icon: Briefcase, link: '/admin/expo-registrations', color: 'bg-orange', desc: 'Registrations' },
    { label: 'Form Builder', icon: ClipboardList, link: '/admin/forms', color: 'bg-teal', desc: 'Create forms' },
    { label: 'Settings', icon: Settings, link: '/admin/settings', color: 'bg-gray-600', desc: 'Site config' },
  ],
  secretary: [
    { label: 'Messages', icon: Mail, link: '/admin/contacts', color: 'bg-orange', desc: 'Contact inbox' },
    { label: 'Prayer', icon: Heart, link: '/admin/prayer', color: 'bg-red-500', desc: 'Prayer requests' },
    { label: 'Newsletter', icon: Newspaper, link: '/admin/newsletter', color: 'bg-teal', desc: 'Subscribers' },
    { label: 'Leadership', icon: Users, link: '/admin/leadership', color: 'bg-navy', desc: 'EC roster' },
    { label: 'Events', icon: Calendar, link: '/admin/events', color: 'bg-blue-500', desc: 'Programs' },
    { label: 'Blogs', icon: FileText, link: '/admin/blogs', color: 'bg-purple-500', desc: 'Articles' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-teal', desc: 'Registrations' },
    { label: 'Settings', icon: Settings, link: '/admin/settings', color: 'bg-gray-600', desc: 'Site config' },
  ],
  content_manager: [
    { label: 'Homepage', icon: Home, link: '/admin/homepage', color: 'bg-indigo-500', desc: 'Hero & sections' },
    { label: 'Events', icon: Calendar, link: '/admin/events', color: 'bg-blue-500', desc: 'Add events' },
    { label: 'Blogs', icon: FileText, link: '/admin/blogs', color: 'bg-purple-500', desc: 'Write articles' },
    { label: 'Gallery', icon: Image, link: '/admin/gallery', color: 'bg-green-500', desc: 'Upload photos' },
    { label: 'Leadership', icon: Users, link: '/admin/leadership', color: 'bg-navy', desc: 'EC profiles' },
    { label: 'Ministries', icon: Church, link: '/admin/ministries', color: 'bg-indigo-500', desc: 'Ministry info' },
    { label: 'Resources', icon: BarChart2, link: '/admin/resources', color: 'bg-teal', desc: 'Documents' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-orange', desc: 'Create forms' },
  ],
  blog_manager: [
    { label: 'Write Blog', icon: FileText, link: '/admin/blogs', color: 'bg-purple-500', desc: 'New article' },
    { label: 'Gallery', icon: Image, link: '/admin/gallery', color: 'bg-green-500', desc: 'Upload photos' },
    { label: 'Analytics', icon: BarChart2, link: '/admin/analytics', color: 'bg-teal', desc: 'Blog stats' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-orange', desc: 'Create forms' },
  ],
  gallery_manager: [
    { label: 'Upload Photo', icon: Image, link: '/admin/gallery', color: 'bg-green-500', desc: 'Add to gallery' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-orange', desc: 'Create forms' },
  ],
  newsletter_manager: [
    { label: 'Newsletter', icon: Newspaper, link: '/admin/newsletter', color: 'bg-teal', desc: 'Send updates' },
    { label: 'Analytics', icon: BarChart2, link: '/admin/analytics', color: 'bg-blue-500', desc: 'Subscriber stats' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-orange', desc: 'Create forms' },
  ],
  prayer_manager: [
    { label: 'Prayer', icon: Heart, link: '/admin/prayer', color: 'bg-red-500', desc: 'Prayer requests' },
    { label: 'Messages', icon: Mail, link: '/admin/contacts', color: 'bg-orange', desc: 'Contact inbox' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-teal', desc: 'Create forms' },
  ],
  analytics_manager: [
    { label: 'Analytics', icon: BarChart2, link: '/admin/analytics', color: 'bg-teal', desc: 'Full stats' },
    { label: 'Settings', icon: Settings, link: '/admin/settings', color: 'bg-gray-600', desc: 'SEO settings' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-orange', desc: 'Create forms' },
  ],
  expo_manager: [
    { label: 'Expo Regs', icon: Briefcase, link: '/admin/expo-registrations', color: 'bg-orange', desc: 'Registrations' },
    { label: 'Expo Photos', icon: SlidersHorizontal, link: '/admin/expo-settings', color: 'bg-indigo-500', desc: 'Page photos' },
    { label: 'Forms', icon: ClipboardList, link: '/admin/forms', color: 'bg-teal', desc: 'Create forms' },
    { label: 'Analytics', icon: BarChart2, link: '/admin/analytics', color: 'bg-blue-500', desc: 'Stats' },
  ],
}

export default function AdminDashboard() {
  const { user, websiteRole, getRoleLabel, isSuperAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [expoStats, setExpoStats] = useState(null)
  const [formCount, setFormCount] = useState(null)
  const [health, setHealth] = useState({ brevo: 'checking', ai: 'checking', db: 'checking' })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])
  const [todaySummary, setTodaySummary] = useState(null)
  const [activityLoading, setActivityLoading] = useState(true)
  const [shortcutsHintDismissed, setShortcutsHintDismissed] = useState(() => {
    return localStorage.getItem('mutcu_shortcuts_seen') === 'true'
  })

  useEffect(() => {
    adminAPI.dashboard()
      .then(data => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Expo stats for expo managers and super admins
    if (websiteRole === 'expo_manager' || websiteRole === 'super_admin' || isSuperAdmin()) {
      expoAPI.getStats().then(data => setExpoStats(data)).catch(() => {})
    }

    // Forms count for relevant roles
    if (['super_admin', 'expo_manager', 'secretary', 'content_manager'].includes(websiteRole) || isSuperAdmin()) {
      formsAPI.getAllAdmin().then(data => setFormCount((data.forms || []).filter(f => f.status === 'open').length)).catch(() => {})
    }

    if (isSuperAdmin()) {
      fetch('/api/health').then(r => r.json())
        .then(data => setHealth({ brevo: data.brevo ? 'ok' : 'error', ai: data.groq ? 'ok' : 'error', db: 'ok' }))
        .catch(() => setHealth({ brevo: 'error', ai: 'error', db: 'error' }))
    }

    adminAPI.recentActivity()
      .then(data => {
        const TYPE_CONFIG = {
          contact:    { icon: Mail,      color: 'text-orange',   bg: 'bg-orange/10' },
          prayer:     { icon: Heart,     color: 'text-red-500',  bg: 'bg-red-50' },
          subscriber: { icon: Newspaper, color: 'text-teal',     bg: 'bg-teal/10' },
          expo:       { icon: Briefcase, color: 'text-orange',   bg: 'bg-orange/10' },
        }
        const activities = (data.activities || []).map(a => ({
          ...a,
          icon: TYPE_CONFIG[a.type]?.icon || Mail,
          color: TYPE_CONFIG[a.type]?.color || 'text-gray-500',
          bg: TYPE_CONFIG[a.type]?.bg || 'bg-gray-100',
        }))
        // Filter activity by role
        const roleActivityFilter = {
          prayer_manager: ['prayer', 'contact'],
          newsletter_manager: ['subscriber'],
          expo_manager: ['expo'],
          blog_manager: [],
          gallery_manager: [],
          analytics_manager: [],
        }
        const filter = roleActivityFilter[websiteRole]
        setRecentActivity(filter ? activities.filter(a => filter.includes(a.type)) : activities)
      })
      .catch(() => {})
      .finally(() => setActivityLoading(false))

    adminAPI.dashboard()
      .then(data => {
        const s = data.stats || {}
        setTodaySummary({ pendingPrayers: s.pendingPrayers || 0, newMessages: s.newContacts || 0 })
      })
      .catch(() => {})
  }, [websiteRole])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const formatTime = (t) => {
    if (!t) return ''
    const d = new Date(t)
    const now = new Date()
    const diff = Math.floor((now - d) / 60000)
    if (diff < 1) return 'just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const quickActions = ROLE_QUICK_ACTIONS[websiteRole] || ROLE_QUICK_ACTIONS.super_admin

  // Role-specific stat cards
  const getStatCards = () => {
    const all = [
      { label: 'Active Events', value: loading ? '...' : stats?.events, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50', link: '/admin/events', sub: 'this semester', roles: ['super_admin','secretary','content_manager'] },
      { label: 'Published Blogs', value: loading ? '...' : stats?.blogs, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50', link: '/admin/blogs', sub: 'live articles', roles: ['super_admin','secretary','content_manager','blog_manager'] },
      { label: 'Gallery Photos', value: loading ? '...' : stats?.gallery, icon: Image, color: 'text-green-500', bg: 'bg-green-50', link: '/admin/gallery', sub: 'in collection', roles: ['super_admin','content_manager','blog_manager','gallery_manager'] },
      { label: 'Subscribers', value: loading ? '...' : stats?.subscribers, icon: Newspaper, color: 'text-teal', bg: 'bg-teal/10', link: '/admin/newsletter', sub: 'newsletter', roles: ['super_admin','secretary','newsletter_manager'] },
      { label: 'New Messages', value: loading ? '...' : stats?.newContacts, icon: Mail, color: 'text-orange', bg: 'bg-orange/10', link: '/admin/contacts', sub: 'unread', roles: ['super_admin','secretary','prayer_manager'] },
      { label: 'Prayer Requests', value: loading ? '...' : stats?.pendingPrayers, icon: Heart, color: 'text-red-500', bg: 'bg-red-50', link: '/admin/prayer', sub: 'pending', roles: ['super_admin','secretary','prayer_manager'] },
      { label: 'Leaders', value: loading ? '...' : stats?.leaders, icon: Users, color: 'text-navy', bg: 'bg-navy/10', link: '/admin/leadership', sub: 'EC + Patrons', roles: ['super_admin','secretary','content_manager'] },
      { label: 'Ministries', value: loading ? '...' : (stats?.ministries ?? 10), icon: Church, color: 'text-indigo-500', bg: 'bg-indigo-50', link: '/admin/ministries', sub: 'all active', roles: ['super_admin','content_manager'] },
    ]
    return all.filter(s => s.roles.includes(websiteRole) || isSuperAdmin())
  }

  return (
    <div>
      {/* Keyboard shortcuts hint */}
      {!shortcutsHintDismissed && (
        <div className="mb-5 p-3 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap text-xs font-montserrat text-gray-500">
            <span className="font-bold text-navy">Keyboard shortcuts:</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-xs">Ctrl+K</kbd> Search</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-xs">Ctrl+S</kbd> Save</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-xs">ESC</kbd> Close modal</span>
          </div>
          <button onClick={() => { localStorage.setItem('mutcu_shortcuts_seen', 'true'); setShortcutsHintDismissed(true) }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-xs font-montserrat font-semibold">
            Got it
          </button>
        </div>
      )}

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-montserrat font-black text-navy text-xl sm:text-2xl mb-1">
          {greeting}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-400 text-sm">
          {getRoleLabel()} — MUTCU Website CMS
        </p>
      </div>

      {/* System health — super admin only */}
      {isSuperAdmin() && (
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 mb-6 flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">System Status</span>
          {[
            { label: 'Database', key: 'db', icon: Database },
            { label: 'Email (Brevo)', key: 'brevo', icon: Mail },
            { label: 'AI (Groq)', key: 'ai', icon: Zap },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-1.5">
              <HealthDot status={health[item.key]} />
              <span className="text-xs font-montserrat font-semibold text-gray-600">{item.label}</span>
              <span className={`text-xs font-montserrat font-bold ${health[item.key] === 'ok' ? 'text-green-600' : health[item.key] === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                {health[item.key] === 'checking' ? '...' : health[item.key] === 'ok' ? 'OK' : 'ERR'}
              </span>
            </div>
          ))}
          {(health.brevo === 'error' || health.ai === 'error') && (
            <Link to="/admin/settings" className="ml-auto text-xs font-montserrat font-semibold text-orange hover:underline flex items-center gap-1">
              <Settings size={11} /> Fix in Settings
            </Link>
          )}
        </div>
      )}

      {/* Today summary — role-filtered */}
      {todaySummary && (todaySummary.newMessages > 0 || todaySummary.pendingPrayers > 0) && (
        ['super_admin','secretary','prayer_manager'].includes(websiteRole) || isSuperAdmin()
      ) && (
        <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-4 sm:p-5 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={16} className="text-orange" />
            <h2 className="font-montserrat font-bold text-white text-sm">Needs Attention</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {todaySummary.newMessages > 0 && (
              <Link to="/admin/contacts" className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-center">
                <Mail size={14} className="text-orange" />
                <div className="font-montserrat font-black text-lg text-orange">{todaySummary.newMessages}</div>
                <div className="text-white/60 text-xs font-montserrat">Unread Messages</div>
              </Link>
            )}
            {todaySummary.pendingPrayers > 0 && (
              <Link to="/admin/prayer" className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-center">
                <Heart size={14} className="text-red-400" />
                <div className="font-montserrat font-black text-lg text-red-400">{todaySummary.pendingPrayers}</div>
                <div className="text-white/60 text-xs font-montserrat">Pending Prayers</div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Expo stats — expo manager gets a rich dashboard */}
      {(websiteRole === 'expo_manager') && (
        <div className="space-y-4 mb-6">
          {/* Main expo stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Registrations', value: expoStats?.total ?? '—', icon: Briefcase, color: 'text-orange', bg: 'bg-orange/10', link: '/admin/expo-registrations' },
              { label: 'Attendees', value: expoStats?.attendees ?? '—', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', link: '/admin/expo-registrations?type=attendee' },
              { label: "Pitchers (Founder's Arena)", value: expoStats?.pitchers ?? '—', icon: Briefcase, color: 'text-orange', bg: 'bg-orange/10', link: '/admin/expo-registrations?type=pitcher' },
              { label: 'Confirmed', value: expoStats?.confirmed ?? '—', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/expo-registrations' },
            ].map((s, i) => (
              <Link key={i} to={s.link} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5 block">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon size={16} className={s.color} />
                </div>
                <div className="text-xl font-montserrat font-black text-navy">{s.value}</div>
                <div className="text-xs font-montserrat font-semibold text-gray-400 mt-0.5">{s.label}</div>
              </Link>
            ))}
          </div>
          {/* Expo quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/admin/expo-registrations" className="bg-navy rounded-2xl p-4 text-white hover:opacity-90 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-orange/20 flex items-center justify-center"><Briefcase size={16} className="text-orange" /></div>
                <div className="font-montserrat font-bold text-sm">Manage Registrations</div>
              </div>
              <p className="text-white/60 text-xs">View, search, filter, export Excel/PDF</p>
            </Link>
            <Link to="/admin/expo-settings" className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center"><SlidersHorizontal size={16} className="text-indigo-500" /></div>
                <div className="font-montserrat font-bold text-navy text-sm">Expo Page Photos</div>
              </div>
              <p className="text-gray-400 text-xs">Change hero, speakers, about photos</p>
            </Link>
            <Link to="/admin/forms" className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center"><ClipboardList size={16} className="text-teal" /></div>
                <div className="font-montserrat font-bold text-navy text-sm">Registration Forms</div>
              </div>
              <p className="text-gray-400 text-xs">{formCount ?? '—'} open forms · Create new forms</p>
            </Link>
          </div>
          {/* Expo countdown */}
          <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-montserrat font-black text-white text-base">Business Exposition 2027</div>
                <div className="text-white/60 text-xs mt-0.5">Saturday, 13 March 2027 · 8:00 AM – 4:00 PM</div>
              </div>
              <Link to="/business-expo" target="_blank" className="flex items-center gap-1 text-xs text-orange font-montserrat font-semibold hover:underline">
                <ExternalLink size={11} /> View Page
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Role-specific stat cards */}
      {getStatCards().length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {getStatCards().map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} icon={s.icon} color={s.color} bg={s.bg} link={s.link} sub={s.sub} />
          ))}
        </div>
      )}

      {/* Super admin extra stats */}
      {isSuperAdmin() && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center"><Briefcase size={18} className="text-orange" /></div>
              <Link to="/admin/expo-registrations" className="text-xs text-orange font-montserrat font-semibold hover:underline">View all</Link>
            </div>
            <div className="text-2xl font-montserrat font-black text-navy mb-0.5">{expoStats ? expoStats.total : '—'}</div>
            <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">Expo Registrations</div>
            {expoStats && <div className="flex gap-3 mt-2"><span className="text-xs text-gray-500">{expoStats.attendees} attendees</span><span className="text-xs text-orange font-semibold">{expoStats.pitchers} pitchers</span></div>}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center"><ClipboardList size={18} className="text-teal" /></div>
              <Link to="/admin/forms" className="text-xs text-orange font-montserrat font-semibold hover:underline">Manage</Link>
            </div>
            <div className="text-2xl font-montserrat font-black text-navy mb-0.5">{formCount !== null ? formCount : '—'}</div>
            <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">Open Forms</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><SlidersHorizontal size={18} className="text-indigo-500" /></div>
              <Link to="/admin/expo-settings" className="text-xs text-orange font-montserrat font-semibold hover:underline">Edit</Link>
            </div>
            <div className="text-2xl font-montserrat font-black text-navy mb-0.5">Expo</div>
            <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">Page Settings</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-6">
        <h2 className="font-montserrat font-bold text-navy text-sm sm:text-base mb-4">Quick Actions</h2>
        <div className={`grid gap-2 sm:gap-3 ${quickActions.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-4 sm:grid-cols-4 lg:grid-cols-8'}`}>
          {quickActions.map((a, i) => (
            <Link key={i} to={a.link}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-all group text-center">
              <div className={`${a.color} w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <a.icon size={16} className="text-white" />
              </div>
              <div className="text-xs font-montserrat font-bold text-navy leading-tight">{a.label}</div>
              <div className="text-xs text-gray-400 hidden sm:block leading-tight">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity + DMS link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2">
              <Activity size={14} className="text-orange" /> Recent Activity
            </h3>
          </div>
          {activityLoading ? (
            <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange" /></div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-montserrat">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentActivity.map(a => (
                <Link key={a.id} to={a.link}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-7 h-7 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <a.icon size={12} className={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-semibold text-navy text-xs group-hover:text-orange transition-colors truncate">{a.title}</div>
                    {a.sub && <div className="text-gray-400 text-xs truncate mt-0.5">{a.sub}</div>}
                  </div>
                  <div className="text-gray-300 text-xs font-montserrat flex-shrink-0">{formatTime(a.time)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* DMS link — super admin / secretary only */}
        {(isSuperAdmin() || websiteRole === 'secretary') ? (
          <div className="bg-navy rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange/20 flex items-center justify-center flex-shrink-0">
                <ExternalLink size={18} className="text-orange" />
              </div>
              <div>
                <div className="font-montserrat font-bold text-white text-sm">MUTCU Member Portal</div>
                <div className="text-white/40 text-xs">portal.mutcu.org</div>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">The DMS manages member registration, nominations, and leadership data that powers this website.</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                <ExternalLink size={13} /> Open DMS Portal
              </a>
              <Link to="/admin/leadership" className="btn-outline-white btn-sm">Update Leadership</Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-orange" /> Your Role
            </h3>
            <div className="p-4 rounded-2xl bg-navy/5 border border-navy/10">
              <div className="font-montserrat font-black text-navy text-base mb-1">{getRoleLabel()}</div>
              <p className="text-gray-500 text-xs leading-relaxed">
                You have access to the sections relevant to your role. Use the Quick Actions above or the sidebar to navigate.
              </p>
              <Link to="/admin/analytics" className="mt-3 inline-flex items-center gap-1 text-xs text-orange font-montserrat font-semibold hover:underline">
                <BarChart2 size={11} /> View your analytics
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}