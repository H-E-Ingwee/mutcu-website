import { useEffect, useState, useMemo } from 'react'
import { eventsAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check, Star, Search, Copy, Calendar } from 'lucide-react'
import ImagePicker from '../../components/admin/ImagePicker'

const SERVICE_TYPES = ['SUNDAY', 'FRIDAY', 'SPECIAL', 'OUTREACH', 'TRAINING']
const EMPTY = { title: '', description: '', date: '', time: '', location: '', image_url: '', service_type: 'SUNDAY', speaker: '', is_active: true, is_featured: false }

const TYPE_COLORS = {
  SUNDAY: 'bg-blue-100 text-blue-700',
  FRIDAY: 'bg-orange/10 text-orange',
  SPECIAL: 'bg-teal/10 text-teal',
  OUTREACH: 'bg-green-100 text-green-700',
  TRAINING: 'bg-gray-100 text-gray-600',
}

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all') // all | upcoming | past

  const load = () => {
    setLoading(true)
    eventsAPI.getAll({ limit: 200 }).then(d => setEvents(d.events || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (ev) => { setForm({ ...EMPTY, ...ev, date: ev.date?.split('T')[0] || ev.date || '' }); setModal(ev) }

  const handleDuplicate = async (ev) => {
    try {
      const copy = { ...ev, title: `${ev.title} (Copy)`, is_featured: false, id: undefined }
      await eventsAPI.create(copy)
      toast.success('Event duplicated!')
      load()
    } catch (err) { toast.error(err.message || 'Failed to duplicate') }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.date) return toast.error('Title and date are required')
    setSaving(true)
    try {
      if (modal === 'add') { await eventsAPI.create(form); toast.success('Event created') }
      else { await eventsAPI.update(modal.id, form); toast.success('Event updated') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try { await eventsAPI.delete(id); toast.success('Event deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const toggleFeatured = async (ev) => {
    try {
      await eventsAPI.update(ev.id, { is_featured: !ev.is_featured })
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, is_featured: !e.is_featured } : e))
      toast.success(ev.is_featured ? 'Removed from homepage' : 'Added to homepage ⭐')
    } catch (err) { toast.error('Failed') }
  }

  const today = new Date().toISOString().split('T')[0]

  const filtered = useMemo(() => {
    let list = events
    if (typeFilter !== 'all') list = list.filter(e => e.service_type === typeFilter)
    if (timeFilter === 'upcoming') list = list.filter(e => e.date >= today)
    if (timeFilter === 'past') list = list.filter(e => e.date < today)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(e => e.title?.toLowerCase().includes(q) || e.speaker?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
    }
    return list
  }, [events, typeFilter, timeFilter, search, today])

  const upcoming = events.filter(e => e.date >= today).length
  const featured = events.filter(e => e.is_featured).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Events Management</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-blue-600 font-semibold">{upcoming} upcoming</span>
            <span className="text-xs text-orange font-semibold">{featured} featured</span>
            <span className="text-xs text-gray-400">{events.length} total</span>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm self-start sm:self-auto"><Plus size={14} /> Add Event</button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, speaker, or location..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Time filter */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[['all', 'All'], ['upcoming', 'Upcoming'], ['past', 'Past']].map(([val, label]) => (
              <button key={val} onClick={() => setTimeFilter(val)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all whitespace-nowrap ${timeFilter === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
                {label}
              </button>
            ))}
          </div>
          {/* Type filter */}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors">
            <option value="all">All Types</option>
            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Events table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Event</th>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden lg:table-cell">Speaker</th>
                  <th className="text-center px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">⭐</th>
                  <th className="text-right px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(ev => {
                  const isPast = ev.date < today
                  return (
                    <tr key={ev.id} className={`hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-navy text-sm line-clamp-1">{ev.title}</div>
                        {ev.location && <div className="text-gray-400 text-xs mt-0.5 hidden sm:block">{ev.location}</div>}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-gray-600 text-xs font-montserrat font-semibold">
                          {ev.date ? new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </div>
                        {ev.time && <div className="text-gray-400 text-xs">{ev.time}</div>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${TYPE_COLORS[ev.service_type] || 'bg-gray-100 text-gray-600'}`}>
                          {ev.service_type || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{ev.speaker || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleFeatured(ev)}
                          className={`p-1.5 rounded-lg transition-all ${ev.is_featured ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400 hover:bg-orange/10 hover:text-orange'}`}
                          title={ev.is_featured ? 'Remove from homepage' : 'Feature on homepage'}>
                          <Star size={13} fill={ev.is_featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors" title="Edit"><Edit2 size={13} /></button>
                          <button onClick={() => handleDuplicate(ev)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors" title="Duplicate"><Copy size={13} /></button>
                          <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                    <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-montserrat font-semibold text-sm">
                      {search || typeFilter !== 'all' || timeFilter !== 'all' ? 'No events match your filters' : 'No events yet'}
                    </p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-50 text-xs text-gray-400 font-montserrat">
              Showing {filtered.length} of {events.length} events
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-montserrat font-black text-navy text-base">{modal === 'add' ? 'Add Event' : 'Edit Event'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Time</label>
                  <input className="form-input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 10:00 AM" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Service Type</label>
                  <select className="form-select" value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}>
                    {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Assembly Hall" />
                </div>
              </div>
              <div>
                <label className="form-label">Speaker</label>
                <input className="form-input" value={form.speaker} onChange={e => setForm(f => ({ ...f, speaker: e.target.value }))} placeholder="Speaker name" />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Event description..." />
              </div>
              <ImagePicker label="Event Image" value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} />
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-orange" />
                  <span className="text-sm font-montserrat font-semibold text-navy">Featured on homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-orange" />
                  <span className="text-sm font-montserrat font-semibold text-navy">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Event'}
              </button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}