import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { notificationsAPI } from '../../lib/api'
import { Bell, Mail, Heart, Briefcase, ClipboardList, X, CheckCheck, Trash2 } from 'lucide-react'

const TYPE_CONFIG = {
  contact:  { icon: Mail,          color: 'text-orange',   bg: 'bg-orange/10',   label: 'Message' },
  prayer:   { icon: Heart,         color: 'text-red-500',  bg: 'bg-red-50',      label: 'Prayer' },
  expo:     { icon: Briefcase,     color: 'text-orange',   bg: 'bg-orange/10',   label: 'Expo' },
  form:     { icon: ClipboardList, color: 'text-teal',     bg: 'bg-teal/10',     label: 'Form' },
  system:   { icon: Bell,          color: 'text-navy',     bg: 'bg-navy/10',     label: 'System' },
}

function formatTime(t) {
  if (!t) return ''
  const d = new Date(t)
  const now = new Date()
  const diff = Math.floor((now - d) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const pollRef = useRef(null)

  const fetchCount = useCallback(async () => {
    try {
      const data = await notificationsAPI.getCount()
      setUnread(data.unread || 0)
    } catch {}
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await notificationsAPI.getAll(20)
      setNotifications(data.notifications || [])
      setUnread(data.unread || 0)
    } catch {}
    finally { setLoading(false) }
  }, [])

  // Poll for new notifications every 60 seconds
  useEffect(() => {
    fetchCount()
    pollRef.current = setInterval(fetchCount, 60000)
    return () => clearInterval(pollRef.current)
  }, [fetchCount])

  // Fetch full list when dropdown opens
  useEffect(() => {
    if (open) fetchAll()
  }, [open, fetchAll])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnread(0)
    } catch {}
  }

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnread(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const handleClearRead = async () => {
    try {
      await notificationsAPI.clearRead()
      setNotifications(prev => prev.filter(n => !n.is_read))
    } catch {}
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors"
        aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white font-montserrat font-black text-xs px-1"
            style={{ background: '#FF9700', fontSize: '10px' }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-orange" />
              <span className="font-montserrat font-bold text-navy text-sm">Notifications</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-montserrat font-bold text-white" style={{ background: '#FF9700' }}>
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs font-montserrat font-semibold text-gray-400 hover:text-orange transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                  title="Mark all as read">
                  <CheckCheck size={12} />
                  <span className="hidden sm:inline">All read</span>
                </button>
              )}
              {notifications.some(n => n.is_read) && (
                <button onClick={handleClearRead}
                  className="flex items-center gap-1 text-xs font-montserrat font-semibold text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                  title="Clear read notifications">
                  <Trash2 size={12} />
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-montserrat font-semibold">No notifications yet</p>
                <p className="text-xs mt-0.5">New contacts, prayers, and registrations will appear here</p>
              </div>
            ) : (
              notifications.map(n => {
                const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.system
                const Icon = tc.icon
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors cursor-pointer ${!n.is_read ? 'bg-orange/3' : 'hover:bg-gray-50'}`}
                    onClick={() => { handleMarkRead(n.id); setOpen(false) }}>
                    {/* Unread dot */}
                    <div className="flex-shrink-0 mt-1 relative">
                      <div className={`w-8 h-8 rounded-xl ${tc.bg} flex items-center justify-center`}>
                        <Icon size={14} className={tc.color} />
                      </div>
                      {!n.is_read && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange border-2 border-white" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-montserrat leading-snug ${!n.is_read ? 'font-bold text-navy' : 'font-semibold text-gray-600'}`}>
                        {n.title}
                      </div>
                      {n.body && (
                        <div className="text-gray-400 text-xs mt-0.5 truncate">{n.body}</div>
                      )}
                      <div className="text-gray-300 text-xs mt-0.5">{formatTime(n.created_at)}</div>
                    </div>
                    {/* Link arrow */}
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={e => { e.stopPropagation(); handleMarkRead(n.id); setOpen(false) }}
                        className="flex-shrink-0 text-gray-300 hover:text-orange transition-colors mt-1">
                        <i className="fas fa-arrow-right text-xs" />
                      </Link>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-400 font-montserrat">
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                {unread > 0 ? ` · ${unread} unread` : ' · all read'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}