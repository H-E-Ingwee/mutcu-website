import { useEffect, useState } from 'react'
import { adminAPI, eventsAPI, blogsAPI, galleryAPI, contactAPI, prayerAPI, newsletterAPI, leadershipAPI } from '../../lib/api'
import { BarChart2, Users, Mail, Heart, Image, Calendar, FileText, Newspaper, TrendingUp, Eye } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color, sub, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend >= 0 ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-montserrat font-black text-navy mb-0.5">{value ?? '—'}</div>
      <div className="text-gray-400 text-xs font-montserrat font-semibold uppercase tracking-wide">{label}</div>
      {sub && <div className="text-gray-300 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}

function MiniBar({ label, value, max, color = 'bg-orange' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-gray-500 truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-6 text-xs font-bold text-navy text-right flex-shrink-0">{value}</div>
    </div>
  )
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [contacts, setContacts] = useState([])
  const [prayers, setPrayers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [events, setEvents] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminAPI.dashboard(),
      contactAPI.getAll(),
      prayerAPI.getAll(),
      blogsAPI.getAllAdmin(),
      eventsAPI.getAll({ limit: 200 }),
      newsletterAPI.getAll(),
      galleryAPI.getAll({ limit: 200 }),
    ]).then(([dash, cont, pray, bl, ev, news, gal]) => {
      setStats(dash.stats)
      setContacts(cont.contacts || [])
      setPrayers(pray.requests || [])
      setBlogs(bl.blogs || [])
      setEvents(ev.events || [])
      setSubscribers(news.subscribers || [])
      setGallery(gal.gallery || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Computed stats
  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date().toISOString().slice(0, 7)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  const newContactsThisMonth = contacts.filter(c => c.created_at?.startsWith(thisMonth)).length
  const newContactsLastMonth = contacts.filter(c => c.created_at?.startsWith(lastMonth)).length
  const newSubsThisMonth = subscribers.filter(s => s.subscribed_at?.startsWith(thisMonth)).length
  const newPrayersThisMonth = prayers.filter(p => p.created_at?.startsWith(thisMonth)).length
  const upcomingEvents = events.filter(e => e.date >= today).length
  const publishedBlogs = blogs.filter(b => b.status === 'published').length
  const draftBlogs = blogs.filter(b => b.status === 'draft').length

  // Prayer by status
  const prayerPending = prayers.filter(p => p.status === 'pending').length
  const prayerPrayed = prayers.filter(p => p.status === 'prayed_for').length
  const prayerAnswered = prayers.filter(p => p.status === 'answered').length

  // Contact by status
  const contactNew = contacts.filter(c => c.status === 'new').length
  const contactRead = contacts.filter(c => c.status === 'read').length
  const contactReplied = contacts.filter(c => c.status === 'replied').length

  // Events by type
  const eventTypes = {}
  events.forEach(e => { eventTypes[e.service_type] = (eventTypes[e.service_type] || 0) + 1 })
  const maxEventType = Math.max(...Object.values(eventTypes), 1)

  // Gallery by category
  const galCats = {}
  gallery.forEach(g => { galCats[g.category] = (galCats[g.category] || 0) + 1 })
  const maxGalCat = Math.max(...Object.values(galCats), 1)

  // Recent contacts
  const recentContacts = [...contacts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
  const recentBlogs = [...blogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-montserrat font-black text-navy text-xl">Analytics & Insights</h1>
        <p className="text-gray-400 text-sm mt-0.5">Website performance and content overview — {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* ─── Key Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Events" value={stats?.events} icon={Calendar} color="bg-blue-500" sub={`${upcomingEvents} upcoming`} />
        <StatCard label="Published Blogs" value={publishedBlogs} icon={FileText} color="bg-purple-500" sub={`${draftBlogs} drafts`} />
        <StatCard label="Gallery Photos" value={stats?.gallery} icon={Image} color="bg-green-500" sub={`${Object.keys(galCats).length} categories`} />
        <StatCard label="Subscribers" value={stats?.subscribers} icon={Newspaper} color="bg-teal" sub={`+${newSubsThisMonth} this month`} trend={newSubsThisMonth} />
        <StatCard label="New Messages" value={contactNew} icon={Mail} color="bg-orange" sub={`${contacts.length} total`} trend={newContactsThisMonth - newContactsLastMonth} />
        <StatCard label="Prayer Requests" value={prayerPending} icon={Heart} color="bg-red-500" sub="pending intercession" />
        <StatCard label="Leaders" value={stats?.leaders} icon={Users} color="bg-navy" sub="EC + Patrons" />
        <StatCard label="Ministries" value={10} icon={BarChart2} color="bg-indigo-500" sub="all active" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* ─── Prayer Requests ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
            <Heart size={14} className="text-red-500" /> Prayer Requests
          </h3>
          <div className="space-y-3">
            <MiniBar label="Pending" value={prayerPending} max={prayers.length} color="bg-orange" />
            <MiniBar label="Prayed For" value={prayerPrayed} max={prayers.length} color="bg-blue-400" />
            <MiniBar label="Answered" value={prayerAnswered} max={prayers.length} color="bg-green-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
            Total: {prayers.length} requests · {newPrayersThisMonth} this month
          </div>
        </div>

        {/* ─── Contact Messages ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
            <Mail size={14} className="text-orange" /> Contact Messages
          </h3>
          <div className="space-y-3">
            <MiniBar label="New" value={contactNew} max={contacts.length} color="bg-orange" />
            <MiniBar label="Read" value={contactRead} max={contacts.length} color="bg-blue-400" />
            <MiniBar label="Replied" value={contactReplied} max={contacts.length} color="bg-green-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
            Total: {contacts.length} messages · {newContactsThisMonth} this month
          </div>
        </div>

        {/* ─── Events by Type ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" /> Events by Type
          </h3>
          <div className="space-y-3">
            {Object.entries(eventTypes).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <MiniBar key={type} label={type} value={count} max={maxEventType}
                color={type === 'SUNDAY' ? 'bg-navy' : type === 'FRIDAY' ? 'bg-orange' : type === 'SPECIAL' ? 'bg-teal' : type === 'OUTREACH' ? 'bg-green-500' : 'bg-gray-400'} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
            Total: {events.length} events · {upcomingEvents} upcoming
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ─── Recent Messages ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2">
              <Mail size={14} className="text-orange" /> Recent Messages
            </h3>
            <a href="/admin/contacts" className="text-orange text-xs font-semibold hover:underline">View all →</a>
          </div>
          <div className="space-y-3">
            {recentContacts.length > 0 ? recentContacts.map(c => (
              <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0 text-orange font-bold text-xs">
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-navy text-xs">{c.name}</span>
                    <span className={`badge text-xs ${c.status === 'new' ? 'badge-orange' : c.status === 'replied' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span>
                  </div>
                  <div className="text-gray-500 text-xs truncate">{c.subject}</div>
                  <div className="text-gray-300 text-xs">{new Date(c.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-4">No messages yet</p>}
          </div>
        </div>

        {/* ─── Recent Blog Posts ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2">
              <FileText size={14} className="text-purple-500" /> Recent Blog Posts
            </h3>
            <a href="/admin/blogs" className="text-orange text-xs font-semibold hover:underline">View all →</a>
          </div>
          <div className="space-y-3">
            {recentBlogs.length > 0 ? recentBlogs.map(b => (
              <div key={b.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={12} className="text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-navy text-xs truncate">{b.title}</span>
                    <span className={`badge text-xs ml-2 flex-shrink-0 ${b.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{b.status}</span>
                  </div>
                  <div className="text-gray-400 text-xs">{b.author || 'MUTCU'} · {new Date(b.created_at).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-4">No blog posts yet</p>}
          </div>
        </div>
      </div>

      {/* ─── Gallery by Category ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
          <Image size={14} className="text-green-500" /> Gallery by Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(galCats).map(([cat, count]) => (
            <div key={cat} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-xl font-montserrat font-black text-navy">{count}</div>
              <div className="text-gray-400 text-xs capitalize mt-0.5">{cat}</div>
            </div>
          ))}
          {Object.keys(galCats).length === 0 && <p className="text-gray-400 text-sm col-span-6 text-center py-4">No gallery photos yet</p>}
        </div>
      </div>

      {/* ─── Newsletter Growth ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
          <Newspaper size={14} className="text-teal" /> Newsletter Subscribers
        </h3>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-montserrat font-black text-navy">{subscribers.filter(s => s.is_active).length}</div>
            <div className="text-gray-400 text-xs">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-montserrat font-black text-orange">+{newSubsThisMonth}</div>
            <div className="text-gray-400 text-xs">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-montserrat font-black text-gray-300">{subscribers.filter(s => !s.is_active).length}</div>
            <div className="text-gray-400 text-xs">Inactive</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-400 mb-1">Active rate</div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${subscribers.length > 0 ? Math.round((subscribers.filter(s => s.is_active).length / subscribers.length) * 100) : 0}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">{subscribers.length > 0 ? Math.round((subscribers.filter(s => s.is_active).length / subscribers.length) * 100) : 0}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}