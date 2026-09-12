import { Link } from 'react-router-dom'
import { useState } from 'react'
import { newsletterAPI } from '../lib/api'
import toast from 'react-hot-toast'

const SOCIAL_LINKS = [
  { icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/', label: 'Facebook' },
  { icon: 'fab fa-instagram', url: 'https://www.instagram.com/muranga_university_cu/', label: 'Instagram' },
  { icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@mutcu001', label: 'TikTok' },
  { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@murangauniversityCU', label: 'YouTube' },
]

const QUICK_LINKS = [
  { path: '/about', label: 'About MUTCU' },
  { path: '/ministries', label: 'Ministries' },
  { path: '/events', label: 'Events & Programs' },
  { path: '/sermons', label: 'Sermon Archive' },
  { path: '/blogs', label: 'Blog & Devotionals' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/resources', label: 'Resources' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/register', label: 'Join MUTCU' },
]

const MINISTRY_LINKS = [
  { path: '/ministries/prayer-ministry', label: 'Prayer Ministry' },
  { path: '/ministries/music-ministry', label: 'Music Ministry' },
  { path: '/ministries/missions-evangelism', label: 'Missions & Evangelism' },
  { path: '/ministries/bible-study', label: 'Bible Study & Training' },
  { path: '/ministries/creative-arts', label: 'Creative Arts (CREAM)' },
  { path: '/ministries/technical-department', label: 'Technical & Media' },
  { path: '/special-committees', label: 'Special Committees' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribing(true)
    try {
      const res = await newsletterAPI.subscribe(email.trim())
      toast.success(res.message || 'Subscribed successfully!')
      setEmail('')
    } catch (err) {
      toast.error(err.message || 'Subscription failed')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="footer pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/assets/images/Full Logo.png" alt="MUTCU Logo" className="h-14 mb-4"
              onError={e => { e.target.style.display = 'none' }} />
            <p className="text-white/60 text-sm leading-relaxed mb-3">
              Murang'a University of Technology Christian Union — a student-led, non-denominational fellowship
              building faith through discipleship, evangelism, and service.
            </p>
            <a href="https://focuskenya.org" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-xl text-white/70 text-xs font-montserrat font-semibold mb-4">
              <img src="/assets/images/FOCUS-Kenya-logo.webp" alt="FOCUS Kenya" className="h-4"
                onError={e => { e.target.style.display = 'none' }} />
              Affiliated to FOCUS Kenya
            </a>
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 text-sm">
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-white/60 hover:text-orange text-sm transition-colors flex items-center gap-2">
                    <i className="fas fa-chevron-right text-xs text-orange/50" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">Ministries</h4>
            <ul className="space-y-2">
              {MINISTRY_LINKS.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-white/60 hover:text-orange text-sm transition-colors flex items-center gap-2">
                    <i className="fas fa-chevron-right text-xs text-orange/50" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-sm uppercase tracking-wider mb-4">Stay Connected</h4>
            <p className="text-white/60 text-sm mb-4">Subscribe for updates on services, events, and ministry opportunities.</p>
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange transition-colors"
                  required
                />
                <button type="submit" disabled={subscribing}
                  className="px-4 py-2 bg-orange hover:bg-orange/90 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
                  {subscribing ? '...' : <i className="fas fa-paper-plane" />}
                </button>
              </div>
            </form>

            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-orange w-4" />
                <span>Murang'a University of Technology, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-envelope text-orange w-4" />
                <a href="mailto:info@mutcu.org" className="hover:text-orange transition-colors">info@mutcu.org</a>
              </div>
              <div className="flex items-center gap-2">
                <i className="fab fa-facebook-f text-orange w-4" />
                <a href="https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">MUTCU on Facebook</a>
              </div>
              <div className="flex items-center gap-2">
                <i className="fab fa-instagram text-orange w-4" />
                <a href="https://www.instagram.com/muranga_university_cu/" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">@muranga_university_cu</a>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-globe text-orange w-4" />
                <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">portal.mutcu.org</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center">
            © {new Date().getFullYear()} Murang'a University of Technology Christian Union. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <i className="fas fa-heart text-orange text-xs" />
              Inspire Love, Hope & Godliness
            </span>
            <span>·</span>
            <a href="https://focuskenya.org" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors">FOCUS Kenya</a>
          </div>
        </div>
      </div>
    </footer>
  )
}