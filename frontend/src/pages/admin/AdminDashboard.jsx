import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import {
  Calendar, FileText, Image, Mail, Heart, Users,
  Settings, Home, BarChart2, Globe, ExternalLink,
  Newspaper, Church, TrendingUp, ArrowRight
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, color, bg, link, sub }) {
  return (
    <Link to={link} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 block">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={color} />
      </div>
      <div className="text-2xl font-montserrat font-black text-navy mb-0.5">{value ?? '—'}</div>
      <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gray-300 mt-0.5">{sub}</div>}
    </Link>
  )
}

const QUICK_ACTIONS = [
  { label: 'Homepage', icon: Home, link: '/admin/homepage', color: 'bg-indigo-500', desc: 'Hero, events, gallery' },
  { label: 'Add Event', icon: Calendar, link: '/admin/events', color: 'bg-blue-500', desc: 'Services & activities' },
  { label: 'Write Blog', icon: FileText, link: '/admin/blogs', color: 'bg-purple-500', desc: 'WYSIWYG editor' },
  { label: 'Upload Photo', icon: Image, link: '/admin/gallery', color: 'bg-green-500', desc: 'Gallery management' },
  { label: 'Leadership', icon: Users, link: '/admin/leadership', color: 'bg-navy', desc: 'EC roster & bios' },
  { label: 'Analytics', icon: BarChart2, link: '/admin/analytics', color: 'bg-teal', desc: 'Stats & insights' },
  { label: 'Messages', icon: Mail, link: '/admin/contacts', color: 'bg-orange', desc: 'Contact inbox' },
  { label: 'Settings', icon: Settings, link: '/admin/settings', color: 'bg-gray-600', desc: 'Site configuration' },
]

const CMS_FEATURES = [
  { icon: Home, title: 'Homepage Manager', desc: 'Control hero slides, featured events, gallery preview, testimonials, and section visibility — all without code.', link: '/admin/homepage', color: 'text-indigo-500' },
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Track form submissions, content stats, prayer requests, newsletter growth, and message trends.', link: '/admin/analytics', color: 'text-teal' },
  { icon: Settings, title: 'Site Settings', desc: 'Update social media links, contact info, SEO meta tags, and site-wide configuration from one place.', link: '/admin/settings', color: 'text-gray-600' },
  { icon: FileText, title: 'Blog Editor', desc: 'Write and publish blog posts with a full WYSIWYG editor — headings, images, links, lists, and more.', link: '/admin/blogs', color: 'text-purple-500' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.dashboard()
      .then(data => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-montserrat font-black text-navy text-2xl mb-1">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm">MUTCU Website CMS — manage your website content, events, and communications.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Events" value={loading ? '...' : stats?.events} icon={Calendar} color="text-blue-500" bg="bg-blue-50" link="/admin/events" sub="this semester" />
        <StatCard label="Published Blogs" value={loading ? '...' : stats?.blogs} icon={FileText} color="text-purple-500" bg="bg-purple-50" link="/admin/blogs" sub="live articles" />
        <StatCard label="Gallery Photos" value={loading ? '...' : stats?.gallery} icon={Image} color="text-green-500" bg="bg-green-50" link="/admin/gallery" sub="in collection" />
        <StatCard label="Subscribers" value={loading ? '...' : stats?.subscribers} icon={Newspaper} color="text-teal" bg="bg-teal/10" link="/admin/newsletter" sub="newsletter" />
        <StatCard label="New Messages" value={loading ? '...' : stats?.newContacts} icon={Mail} color="text-orange" bg="bg-orange/10" link="/admin/contacts" sub="unread" />
        <StatCard label="Prayer Requests" value={loading ? '...' : stats?.pendingPrayers} icon={Heart} color="text-red-500" bg="bg-red-50" link="/admin/prayer" sub="pending" />
        <StatCard label="Leaders" value={loading ? '...' : stats?.leaders} icon={Users} color="text-navy" bg="bg-navy/10" link="/admin/leadership" sub="EC + Patrons" />
        <StatCard label="Ministries" value={10} icon={Church} color="text-indigo-500" bg="bg-indigo-50" link="/admin/ministries" sub="all active" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="font-montserrat font-bold text-navy text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_ACTIONS.map((a, i) => (
            <Link key={i} to={a.link}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all group text-center">
              <div className={`${a.color} w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <a.icon size={18} className="text-white" />
              </div>
              <div className="text-xs font-montserrat font-bold text-navy">{a.label}</div>
              <div className="text-xs text-gray-400 hidden sm:block">{a.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* CMS Features Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {CMS_FEATURES.map((f, i) => (
          <Link key={i} to={f.link} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className="flex items-start gap-3">
              <f.icon size={20} className={`${f.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <div className="font-montserrat font-bold text-navy text-sm mb-1 group-hover:text-orange transition-colors">{f.title}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{f.desc}</div>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-orange transition-colors flex-shrink-0 mt-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* DMS Link */}
        <div className="bg-navy rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange/20 flex items-center justify-center">
              <ExternalLink size={18} className="text-orange" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-white text-sm">MUTCU Member Portal</div>
              <div className="text-white/40 text-xs">portal.mutcu.org</div>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-4 leading-relaxed">The DMS manages member registration, nominations, and leadership data that powers this website's dynamic content.</p>
          <div className="flex gap-2">
            <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
              <ExternalLink size={13} /> Open DMS Portal
            </a>
            <Link to="/admin/leadership" className="btn-outline-white btn-sm">Update Leadership</Link>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-orange" /> Getting Started Tips
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-500">
            {[
              { tip: 'Run the seed.sql file in Supabase to populate all tables with real MUTCU data.', link: null },
              { tip: 'Go to Homepage Manager to control what appears on the homepage.', link: '/admin/homepage' },
              { tip: 'Leadership data is pulled from the DMS automatically when available.', link: '/admin/leadership' },
              { tip: 'Events marked as "Featured" (⭐) appear on the homepage.', link: '/admin/events' },
              { tip: 'Blog posts must be set to "Published" to appear on the website.', link: '/admin/blogs' },
              { tip: 'Update social media links and SEO in Settings.', link: '/admin/settings' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0 text-xs" />
                {item.link ? <Link to={item.link} className="hover:text-orange transition-colors">{item.tip}</Link> : <span>{item.tip}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}