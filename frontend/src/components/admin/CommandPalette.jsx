import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogsAPI, eventsAPI, contactAPI, prayerAPI, resourcesAPI, leadershipAPI } from '../../lib/api'
import { Search, FileText, Calendar, Mail, Heart, BookOpen, Users, X, ArrowRight, Command } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: '🏠', category: 'Navigation' },
  { label: 'Analytics', path: '/admin/analytics', icon: '📊', category: 'Navigation' },
  { label: 'Calendar', path: '/admin/calendar', icon: '📅', category: 'Navigation' },
  { label: 'Add Event', path: '/admin/events', icon: '➕', category: 'Quick Action' },
  { label: 'New Blog Post', path: '/admin/blogs', icon: '✍️', category: 'Quick Action' },
  { label: 'Upload Photo', path: '/admin/gallery', icon: '🖼️', category: 'Quick Action' },
  { label: 'Expo Registrations', path: '/admin/expo-registrations', icon: '🏆', category: 'Navigation' },
  { label: 'Form Builder', path: '/admin/forms', icon: '📋', category: 'Navigation' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️', category: 'Navigation' },
  { label: 'Admin Users', path: '/admin/users', icon: '👥', category: 'Navigation' },
  { label: 'Audit Log', path: '/admin/audit-log', icon: '📜', category: 'Navigation' },
]

const RESULT_ICONS = {
  blog: FileText,
  event: Calendar,
  contact: Mail,
  prayer: Heart,
  resource: BookOpen,
  leader: Users,
}

const RESULT_COLORS = {
  blog: 'text-purple-500 bg-purple-50',
  event: 'text-blue-500 bg-blue-50',
  contact: 'text-orange bg-orange/10',
  prayer: 'text-red-500 bg-red-50',
  resource: 'text-teal bg-teal/10',
  leader: 'text-navy bg-navy/10',
}

const RESULT_PATHS = {
  blog: '/admin/blogs',
  event: '/admin/events',
  contact: '/admin/contacts',
  prayer: '/admin/prayer',
  resource: '/admin/resources',
  leader: '/admin/leadership',
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const searchTimeout = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Search across all modules
  const search = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    const term = q.toLowerCase()
    const allResults = []

    try {
      const [blRes, evRes, contRes, prayRes, resRes, leadRes] = await Promise.allSettled([
        blogsAPI.getAllAdmin(),
        eventsAPI.getAll({ limit: 200 }),
        contactAPI.getAll(),
        prayerAPI.getAll(),
        resourcesAPI.getAll(),
        leadershipAPI.getAll(),
      ])

      if (blRes.status === 'fulfilled') {
        (blRes.value.blogs || [])
          .filter(b => b.title?.toLowerCase().includes(term) || b.author?.toLowerCase().includes(term) || b.tags?.toLowerCase().includes(term))
          .slice(0, 3)
          .forEach(b => allResults.push({ type: 'blog', id: b.id, title: b.title, sub: `${b.status} · ${b.author || 'MUTCU'}`, path: '/admin/blogs' }))
      }
      if (evRes.status === 'fulfilled') {
        (evRes.value.events || [])
          .filter(e => e.title?.toLowerCase().includes(term) || e.speaker?.toLowerCase().includes(term) || e.location?.toLowerCase().includes(term))
          .slice(0, 3)
          .forEach(e => allResults.push({ type: 'event', id: e.id, title: e.title, sub: `${e.service_type} · ${e.date}`, path: '/admin/events' }))
      }
      if (contRes.status === 'fulfilled') {
        (contRes.value.contacts || [])
          .filter(c => c.name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term) || c.subject?.toLowerCase().includes(term))
          .slice(0, 3)
          .forEach(c => allResults.push({ type: 'contact', id: c.id, title: c.name, sub: c.subject, path: '/admin/contacts' }))
      }
      if (prayRes.status === 'fulfilled') {
        (prayRes.value.requests || [])
          .filter(r => r.name?.toLowerCase().includes(term) || r.request?.toLowerCase().includes(term))
          .slice(0, 2)
          .forEach(r => allResults.push({ type: 'prayer', id: r.id, title: r.name || 'Anonymous', sub: r.request?.slice(0, 60), path: '/admin/prayer' }))
      }
      if (resRes.status === 'fulfilled') {
        (resRes.value.resources || [])
          .filter(r => r.title?.toLowerCase().includes(term) || r.description?.toLowerCase().includes(term))
          .slice(0, 2)
          .forEach(r => allResults.push({ type: 'resource', id: r.id, title: r.title, sub: `${r.type} · ${r.category}`, path: '/admin/resources' }))
      }
      if (leadRes.status === 'fulfilled') {
        (leadRes.value.leadership || [])
          .filter(l => l.name?.toLowerCase().includes(term) || l.role?.toLowerCase().includes(term))
          .slice(0, 2)
          .forEach(l => allResults.push({ type: 'leader', id: l.id, title: l.name, sub: l.role, path: '/admin/leadership' }))
      }
    } catch {}

    setResults(allResults)
    setSelectedIndex(0)
    setLoading(false)
  }, [])

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimeout.current)
    if (query.trim()) {
      searchTimeout.current = setTimeout(() => search(query), 300)
    } else {
      setResults([])
    }
    return () => clearTimeout(searchTimeout.current)
  }, [query, search])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      const allItems = query.trim() ? results : QUICK_LINKS
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, allItems.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = allItems[selectedIndex]
        if (item) { navigate(item.path); onClose() }
      }
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, results, selectedIndex, query, navigate, onClose])

  const handleSelect = (path) => { navigate(path); onClose() }

  if (!open) return null

  const showQuickLinks = !query.trim()
  const items = showQuickLinks ? QUICK_LINKS : results

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200"
        onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search blogs, events, contacts, resources..."
            className="flex-1 text-sm font-lato text-navy placeholder-gray-400 focus:outline-none bg-transparent"
          />
          {loading && <div className="w-4 h-4 rounded-full border-2 border-orange/30 border-t-orange animate-spin flex-shrink-0" />}
          {query && !loading && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X size={15} />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 text-xs font-montserrat flex-shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {showQuickLinks && (
            <div className="px-3 py-2">
              <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">Quick Links</p>
              {QUICK_LINKS.map((item, i) => (
                <button key={item.path} onClick={() => handleSelect(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${i === selectedIndex ? 'bg-orange/10' : 'hover:bg-gray-50'}`}>
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-semibold text-navy text-sm">{item.label}</div>
                    <div className="text-gray-400 text-xs">{item.category}</div>
                  </div>
                  <ArrowRight size={13} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}

          {!showQuickLinks && results.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-400">
              <Search size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-montserrat font-semibold">No results for "{query}"</p>
              <p className="text-xs mt-0.5">Try a different search term</p>
            </div>
          )}

          {!showQuickLinks && results.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((item, i) => {
                const Icon = RESULT_ICONS[item.type] || Search
                const colorClass = RESULT_COLORS[item.type] || 'text-gray-500 bg-gray-100'
                return (
                  <button key={`${item.type}-${item.id}`} onClick={() => handleSelect(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${i === selectedIndex ? 'bg-orange/10' : 'hover:bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat font-semibold text-navy text-sm truncate">{item.title}</div>
                      {item.sub && <div className="text-gray-400 text-xs truncate">{item.sub}</div>}
                    </div>
                    <span className="text-xs font-montserrat font-bold text-gray-300 capitalize flex-shrink-0">{item.type}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400 font-montserrat">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-gray-100 text-xs">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-gray-100 text-xs">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-gray-100 text-xs">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}