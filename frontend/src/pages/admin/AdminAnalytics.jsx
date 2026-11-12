import { useEffect, useState, useMemo } from 'react'
import { adminAPI, eventsAPI, blogsAPI, galleryAPI, contactAPI, prayerAPI, newsletterAPI, expoAPI, formsAPI } from '../../lib/api'
import { BarChart2, Users, Mail, Heart, Image, Calendar, FileText, Newspaper, TrendingUp, Briefcase, ClipboardList, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

// ─── Simple CSS bar chart ─────────────────────────────────────────────────────
function BarChart({ data, color = '#FF9700', height = 80 }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group relative">
          <div className="w-full rounded-t-sm transition-all duration-300"
            style={{ height: `${Math.max((d.value / max) * (height - 16), d.value > 0 ? 4 : 0)}px`, background: color, opacity: d.value > 0 ? 1 : 0.15 }} />
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-navy text-white text-xs font-montserrat font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {d.value}
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniBar({ label, value, max, color = 'bg-orange' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 sm:w-28 text-xs text-gray-500 truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <div className="w-6 text-xs font-bold text-navy text-right flex-shrink-0">{value}</div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, sub, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all">
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
      <div className="text-xl sm:text-2xl font-montserrat font-black text-navy mb-0.5">{value ?? '—'}</div>
      <div className="text-gray-400 text-xs font-montserrat font-semibold uppercase tracking-wide">{label}</div>
      {sub && <div className="text-gray-300 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}

const DATE_RANGES = [
  { label: 'This Week', days: 7 },
  { label: 'This Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: 'This Year', days: 365 },
]

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [contacts, setContacts] = useState([])
  const [prayers, setPrayers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [events, setEvents] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [gallery, setGallery] = useState([])
  const [expoStats, setExpoStats] = useState(null)
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [rangeDays, setRangeDays] = useState(30)

  useEffect(() => {
    Promise.all([
      adminAPI.dashboard(),
      contactAPI.getAll(),
      prayerAPI.getAll(),
      blogsAPI.getAllAdmin(),
      eventsAPI.getAll({ limit: 200 }),
      newsletterAPI.getAll(),
      galleryAPI.getAll({ limit: 200 }),
      expoAPI.getStats().catch(() => null),
      formsAPI.getAllAdmin().catch(() => ({ forms: [] })),
    ]).then(([dash, cont, pray, bl, ev, news, gal, expo, frms]) => {
      setStats(dash.stats)
      setContacts(cont.contacts || [])
      setPrayers(pray.requests || [])
      setBlogs(bl.blogs || [])
      setEvents(ev.events || [])
      setSubscribers(news.subscribers || [])
      setGallery(gal.gallery || [])
      setExpoStats(expo)
      setForms(frms.forms || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Date range filter
  const rangeStart = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() - rangeDays)
    return d.toISOString()
  }, [rangeDays])

  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date().toISOString().slice(0, 7)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  // Filtered by date range
  const rangeContacts = contacts.filter(c => c.created_at >= rangeStart)
  const rangePrayers = prayers.filter(p => p.created_at >= rangeStart)
  const rangeSubs = subscribers.filter(s => s.subscribed_at >= rangeStart)

  const newContactsThisMonth = contacts.filter(c => c.created_at?.startsWith(thisMonth)).length
  const newContactsLastMonth = contacts.filter(c => c.created_at?.startsWith(lastMonth)).length
  const newSubsThisMonth = subscribers.filter(s => s.subscribed_at?.startsWith(thisMonth)).length
  const newPrayersThisMonth = prayers.filter(p => p.created_at?.startsWith(thisMonth)).length
  const upcomingEvents = events.filter(e => e.date >= today).length
  const publishedBlogs = blogs.filter(b => b.status === 'published').length
  const draftBlogs = blogs.filter(b => b.status === 'draft').length

  const prayerPending = prayers.filter(p => p.status === 'pending').length
  const prayerPrayed = prayers.filter(p => p.status === 'prayed_for').length
  const prayerAnswered = prayers.filter(p => p.status === 'answered').length

  const contactNew = contacts.filter(c => c.status === 'new').length
  const contactRead = contacts.filter(c => c.status === 'read').length
  const contactReplied = contacts.filter(c => c.status === 'replied').length

  const eventTypes = {}
  events.forEach(e => { eventTypes[e.service_type] = (eventTypes[e.service_type] || 0) + 1 })
  const maxEventType = Math.max(...Object.values(eventTypes), 1)

  const galCats = {}
  gallery.forEach(g => { galCats[g.category] = (galCats[g.category] || 0) + 1 })

  const recentContacts = [...contacts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
  const recentBlogs = [...blogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

  // Trend chart data (N days)
  const trendData = useMemo(() => {
    const days = []
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      days.push({
        date: dateStr,
        contacts: contacts.filter(c => c.created_at?.startsWith(dateStr)).length,
        prayers: prayers.filter(p => p.created_at?.startsWith(dateStr)).length,
        subs: subscribers.filter(s => s.subscribed_at?.startsWith(dateStr)).length,
        label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      })
    }
    return days
  }, [contacts, prayers, subscribers, rangeDays])

  // Expo trend
  const expoTrend = useMemo(() => {
    if (!expoStats?.daily) return []
    return Object.entries(expoStats.daily).map(([date, value]) => ({ date, value, label: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }))
  }, [expoStats])

  const openForms = forms.filter(f => f.status === 'open').length
  const totalFormSubmissions = forms.reduce((sum, f) => sum + (f.submission_count || 0), 0)

  // Content performance
  const topBlogs = [...blogs].filter(b => b.status === 'published').sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at)).slice(0, 5)
  const nextEvents = events.filter(e => e.date >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
    </div>
  )

  return (
    <div>
      {/* Header + date range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Analytics & Insights</h1>
          <p className="text-gray-400 text-sm mt-0.5">Website performance and content overview</p>
        </div>
        {/* Date range selector */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
          {DATE_RANGES.map(r => (
            <button key={r.days} onClick={() => setRangeDays(r.days)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all whitespace-nowrap ${rangeDays === r.days ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Active Events" value={stats?.events} icon={Calendar} color="bg-blue-500" sub={`${upcomingEvents} upcoming`} />
        <StatCard label="Published Blogs" value={publishedBlogs} icon={FileText} color="bg-purple-500" sub={`${draftBlogs} drafts`} />
        <StatCard label="Gallery Photos" value={stats?.gallery} icon={Image} color="bg-green-500" sub={`${Object.keys(galCats).length} categories`} />
        <StatCard label="Subscribers" value={stats?.subscribers} icon={Newspaper} color="bg-teal" sub={`+${newSubsThisMonth} this month`} trend={newSubsThisMonth} />
        <StatCard label="New Messages" value={contactNew} icon={Mail} color="bg-orange" sub={`${contacts.length} total`} trend={newContactsThisMonth - newContactsLastMonth} />
        <StatCard label="Prayer Requests" value={prayerPending} icon={Heart} color="bg-red-500" sub="pending intercession" />
        <StatCard label="Leaders" value={stats?.leaders} icon={Users} color="bg-navy" sub="EC + Patrons" />
        <StatCard label="Ministries" value={stats?.ministries ?? 10} icon={BarChart2} color="bg-indigo-500" sub="all active" />
      </div>

      {/* Expo + Forms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={16} className="text-orange" />
            <h3 className="font-montserrat font-bold text-navy text-sm">Expo 2027 Registrations</h3>
          </div>
          {expoStats ? (
            <>
              <div className="text-2xl font-montserrat font-black text-navy mb-2">{expoStats.total}</div>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: 'Attendees', value: expoStats.attendees, color: 'text-navy' }, { label: 'Pitchers', value: expoStats.pitchers, color: 'text-orange' }, { label: 'Confirmed', value: expoStats.confirmed, color: 'text-green-600' }].map((s, i) => (
                  <div key={i} className="text-center p-2 rounded-xl bg-gray-50">
                    <div className={`font-montserrat font-black text-base ${s.color}`}>{s.value}</div>
                    <div className="text-gray-400 text-xs font-montserrat">{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-gray-400 text-sm">No registrations yet</p>}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={16} className="text-teal" />
            <h3 className="font-montserrat font-bold text-navy text-sm">Form Builder</h3>
          </div>
          <div className="text-2xl font-montserrat font-black text-navy mb-2">{forms.length}</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-xl bg-gray-50">
              <div className="font-montserrat font-black text-base text-green-600">{openForms}</div>
              <div className="text-gray-400 text-xs font-montserrat">Open</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-gray-50">
              <div className="font-montserrat font-black text-base text-navy">{totalFormSubmissions}</div>
              <div className="text-gray-400 text-xs font-montserrat">Submissions</div>
            </div>
          </div>
        </div>
        {/* Expo trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-orange" />
            <h3 className="font-montserrat font-bold text-navy text-sm">Expo Registrations (14d)</h3>
          </div>
          {expoTrend.length > 0 ? (
            <>
              <BarChart data={expoTrend} color="#FF9700" height={72} />
              <div className="flex justify-between mt-1">
                <span className="text-gray-300 text-xs font-montserrat">{expoTrend[0]?.label}</span>
                <span className="text-gray-300 text-xs font-montserrat">{expoTrend[expoTrend.length - 1]?.label}</span>
              </div>
            </>
          ) : <div className="flex items-center justify-center h-16 text-gray-300 text-xs font-montserrat">No data yet</div>}
        </div>
      </div>

      {/* Activity trend chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2">
            <TrendingUp size={14} className="text-orange" /> Activity Trend — {DATE_RANGES.find(r => r.days === rangeDays)?.label}
          </h3>
          <div className="flex items-center gap-4 text-xs font-montserrat">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange inline-block" />Contacts ({rangeContacts.length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Prayers ({rangePrayers.length})</span>
            <span className="flex items-center gap-1 hidden sm:flex"><span className="w-2 h-2 rounded-full bg-teal inline-block" />Subs ({rangeSubs.length})</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 font-montserrat mb-2">Contact Messages</p>
            <BarChart data={trendData.map(d => ({ value: d.contacts, label: d.label }))} color="#FF9700" height={60} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-montserrat mb-2">Prayer Requests</p>
            <BarChart data={trendData.map(d => ({ value: d.prayers, label: d.label }))} color="#EF4444" height={60} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-montserrat mb-2">Newsletter Subscribers</p>
            <BarChart data={trendData.map(d => ({ value: d.subs, label: d.label }))} color="#30D5C8" height={60} />
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-300 text-xs font-montserrat">{trendData[0]?.label}</span>
          <span className="text-gray-300 text-xs font-montserrat">{trendData[trendData.length - 1]?.label}</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2"><Heart size={14} className="text-red-500" /> Prayer Requests</h3>
          <div className="space-y-3">
            <MiniBar label="Pending" value={prayerPending} max={prayers.length} color="bg-orange" />
            <MiniBar label="Prayed For" value={prayerPrayed} max={prayers.length} color="bg-blue-400" />
            <MiniBar label="Answered" value={prayerAnswered} max={prayers.length} color="bg-green-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">Total: {prayers.length} · {newPrayersThisMonth} this month</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2"><Mail size={14} className="text-orange" /> Contact Messages</h3>
          <div className="space-y-3">
            <MiniBar label="New" value={contactNew} max={contacts.length} color="bg-orange" />
            <MiniBar label="Read" value={contactRead} max={contacts.length} color="bg-blue-400" />
            <MiniBar label="Replied" value={contactReplied} max={contacts.length} color="bg-green-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">Total: {contacts.length} · {newContactsThisMonth} this month</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> Events by Type</h3>
          <div className="space-y-3">
            {Object.entries(eventTypes).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <MiniBar key={type} label={type} value={count} max={maxEventType}
                color={type === 'SUNDAY' ? 'bg-navy' : type === 'FRIDAY' ? 'bg-orange' : type === 'SPECIAL' ? 'bg-teal' : type === 'OUTREACH' ? 'bg-green-500' : 'bg-gray-400'} />
            ))}
            {Object.keys(eventTypes).length === 0 && <p className="text-gray-400 text-xs">No events yet</p>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">Total: {events.length} · {upcomingEvents} upcoming</div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Top blogs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2"><FileText size={14} className="text-purple-500" /> Recent Published Posts</h3>
            <Link to="/admin/blogs" className="text-orange text-xs font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {topBlogs.length > 0 ? topBlogs.map(b => (
              <div key={b.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                {b.featured_image ? (
                  <img src={b.featured_image} alt={b.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-purple-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy text-xs truncate">{b.title}</div>
                  <div className="text-gray-400 text-xs">{b.author || 'MUTCU'} · {b.published_at ? new Date(b.published_at).toLocaleDateString('en-GB') : new Date(b.created_at).toLocaleDateString('en-GB')}</div>
                </div>
                <a href={`/blogs/${b.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange transition-colors flex-shrink-0">
                  <ExternalLink size={12} />
                </a>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-4">No published posts yet</p>}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> Next Upcoming Events</h3>
            <Link to="/admin/events" className="text-orange text-xs font-semibold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {nextEvents.length > 0 ? nextEvents.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 flex-col">
                  <div className="font-montserrat font-black text-blue-600 text-sm leading-none">{new Date(ev.date).getDate()}</div>
                  <div className="text-blue-400 text-xs font-montserrat">{new Date(ev.date).toLocaleDateString('en-GB', { month: 'short' })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy text-xs truncate">{ev.title}</div>
                  <div className="text-gray-400 text-xs">{ev.time || ''}{ev.speaker ? ` · ${ev.speaker}` : ''}</div>
                </div>
                <span className={`text-xs font-montserrat font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${ev.service_type === 'SUNDAY' ? 'bg-blue-100 text-blue-700' : ev.service_type === 'FRIDAY' ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-600'}`}>
                  {ev.service_type}
                </span>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-4">No upcoming events</p>}
          </div>
        </div>
      </div>

      {/* Newsletter + Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Newsletter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2"><Newspaper size={14} className="text-teal" /> Newsletter Subscribers</h3>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-montserrat font-black text-navy">{subscribers.filter(s => s.is_active).length}</div>
              <div className="text-gray-400 text-xs">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-montserrat font-black text-orange">+{newSubsThisMonth}</div>
              <div className="text-gray-400 text-xs">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-montserrat font-black text-gray-300">{subscribers.filter(s => !s.is_active).length}</div>
              <div className="text-gray-400 text-xs">Inactive</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">Active rate</div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal rounded-full" style={{ width: `${subscribers.length > 0 ? Math.round((subscribers.filter(s => s.is_active).length / subscribers.length) * 100) : 0}%` }} />
              </div>
              <div className="text-xs text-gray-400 mt-1">{subscribers.length > 0 ? Math.round((subscribers.filter(s => s.is_active).length / subscribers.length) * 100) : 0}%</div>
            </div>
          </div>
          <BarChart data={trendData.map(d => ({ value: d.subs, label: d.label }))} color="#30D5C8" height={60} />
          <div className="flex justify-between mt-1">
            <span className="text-gray-300 text-xs font-montserrat">{trendData[0]?.label}</span>
            <span className="text-gray-300 text-xs font-montserrat">{trendData[trendData.length - 1]?.label}</span>
          </div>
        </div>

        {/* Gallery by category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2"><Image size={14} className="text-green-500" /> Gallery by Category</h3>
          {Object.keys(galCats).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(galCats).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <div key={cat} className="bg-gray-50 rounded-xl p-3 text-center hover:bg-orange/5 transition-colors">
                  <div className="text-xl font-montserrat font-black text-navy">{count}</div>
                  <div className="text-gray-400 text-xs capitalize mt-0.5">{cat.replace('-', ' ')}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-4">No gallery photos yet</p>}
        </div>
      </div>
    </div>
  )
}