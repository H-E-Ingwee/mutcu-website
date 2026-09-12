import { useEffect, useState } from 'react'
import { eventsAPI } from '../lib/api'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const SERVICE_TYPES = ['ALL', 'SUNDAY', 'FRIDAY', 'SPECIAL', 'OUTREACH', 'TRAINING']
const TYPE_COLORS = { SUNDAY: 'badge-navy', FRIDAY: 'badge-orange', SPECIAL: 'badge-teal', OUTREACH: 'badge-green', TRAINING: 'badge-gray' }
const TYPE_ICONS = { SUNDAY: 'fa-church', FRIDAY: 'fa-fire', SPECIAL: 'fa-star', OUTREACH: 'fa-globe', TRAINING: 'fa-graduation-cap' }

// ─── September–December 2026 Semester Program ─────────────────────────────────
const SUNDAY_PROGRAM = [
  { id: 'sun-s1', date: '2026-09-06', topic: 'Academic Excellence', speaker: 'Orientation Department', backup: 'Orientation Department' },
  { id: 'sun-s2', date: '2026-09-13', topic: 'Bible Study Sunday', speaker: 'Bible Study, Discipleship & Training Department', backup: 'Bible Study, Discipleship & Training Department' },
  { id: 'sun-s3', date: '2026-09-20', topic: "God's Redemption Plan", speaker: 'Issa Thuo', backup: 'Natasha Amani' },
  { id: 'sun-s4', date: '2026-09-27', topic: 'Giving', speaker: 'Exec 2024/2025', backup: 'Exec 2024/2025' },
  { id: 'sun-s5', date: '2026-10-04', topic: 'Hermeneutics', speaker: 'Samuel Namano', backup: 'Caleb Esere' },
  { id: 'sun-s6', date: '2026-10-11', topic: 'Leadership', speaker: 'Daphne Kimani', backup: 'Joshua Kipkirui' },
  { id: 'sun-s7', date: '2026-10-18', topic: 'Mental Health', speaker: 'Becky Wanjiru', backup: 'John Mwanthii' },
  { id: 'sun-s8', date: '2026-10-25', topic: 'The Life and Character of Peter', speaker: 'Samson Muturi', backup: 'Emmanuel Vuma' },
  { id: 'sun-s9', date: '2026-11-01', topic: 'Christian Maturity', speaker: 'Dr. John Ndia', backup: 'Martha Thuku' },
  { id: 'sun-s10', date: '2026-11-08', topic: 'Holy Communion', speaker: 'Dr. Githaiga', backup: 'Dr. John Ndia' },
  { id: 'sun-s11', date: '2026-11-15', topic: 'Family Genesis', speaker: 'Nancy Oginde', backup: 'Mwaura Mercy' },
  { id: 'sun-s12', date: '2026-11-22', topic: 'Stewardship', speaker: 'Anne Kimathi', backup: 'Philemon Kaaria' },
  { id: 'sun-s13', date: '2026-11-29', topic: 'Newmatology', speaker: 'Simon Kande', backup: 'Purdri Kihika' },
  { id: 'sun-s14', date: '2026-12-06', topic: 'Purity', speaker: 'James Njuguna', backup: 'Mercy Mutuku' },
  { id: 'sun-s15', date: '2026-12-13', topic: 'The Man Jesus', speaker: 'Rachel Mwangi', backup: 'Peter Vaati' },
]

const FRIDAY_PROGRAM = [
  { id: 'fri-s1', date: '2026-09-11', topic: 'Bible Study Exposition', speaker: 'CMF/STEM', backup: 'CMF/STEM' },
  { id: 'fri-s2', date: '2026-09-18', topic: "God's Redemptive Plan", speaker: 'Issa Thuo', backup: 'Natasha Amani' },
  { id: 'fri-s3', date: '2026-09-25', topic: 'Prayer Kesha', speaker: 'Prayer Department', backup: 'Prayer Department' },
  { id: 'fri-s4', date: '2026-10-02', topic: 'Worship Experience', speaker: 'Music Ministry', backup: 'Music Ministry' },
  { id: 'fri-s5', date: '2026-10-09', topic: 'Creative Night', speaker: 'Creative Ministry', backup: 'Creative Ministry' },
  { id: 'fri-s6', date: '2026-10-16', topic: 'Living a Balanced Life', speaker: 'Prof Humphrey Kirimi', backup: 'Beth Kamau' },
  { id: 'fri-s7', date: '2026-10-23', topic: 'Prayer Service', speaker: 'Prayer Department', backup: 'Prayer Department' },
  { id: 'fri-s8', date: '2026-10-30', topic: 'Law and Grace', speaker: 'Jimmy Kidavasi', backup: 'Lilian Wangari' },
  { id: 'fri-s9', date: '2026-11-06', topic: 'Integrity', speaker: 'Dr Thuita', backup: 'Nicholas Mungai' },
  { id: 'fri-s10', date: '2026-11-13', topic: 'Creative Experience', speaker: 'Creative Ministry', backup: 'Creative Ministry' },
  { id: 'fri-s11', date: '2026-11-20', topic: 'Praise Fest', speaker: 'Music Ministry', backup: 'Music Ministry' },
  { id: 'fri-s12', date: '2026-11-27', topic: 'Newmatology', speaker: 'Simon Kande', backup: 'Purdri Kihika' },
  { id: 'fri-s13', date: '2026-12-04', topic: 'Prayer Service', speaker: 'Prayer Department', backup: 'Prayer Department' },
  { id: 'fri-s14', date: '2026-12-11', topic: 'Christmas Cantata', speaker: 'Creative Ministry', backup: 'Creative Ministry' },
]

const SPECIAL_ACTIVITIES = [
  { id: 'act-s1', date: '2026-09-12', activity: 'Church Prayer Stretch & Bible Study Pastor\'s Training' },
  { id: 'act-s2', date: '2026-09-19', activity: 'Prayer Walk & Evangelism Training' },
  { id: 'act-s3', date: '2026-09-22', activity: 'Spacks Ministry' },
  { id: 'act-s4', date: '2026-09-26', activity: 'Leaders Retreat' },
  { id: 'act-s5', date: '2026-09-27', activity: 'Accountability Training' },
  { id: 'act-s6', date: '2026-10-03', activity: 'CREAM Hangout' },
  { id: 'act-s7', date: '2026-10-04', activity: 'Apologetics Forum' },
  { id: 'act-s8', date: '2026-10-17', activity: 'Music Training' },
  { id: 'act-s9', date: '2026-10-19', activity: 'Mbuzi Forum' },
  { id: 'act-s10', date: '2026-10-20', activity: 'Ladies Retreat' },
  { id: 'act-s11', date: '2026-10-28', activity: 'Play' },
  { id: 'act-s12', date: '2026-11-07', activity: 'Leaders Training' },
  { id: 'act-s13', date: '2026-11-14', activity: 'Prayer Retreat' },
  { id: 'act-s14', date: '2026-11-21', activity: 'Leaders Prayer Stretch & Ladies Initiative' },
]

// Build static events from program
const STATIC_EVENTS = [
  ...SUNDAY_PROGRAM.map(s => ({
    id: s.id, title: s.topic, date: s.date, service_type: 'SUNDAY',
    speaker: s.speaker, description: s.backup ? `Back-up: ${s.backup}` : '',
    time: '10:00 AM', location: 'MUT Chapel', image_url: '/assets/images/church2.jpg', is_active: true,
  })),
  ...FRIDAY_PROGRAM.map(f => ({
    id: f.id, title: f.topic, date: f.date, service_type: 'FRIDAY',
    speaker: f.speaker, description: f.backup ? `Back-up: ${f.backup}` : '',
    time: '6:00 PM', location: 'MUT Chapel', image_url: '/assets/images/prayer1.jpg', is_active: true,
  })),
]

function EventCard({ event }) {
  const dateStr = event.date ? new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const today = new Date().toISOString().split('T')[0]
  const isPast = event.date && event.date < today
  const isToday = event.date === today

  return (
    <div className={`card h-full flex flex-col ${isPast ? 'opacity-60' : ''}`}>
      {event.image_url && (
        <div className="relative overflow-hidden h-36 flex-shrink-0">
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            <span className={`badge ${TYPE_COLORS[event.service_type] || 'badge-gray'} text-xs`}>
              <i className={`fas ${TYPE_ICONS[event.service_type] || 'fa-calendar'} mr-1`} />
              {event.service_type}
            </span>
            {isToday && <span className="badge badge-orange text-xs animate-pulse">TODAY</span>}
          </div>
        </div>
      )}
      <div className="card-body flex flex-col flex-1 p-4">
        <h4 className="font-montserrat font-bold text-navy text-sm mb-2 leading-snug">{event.title}</h4>
        <div className="space-y-1 text-xs text-gray-400 mt-auto">
          {dateStr && <div><i className="fas fa-calendar-alt mr-2 text-orange" />{dateStr}</div>}
          {event.time && <div><i className="fas fa-clock mr-2 text-orange" />{event.time}</div>}
          {event.location && <div><i className="fas fa-map-marker-alt mr-2 text-orange" />{event.location}</div>}
          {event.speaker && <div><i className="fas fa-microphone mr-2 text-orange" />{event.speaker}</div>}
          {event.description && <div className="text-gray-300 italic text-xs">{event.description}</div>}
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [activeTab, setActiveTab] = useState('program')
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1)) // Sep 2026

  useEffect(() => {
    eventsAPI.getAll({ limit: 200 })
      .then(data => { if (data.events?.length > 0) setEvents(data.events); else setEvents(STATIC_EVENTS) })
      .catch(() => setEvents(STATIC_EVENTS))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const filtered = events.filter(e => {
    const typeMatch = filter === 'ALL' || e.service_type === filter
    const timeMatch = showUpcoming ? (e.date >= today) : (e.date < today)
    return typeMatch && timeMatch
  }).sort((a, b) => showUpcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))

  const displayActivities = (showUpcoming
    ? SPECIAL_ACTIVITIES.filter(a => a.date >= today)
    : SPECIAL_ACTIVITIES.filter(a => a.date < today)
  ).sort((a, b) => showUpcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))

  return (
    <div>
      <PageHero
        title="Events & Programs"
        subtitle="September – December 2026 Semester Program. Sunday services, Friday fellowships, and special activities."
        image="/assets/images/church2.jpg"
        badge="Semester 2 · 2026"
      />

      {/* Sticky Filter Bar */}
      <section className="py-4 bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button onClick={() => setActiveTab('program')}
                className={`px-4 py-2 text-sm font-montserrat font-semibold transition-all ${activeTab === 'program' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <i className="fas fa-list mr-1.5" />Services
              </button>
              <button onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 text-sm font-montserrat font-semibold transition-all ${activeTab === 'calendar' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <i className="fas fa-calendar-alt mr-1.5" />Calendar
              </button>
              <button onClick={() => setActiveTab('activities')}
                className={`px-4 py-2 text-sm font-montserrat font-semibold transition-all ${activeTab === 'activities' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <i className="fas fa-star mr-1.5" />Activities
              </button>
            </div>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              <button onClick={() => setShowUpcoming(true)}
                className={`px-3 py-2 text-sm font-montserrat font-semibold transition-all ${showUpcoming ? 'bg-orange text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                Upcoming
              </button>
              <button onClick={() => setShowUpcoming(false)}
                className={`px-3 py-2 text-sm font-montserrat font-semibold transition-all ${!showUpcoming ? 'bg-orange text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                Past
              </button>
            </div>
            {activeTab === 'program' && (
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_TYPES.map(t => (
                  <button key={t} onClick={() => setFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all ${filter === t ? 'bg-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'calendar' ? (
            /* ─── Calendar View ──────────────────────────────────────────────── */
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                  className="btn-outline btn-sm"><i className="fas fa-chevron-left" /></button>
                <h3 className="font-montserrat font-bold text-navy text-lg">
                  {calendarMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                  className="btn-outline btn-sm"><i className="fas fa-chevron-right" /></button>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-montserrat font-bold text-gray-400 py-2">{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              {(() => {
                const year = calendarMonth.getFullYear()
                const month = calendarMonth.getMonth()
                const firstDay = new Date(year, month, 1).getDay()
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const cells = []
                for (let i = 0; i < firstDay; i++) cells.push(null)
                for (let d = 1; d <= daysInMonth; d++) cells.push(d)
                while (cells.length % 7 !== 0) cells.push(null)

                const allEvents = [...STATIC_EVENTS]
                const getEventsForDay = (day) => {
                  if (!day) return []
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  return allEvents.filter(e => e.date === dateStr)
                }

                return (
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => {
                      const dayEvents = getEventsForDay(day)
                      const isToday = day && `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` === today
                      return (
                        <div key={i} className={`min-h-16 rounded-xl p-1.5 border transition-all ${day ? 'bg-white border-gray-100 hover:border-orange/30' : 'bg-transparent border-transparent'} ${isToday ? 'border-orange bg-orange/5' : ''}`}>
                          {day && (
                            <>
                              <div className={`text-xs font-montserrat font-bold mb-1 ${isToday ? 'text-orange' : 'text-gray-500'}`}>{day}</div>
                              <div className="space-y-0.5">
                                {dayEvents.slice(0, 2).map((ev, j) => (
                                  <div key={j} className={`text-xs px-1 py-0.5 rounded font-semibold truncate ${ev.service_type === 'SUNDAY' ? 'bg-navy/10 text-navy' : ev.service_type === 'FRIDAY' ? 'bg-orange/10 text-orange' : 'bg-teal/10 text-teal'}`}>
                                    {ev.title.length > 12 ? ev.title.slice(0, 12) + '…' : ev.title}
                                  </div>
                                ))}
                                {dayEvents.length > 2 && <div className="text-xs text-gray-400 font-semibold">+{dayEvents.length - 2} more</div>}
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-5 text-xs font-montserrat font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-navy/20" />Sunday Service</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange/20" />Friday Fellowship</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal/20" />Special Event</span>
              </div>
            </div>
          ) : activeTab === 'program' ? (
            loading ? <LoadingSpinner text="Loading program..." /> : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((ev, i) => (
                  <div key={ev.id} data-aos="fade-up" data-aos-delay={Math.min(i * 40, 320)}>
                    <EventCard event={ev} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <i className="fas fa-calendar-times text-5xl mb-4 block" />
                <h3 className="font-montserrat font-bold text-xl mb-2">No events found</h3>
                <p className="text-sm">Try a different filter or check back soon.</p>
              </div>
            )
          ) : (
            <div>
              <SectionTitle title="Special Activities" subtitle="September – December 2026 special programs, campaigns, and events." />
              {displayActivities.length > 0 ? (
                <div className="max-w-3xl mx-auto space-y-3">
                  {displayActivities.map((act, i) => {
                    const d = new Date(act.date)
                    const dateStr = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
                    const isToday = act.date === today
                    return (
                      <div key={act.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all"
                        data-aos="fade-up" data-aos-delay={i * 40}>
                        <div className="w-14 h-14 rounded-xl bg-navy flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-orange font-montserrat font-black text-lg leading-none">{d.getDate()}</span>
                          <span className="text-white/60 text-xs">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-montserrat font-bold text-navy text-sm">{act.activity}</div>
                          <div className="text-gray-400 text-xs mt-0.5">{dateStr}</div>
                        </div>
                        {isToday && <span className="badge badge-orange text-xs">TODAY</span>}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <i className="fas fa-calendar-check text-5xl mb-4 block" />
                  <p>No {showUpcoming ? 'upcoming' : 'past'} activities to show.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Full Program Table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Full Semester Program" subtitle="September – December 2026 complete schedule at a glance." />
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-8">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-xs uppercase tracking-wider">Topic</th>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-xs uppercase tracking-wider hidden md:table-cell">Speaker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...SUNDAY_PROGRAM, ...FRIDAY_PROGRAM]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((item, i) => {
                    const isSunday = item.id.startsWith('sun')
                    const d = new Date(item.date)
                    const isPast = item.date < today
                    return (
                      <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${isPast ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">
                          {d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`badge text-xs ${isSunday ? 'badge-navy' : 'badge-orange'}`}>
                            {isSunday ? 'Sunday' : 'Friday'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-navy text-sm">{item.topic}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs hidden md:table-cell">{item.speaker}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-12 bg-navy text-center">
        <div className="max-w-2xl mx-auto px-4" data-aos="fade-up">
          <i className="fas fa-file-word text-orange text-4xl mb-4 block" />
          <h3 className="font-montserrat font-black text-white text-2xl mb-3">Download Full Program</h3>
          <p className="text-white/60 mb-6">Get the complete September – December 2026 semester program document.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/assets/images/SEPTEMBER - DECEMBER PROGRAM.docx" download className="btn-primary btn-lg">
              <i className="fas fa-download" /> Download Program
            </a>
            <a href="https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/"
              target="_blank" rel="noopener noreferrer" className="btn-outline-white btn-lg">
              <i className="fab fa-facebook-f" /> Follow on Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}