import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, expoAPI, formsAPI, contactAPI, prayerAPI, newsletterAPI } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import {
  Calendar, FileText, Image, Mail, Heart, Users,
  Settings, Home, BarChart2, Globe, ExternalLink,
  Newspaper, Church, TrendingUp, ArrowRight, Briefcase,
  ClipboardList, SlidersHorizontal, CheckCircle, XCircle,
  Zap, Database, RefreshCw, Activity, Sun
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

const QUICK_ACTIONS = [
  { label: 'Homepage', icon: Home, link: '/admin/homepage', color: 'bg-indigo-500', desc: 'Hero, events, sections' },
  { label: 'Add Event', icon: Calendar, link: '/admin/events', color: 'bg-blue-500', desc: 'Services & activities' },
  { label: 'Write Blog', icon: FileText, link: '/admin/blogs', color: 'bg-purple-500', desc: 'WYSIWYG editor' },
  { label: 'Gallery', icon: Image, link: '/admin/gallery', color: 'bg-green-500', desc: 'Upload photos' },
  { label: 'Leadership', icon: Users, link: '/admin/leadership', color: 'bg-navy', desc: 'EC roster & bios' },
  { label: 'Expo Regs', icon: Briefcase, link: '/admin/expo-registrations', color: 'bg-orange', desc: 'Registrations' },
  { label: 'Form Builder', icon: ClipboardList, link: '/admin/forms', color: 'bg-teal', desc: 'Create forms' },
  { label: 'Settings', icon: Settings, link: '/admin/settings', color: 'bg-gray-600', desc: 'Site config' },
]

const CMS_FEATURES = [
  { icon: Home, title: 'Homepage Manager', desc: 'Control hero slides, featured events, testimonials, and section visibility — all without code.', link: '/admin/homepage', color: 'text-indigo-500' },
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Track form submissions, content stats, prayer requests, newsletter growth, and expo registrations.', link: '/admin/analytics', color: 'text-teal' },
  { icon: Briefcase, title: 'Expo Registrations', desc: 'Manage Business Expo attendees and pitchers. Export to Excel or PDF.', link: '/admin/expo-registrations', color: 'text-orange' },
  { icon: ClipboardList, title: 'Form Builder', desc: 'Create registration forms for any event. Submissions saved to Supabase, exportable as Excel/PDF.', link: '/admin/forms', color: 'text-purple-500' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [expoStats, setExpoStats] = useState(null)
  const [formCount, setFormCount] = useState(null)
  const [health, setHealth] = useState({ brevo: 'checking', ai: 'checking', db: 'checking' })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])
  const [todaySummary, setTodaySummary] = useState(null)
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    // Main stats
    adminAPI.dashboard()
      .then(data => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false))

    // Expo stats
    expoAPI.getStats()
      .then(data => setExpoStats(data))
      .catch(() => setExpoStats(null))

    // Forms count
    formsAPI.getAllAdmin()
      .then(data => setFormCount((data.forms || []).filter(f => f.status === 'open').length))
      .catch(() => setFormCount(null))

    // Health check
    fetch('/api/health')
      .then(r => r.json())
      .then(data => setHealth({ brevo: data.brevo ? 'ok' : 'error', ai: data.groq ? 'ok' : 'error', db: 'ok' }))
      .catch(() => setHealth({ brevo: 'error', ai: 'error', db: 'error' }))

    // Recent activity + today summary
    const today = new Date().toISOString().split('T')[0]
    Promise.all([
      contactAPI.getAll().catch(() => ({ contacts: [] })),
      prayerAPI.getAll().catch(() => ({ requests: [] })),
      newsletterAPI.getAll().catch(() => ({ subscribers: [] })),
      expoAPI.getRegistrations({ limit: 20 }).catch(() => ({ registrations: [] })),
    ]).then(([cont, pray, news, expo]) => {
      const contacts = cont.contacts || []
      const prayers = pray.requests || []
      const subscribers = news.subscribers || []
      const registrations = expo.registrations || []

      // Build activity feed — last 15 items across all modules
      const activities = [
        ...contacts.slice(0, 5).map(c => ({
          id: `contact-${c.id}`, type: 'contact', icon: Mail, color: 'text-orange', bg: 'bg-orange/10',
          title: `New message from ${c.name}`, sub: c.subject, time: c.created_at, link: '/admin/contacts',
        })),
        ...prayers.slice(0, 5).map(p => ({
          id: `prayer-${p.id}`, type: 'prayer', icon: Heart, color: 'text-red-500', bg: 'bg-red-50',
          title: `Prayer request from ${p.name || 'Anonymous'}`, sub: p.request?.slice(0, 60) + (p.request?.length > 60 ? '...' : ''), time: p.created_at, link: '/admin/prayer',
        })),
        ...subscribers.slice(0, 5).map(s => ({
          id: `sub-${s.id}`, type: 'subscriber', icon: Newspaper, color: 'text-teal', bg: 'bg-teal/10',
          title: `New newsletter subscriber`, sub: s.email, time: s.subscribed_at, link: '/admin/newsletter',
        })),
        ...registrations.slice(0, 5).map(r => ({
          id: `expo-${r.id}`, type: 'expo', icon: Briefcase, color: 'text-orange', bg: 'bg-orange/10',
          title: `Expo registration — ${r.participation_type === 'pitcher' ? 'Pitcher' : 'Attendee'}`, sub: r.full_name, time: r.registered_at, link: '/admin/expo-registrations',
        })),
      ]
        .filter(a => a.time)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 15)

      setRecentActivity(activities)

      // Today's summary
      const todayContacts = contacts.filter(c => c.created_at?.startsWith(today)).length
      const todayPrayers = prayers.filter(p => p.created_at?.startsWith(today)).length
      const todaySubs = subscribers.filter(s => s.subscribed_at?.startsWith(today)).length
      const todayExpo = registrations.filter(r => r.registered_at?.startsWith(today)).length
      const pendingPrayers = prayers.filter(p => p.status === 'pending').length
      const newMessages = contacts.filter(c => c.status === 'new').length

      setTodaySummary({ todayContacts, todayPrayers, todaySubs, todayExpo, pendingPrayers, newMessages })
    }).finally(() => setActivityLoading(false))
  }, [])

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

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-montserrat font-black text-navy text-xl sm:text-2xl mb-1">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm">MUTCU Website CMS — manage your website content, events, and communications.</p>
      </div>

      {/* System health strip */}
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
              {health[item.key] === 'checking' ? '...' : health[item.key] === 'ok' ? '✓' : '✗'}
            </span>
          </div>
        ))}
        {(health.brevo === 'error' || health.ai === 'error') && (
          <Link to="/admin/settings" className="ml-auto text-xs font-montserrat font-semibold text-orange hover:underline flex items-center gap-1">
            <Settings size={11} /> Fix in Settings
          </Link>
        )}
      </div>

      {/* Today's summary */}
      {todaySummary && (todaySummary.todayContacts > 0 || todaySummary.todayPrayers > 0 || todaySummary.todaySubs > 0 || todaySummary.todayExpo > 0 || todaySummary.newMessages > 0 || todaySummary.pendingPrayers > 0) && (
        <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-4 sm:p-5 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={16} className="text-orange" />
            <h2 className="font-montserrat font-bold text-white text-sm">Today at a Glance</h2>
            <span className="text-white/40 text-xs font-montserrat">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'New Messages', value: todaySummary.todayContacts, icon: Mail, link: '/admin/contacts', highlight: todaySummary.todayContacts > 0 },
              { label: 'Unread Messages', value: todaySummary.newMessages, icon: Mail, link: '/admin/contacts', highlight: todaySummary.newMessages > 0 },
              { label: 'Prayer Requests', value: todaySummary.todayPrayers, icon: Heart, link: '/admin/prayer', highlight: todaySummary.todayPrayers > 0 },
              { label: 'Pending Prayers', value: todaySummary.pendingPrayers, icon: Heart, link: '/admin/prayer', highlight: todaySummary.pendingPrayers > 0 },
              { label: 'New Subscribers', value: todaySummary.todaySubs, icon: Newspaper, link: '/admin/newsletter', highlight: todaySummary.todaySubs > 0 },
              { label: 'Expo Registrations', value: todaySummary.todayExpo, icon: Briefcase, link: '/admin/expo-registrations', highlight: todaySummary.todayExpo > 0 },
            ].filter(s => s.value > 0).map((s, i) => (
              <Link key={i} to={s.link} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-center">
                <s.icon size={14} className={s.highlight ? 'text-orange' : 'text-white/50'} />
                <div className={`font-montserrat font-black text-lg ${s.highlight ? 'text-orange' : 'text-white/60'}`}>{s.value}</div>
                <div className="text-white/60 text-xs font-montserrat leading-tight">{s.label}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Active Events" value={loading ? '...' : stats?.events} icon={Calendar} color="text-blue-500" bg="bg-blue-50" link="/admin/events" sub="this semester" />
        <StatCard label="Published Blogs" value={loading ? '...' : stats?.blogs} icon={FileText} color="text-purple-500" bg="bg-purple-50" link="/admin/blogs" sub="live articles" />
        <StatCard label="Gallery Photos" value={loading ? '...' : stats?.gallery} icon={Image} color="text-green-500" bg="bg-green-50" link="/admin/gallery" sub="in collection" />
        <StatCard label="Subscribers" value={loading ? '...' : stats?.subscribers} icon={Newspaper} color="text-teal" bg="bg-teal/10" link="/admin/newsletter" sub="newsletter" />
        <StatCard label="New Messages" value={loading ? '...' : stats?.newContacts} icon={Mail} color="text-orange" bg="bg-orange/10" link="/admin/contacts" sub="unread" />
        <StatCard label="Prayer Requests" value={loading ? '...' : stats?.pendingPrayers} icon={Heart} color="text-red-500" bg="bg-red-50" link="/admin/prayer" sub="pending" />
        <StatCard label="Leaders" value={loading ? '...' : stats?.leaders} icon={Users} color="text-navy" bg="bg-navy/10" link="/admin/leadership" sub="EC + Patrons" />
        <StatCard label="Ministries" value={loading ? '...' : (stats?.ministries ?? 10)} icon={Church} color="text-indigo-500" bg="bg-indigo-50" link="/admin/ministries" sub="all active" />
      </div>

      {/* Expo + Forms stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
              <Briefcase size={18} className="text-orange" />
            </div>
            <Link to="/admin/expo-registrations" className="text-xs text-orange font-montserrat font-semibold hover:underline">View all →</Link>
          </div>
          <div className="text-xl sm:text-2xl font-montserrat font-black text-navy mb-0.5">{expoStats ? expoStats.total : '—'}</div>
          <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">Expo Registrations</div>
          {expoStats && (
            <div className="flex gap-3 mt-2">
              <span className="text-xs text-gray-500 font-montserrat">{expoStats.attendees} attendees</span>
              <span className="text-xs text-orange font-montserrat font-semibold">{expoStats.pitchers} pitchers</span>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
              <ClipboardList size={18} className="text-teal" />
            </div>
            <Link to="/admin/forms" className="text-xs text-orange font-montserrat font-semibold hover:underline">Manage →</Link>
          </div>
          <div className="text-xl sm:text-2xl font-montserrat font-black text-navy mb-0.5">{formCount !== null ? formCount : '—'}</div>
          <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">Open Forms</div>
          <div className="text-xs text-gray-300 mt-0.5">accepting registrations</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <SlidersHorizontal size={18} className="text-indigo-500" />
            </div>
            <Link to="/admin/expo-settings" className="text-xs text-orange font-montserrat font-semibold hover:underline">Edit →</Link>
          </div>
          <div className="text-xl sm:text-2xl font-montserrat font-black text-navy mb-0.5">Expo</div>
          <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">Page Settings</div>
          <div className="text-xs text-gray-300 mt-0.5">photos & content</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-6">
        <h2 className="font-montserrat font-bold text-navy text-sm sm:text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {QUICK_ACTIONS.map((a, i) => (
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

      {/* Bottom row: Activity feed + CMS features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2">
              <Activity size={14} className="text-orange" /> Recent Activity
            </h3>
            <span className="text-xs text-gray-400 font-montserrat">Last 15 actions</span>
          </div>
          {activityLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange" />
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-montserrat">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
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

        {/* CMS Features */}
        <div className="space-y-3">
          {CMS_FEATURES.map((f, i) => (
            <Link key={i} to={f.link} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group flex items-start gap-3">
              <f.icon size={20} className={`${f.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="font-montserrat font-bold text-navy text-sm mb-0.5 group-hover:text-orange transition-colors">{f.title}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{f.desc}</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-orange transition-colors flex-shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* DMS + Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
          <p className="text-white/60 text-sm mb-4 leading-relaxed">The DMS manages member registration, nominations, and leadership data that powers this website's dynamic content.</p>
          <div className="flex flex-wrap gap-2">
            <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
              <ExternalLink size={13} /> Open DMS Portal
            </a>
            <Link to="/admin/leadership" className="btn-outline-white btn-sm">Update Leadership</Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-orange" /> Getting Started Tips
          </h3>
          <ul className="space-y-2.5">
            {[
              { tip: 'Go to Homepage Manager to control hero slides and section visibility.', link: '/admin/homepage' },
              { tip: 'Events marked as "Featured" (⭐) appear on the homepage.', link: '/admin/events' },
              { tip: 'Blog posts must be set to "Published" to appear on the website.', link: '/admin/blogs' },
              { tip: 'Test your email configuration in Settings → AI & Email tab.', link: '/admin/settings' },
              { tip: 'Use Form Builder to create registration forms for any event.', link: '/admin/forms' },
              { tip: 'Expo page photos can be changed without code in Expo Settings.', link: '/admin/expo-settings' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                <Link to={item.link} className="text-gray-500 hover:text-orange transition-colors">{item.tip}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}