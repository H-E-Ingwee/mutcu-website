import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { eventsAPI, blogsAPI } from '../../lib/api'
import { ChevronLeft, ChevronRight, Calendar, FileText, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const SERVICE_TYPE_COLORS = {
  SUNDAY:   { bg: 'bg-blue-500',   text: 'text-white',   dot: 'bg-blue-500' },
  FRIDAY:   { bg: 'bg-orange',     text: 'text-white',   dot: 'bg-orange' },
  SPECIAL:  { bg: 'bg-teal',       text: 'text-white',   dot: 'bg-teal' },
  OUTREACH: { bg: 'bg-green-500',  text: 'text-white',   dot: 'bg-green-500' },
  TRAINING: { bg: 'bg-gray-500',   text: 'text-white',   dot: 'bg-gray-500' },
  BLOG:     { bg: 'bg-purple-500', text: 'text-white',   dot: 'bg-purple-500' },
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function AdminCalendar() {
  const [events, setEvents] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [view, setView] = useState('month') // month | week

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      eventsAPI.getAll({ limit: 500 }),
      blogsAPI.getAllAdmin(),
    ]).then(([evRes, blRes]) => {
      if (evRes.status === 'fulfilled') setEvents(evRes.value.events || [])
      if (blRes.status === 'fulfilled') setBlogs(blRes.value.blogs || [])
    }).finally(() => setLoading(false))
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const days = []

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false })
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true })
    }
    // Next month padding (fill to 6 rows = 42 cells)
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false })
    }
    return days
  }, [year, month])

  // Map content to dates
  const contentByDate = useMemo(() => {
    const map = {}
    events.forEach(ev => {
      if (!ev.date) return
      const key = ev.date.split('T')[0]
      if (!map[key]) map[key] = []
      map[key].push({ ...ev, _type: 'event' })
    })
    blogs.filter(b => b.status === 'published' && b.published_at).forEach(b => {
      const key = b.published_at.split('T')[0]
      if (!map[key]) map[key] = []
      map[key].push({ ...b, _type: 'blog' })
    })
    // Scheduled blogs
    blogs.filter(b => b.status === 'draft' && b.published_at).forEach(b => {
      const key = b.published_at.split('T')[0]
      if (!map[key]) map[key] = []
      map[key].push({ ...b, _type: 'scheduled_blog' })
    })
    return map
  }, [events, blogs])

  const today = new Date().toISOString().split('T')[0]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => { setCurrentDate(new Date()); setSelectedDay(today) }

  const getDateKey = (date) => date.toISOString().split('T')[0]

  const selectedDayContent = selectedDay ? (contentByDate[selectedDay] || []) : []

  // Stats for current month
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`
  const monthEvents = events.filter(e => e.date >= monthStart && e.date <= monthEnd)
  const monthBlogs = blogs.filter(b => b.published_at >= monthStart && b.published_at <= monthEnd && b.status === 'published')

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Content Calendar</h1>
          <p className="text-gray-400 text-sm mt-0.5">Events and published blog posts at a glance</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={goToday} className="btn-outline btn-sm">Today</button>
          <Link to="/admin/events" className="btn-outline btn-sm"><Plus size={13} /> Add Event</Link>
          <Link to="/admin/blogs" className="btn-outline btn-sm"><Plus size={13} /> New Blog</Link>
        </div>
      </div>

      {/* Month stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Events this month', value: monthEvents.length, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Published blogs', value: monthBlogs.length, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Sunday services', value: monthEvents.filter(e => e.service_type === 'SUNDAY').length, icon: Calendar, color: 'text-navy', bg: 'bg-navy/10' },
          { label: 'Friday fellowships', value: monthEvents.filter(e => e.service_type === 'FRIDAY').length, icon: Calendar, color: 'text-orange', bg: 'bg-orange/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={16} className={s.color} />
            </div>
            <div>
              <div className="font-montserrat font-black text-navy text-lg">{s.value}</div>
              <div className="text-gray-400 text-xs font-montserrat">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Calendar grid */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-montserrat font-black text-navy text-lg">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-2 text-center text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                const key = getDateKey(day.date)
                const dayContent = contentByDate[key] || []
                const isToday = key === today
                const isSelected = key === selectedDay
                const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDay(key)}
                    className={`min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 border-b border-r border-gray-50 cursor-pointer transition-colors ${
                      !day.isCurrentMonth ? 'bg-gray-50/50' : isSelected ? 'bg-orange/5' : isWeekend ? 'bg-gray-50/30' : 'hover:bg-gray-50'
                    } ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                    {/* Date number */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-montserrat font-bold mb-1 ${
                      isToday ? 'bg-orange text-white' : isSelected ? 'bg-navy text-white' : day.isCurrentMonth ? 'text-navy' : 'text-gray-300'
                    }`}>
                      {day.date.getDate()}
                    </div>

                    {/* Content chips — show max 3 on desktop, 2 on mobile */}
                    <div className="space-y-0.5">
                      {dayContent.slice(0, 3).map((item, j) => {
                        const isEvent = item._type === 'event'
                        const isBlog = item._type === 'blog'
                        const isScheduled = item._type === 'scheduled_blog'
                        const typeColor = isEvent
                          ? (SERVICE_TYPE_COLORS[item.service_type] || SERVICE_TYPE_COLORS.SPECIAL)
                          : isBlog
                            ? SERVICE_TYPE_COLORS.BLOG
                            : { bg: 'bg-purple-200', text: 'text-purple-700', dot: 'bg-purple-300' }

                        return (
                          <div key={j}
                            className={`${typeColor.bg} ${typeColor.text} text-xs font-montserrat font-semibold px-1.5 py-0.5 rounded-md truncate leading-tight`}
                            style={{ fontSize: '10px' }}
                            title={isEvent ? item.title : item.title}>
                            <span className="hidden sm:inline">{isEvent ? item.title : `📝 ${item.title}`}</span>
                            <span className="sm:hidden">{isEvent ? item.service_type?.slice(0, 3) : '📝'}</span>
                          </div>
                        )
                      })}
                      {dayContent.length > 3 && (
                        <div className="text-gray-400 text-xs font-montserrat" style={{ fontSize: '10px' }}>
                          +{dayContent.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right panel: legend + selected day detail */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-montserrat font-bold text-navy text-sm mb-3">Legend</h3>
            <div className="space-y-2">
              {[
                { label: 'Sunday Service', color: 'bg-blue-500' },
                { label: 'Friday Fellowship', color: 'bg-orange' },
                { label: 'Special Event', color: 'bg-teal' },
                { label: 'Outreach', color: 'bg-green-500' },
                { label: 'Training', color: 'bg-gray-500' },
                { label: 'Blog Post', color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${item.color}`} />
                  <span className="text-gray-600 text-xs font-montserrat">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected day detail */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-montserrat font-bold text-navy text-sm mb-3">
              {selectedDay
                ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
                : 'Select a day'}
            </h3>
            {!selectedDay ? (
              <p className="text-gray-400 text-xs font-montserrat">Click any date to see its content</p>
            ) : selectedDayContent.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-xs font-montserrat">Nothing scheduled</p>
                <div className="flex gap-2 justify-center mt-3">
                  <Link to="/admin/events" className="text-xs text-orange hover:underline font-montserrat font-semibold">+ Event</Link>
                  <span className="text-gray-300">·</span>
                  <Link to="/admin/blogs" className="text-xs text-orange hover:underline font-montserrat font-semibold">+ Blog</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayContent.map((item, i) => {
                  const isEvent = item._type === 'event'
                  const typeColor = isEvent
                    ? (SERVICE_TYPE_COLORS[item.service_type] || SERVICE_TYPE_COLORS.SPECIAL)
                    : SERVICE_TYPE_COLORS.BLOG

                  return (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${typeColor.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-montserrat font-bold text-navy text-xs truncate">{item.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5">
                          {isEvent ? (
                            <>{item.service_type}{item.time ? ` · ${item.time}` : ''}{item.speaker ? ` · ${item.speaker}` : ''}</>
                          ) : (
                            <>Blog · {item.author || 'MUTCU'}</>
                          )}
                        </div>
                      </div>
                      <Link
                        to={isEvent ? '/admin/events' : '/admin/blogs'}
                        className="text-gray-300 hover:text-orange transition-colors flex-shrink-0">
                        <i className="fas fa-arrow-right text-xs" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Upcoming events quick list */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-montserrat font-bold text-navy text-sm mb-3 flex items-center gap-2">
              <Calendar size={13} className="text-orange" /> Upcoming
            </h3>
            <div className="space-y-2">
              {events
                .filter(e => e.date >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                    onClick={() => { setSelectedDay(ev.date.split('T')[0]); setCurrentDate(new Date(ev.date)) }}>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 flex-col">
                      <div className="font-montserrat font-black text-blue-600 text-xs leading-none">{new Date(ev.date).getDate()}</div>
                      <div className="text-blue-400 font-montserrat" style={{ fontSize: '9px' }}>{new Date(ev.date).toLocaleDateString('en-GB', { month: 'short' })}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat font-semibold text-navy text-xs truncate">{ev.title}</div>
                      <div className="text-gray-400 text-xs">{ev.service_type}</div>
                    </div>
                  </div>
                ))}
              {events.filter(e => e.date >= today).length === 0 && (
                <p className="text-gray-400 text-xs font-montserrat">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}