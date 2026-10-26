import { useEffect, useState, useCallback } from 'react'
import { expoAPI, getToken } from '../../lib/api'
import toast from 'react-hot-toast'
import {
  Users, Mic, Download, Trash2, RefreshCw,
  Search, Filter, CheckCircle, Clock, XCircle, Star,
  FileSpreadsheet, FileText, TrendingUp, Mail, Phone
} from 'lucide-react'

const STATUS_CONFIG = {
  confirmed:  { label: 'Confirmed',  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle },
  waitlisted: { label: 'Waitlisted', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: XCircle },
  attended:   { label: 'Attended',   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: Star },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, color, bg, sub }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={color} />
      </div>
      <div className="text-2xl font-montserrat font-black text-navy mb-0.5">{value ?? '—'}</div>
      <div className="text-xs font-montserrat font-semibold text-gray-400 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gray-300 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminExpoRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected] = useState(null) // detail modal
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [exportingExcel, setExportingExcel] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filterType) params.type = filterType
      if (filterStatus) params.status = filterStatus
      if (search.trim()) params.search = search.trim()
      const [regData, statsData] = await Promise.all([
        expoAPI.getRegistrations(params),
        expoAPI.getStats(),
      ])
      setRegistrations(regData.registrations || [])
      setStats(statsData)
    } catch (err) {
      toast.error('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStatus, search])

  useEffect(() => { load() }, [load])

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id)
    try {
      await expoAPI.updateStatus(id, status)
      toast.success(`Status updated to ${STATUS_CONFIG[status]?.label}`)
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await expoAPI.delete(id)
      toast.success('Registration deleted')
      setRegistrations(prev => prev.filter(r => r.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (err) {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportExcel = async () => {
    setExportingExcel(true)
    try {
      const token = getToken()
      const url = expoAPI.exportExcel(filterType)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `MUTCU-Expo-2027-Registrations-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('Excel file downloaded!')
    } catch (err) {
      toast.error('Excel export failed')
    } finally {
      setExportingExcel(false)
    }
  }

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      const token = getToken()
      const url = expoAPI.exportPdf(filterType)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `MUTCU-Expo-2027-Registrations-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('PDF file downloaded!')
    } catch (err) {
      toast.error('PDF export failed')
    } finally {
      setExportingPdf(false)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-2xl mb-0.5">Expo 2027 Registrations</h1>
          <p className="text-gray-400 text-sm">MUTCU Business Exposition — Beyond Ideas: Blueprint of a CEO</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-semibold text-gray-500 bg-white border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={handleExportExcel} disabled={exportingExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all disabled:opacity-60"
            style={{ background: '#16A34A' }}>
            <FileSpreadsheet size={13} />
            {exportingExcel ? 'Exporting...' : 'Export Excel'}
          </button>
          <button onClick={handleExportPdf} disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all disabled:opacity-60"
            style={{ background: '#DC2626' }}>
            <FileText size={13} />
            {exportingPdf ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats?.total ?? '...'} icon={Users} color="text-navy" bg="bg-navy/10" sub="all registrations" />
        <StatCard label="Attendees" value={stats?.attendees ?? '...'} icon={Users} color="text-blue-500" bg="bg-blue-50" sub="free entry" />
        <StatCard label="Pitchers" value={stats?.pitchers ?? '...'} icon={Mic} color="text-orange" bg="bg-orange/10" sub="Founder's Arena" />
        <StatCard label="Confirmed" value={stats?.confirmed ?? '...'} icon={CheckCircle} color="text-green-500" bg="bg-green-50" sub="active" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or business..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors"
            />
          </div>
          {/* Type filter */}
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors">
            <option value="">All Types</option>
            <option value="attendee">Attendees</option>
            <option value="pitcher">Pitchers</option>
          </select>
          {/* Status filter */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors">
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="attended">Attended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {(search || filterType || filterStatus) && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-400 font-montserrat">
              Showing {registrations.length} result{registrations.length !== 1 ? 's' : ''}
            </span>
            <button onClick={() => { setSearch(''); setFilterType(''); setFilterStatus('') }}
              className="text-xs text-orange hover:underline font-montserrat font-semibold">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-montserrat font-semibold text-sm">No registrations found</p>
            <p className="text-gray-300 text-xs mt-1">
              {search || filterType || filterStatus ? 'Try adjusting your filters' : 'Registrations will appear here once submitted'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Registered</th>
                  <th className="text-right px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, i) => (
                  <tr key={reg.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                    onClick={() => setSelected(reg)}>
                    <td className="px-4 py-3">
                      <div className="font-montserrat font-bold text-navy text-sm">{reg.full_name}</div>
                      {reg.course && <div className="text-gray-400 text-xs">{reg.course}{reg.year_of_study ? ` · ${reg.year_of_study}` : ''}</div>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="text-gray-600 text-xs">{reg.email}</div>
                      <div className="text-gray-400 text-xs">{reg.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold ${
                        reg.participation_type === 'pitcher'
                          ? 'text-orange bg-orange/10 border border-orange/20'
                          : 'text-navy bg-navy/8 border border-navy/15'
                      }`}>
                        {reg.participation_type === 'pitcher' ? <><Mic size={9} /> Pitcher</> : <><Users size={9} /> Attendee</>}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-gray-600 text-xs font-montserrat font-semibold">{reg.business_name || '—'}</div>
                      {reg.business_stage && <div className="text-gray-400 text-xs">{reg.business_stage}</div>}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={reg.status || 'confirmed'}
                        onChange={e => handleStatusUpdate(reg.id, e.target.value)}
                        disabled={updatingId === reg.id}
                        className="text-xs font-montserrat font-bold rounded-lg px-2 py-1 border border-gray-200 focus:outline-none focus:border-orange transition-colors disabled:opacity-50"
                        onClick={e => e.stopPropagation()}>
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="text-gray-400 text-xs">{formatDate(reg.registered_at)}</div>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(reg)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-all"
                          title="View details">
                          <Search size={13} />
                        </button>
                        <button onClick={() => handleDelete(reg.id)} disabled={deletingId === reg.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                          title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && registrations.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-montserrat">
              {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
              {filterType && ` · ${filterType === 'pitcher' ? 'Pitchers' : 'Attendees'} only`}
            </span>
            <div className="flex gap-2">
              <button onClick={handleExportExcel} disabled={exportingExcel}
                className="flex items-center gap-1 text-xs font-montserrat font-semibold text-green-600 hover:underline disabled:opacity-50">
                <FileSpreadsheet size={11} /> Excel
              </button>
              <span className="text-gray-300">·</span>
              <button onClick={handleExportPdf} disabled={exportingPdf}
                className="flex items-center gap-1 text-xs font-montserrat font-semibold text-red-600 hover:underline disabled:opacity-50">
                <FileText size={11} /> PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-montserrat font-black text-navy text-lg">{selected.full_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold ${
                    selected.participation_type === 'pitcher'
                      ? 'text-orange bg-orange/10 border border-orange/20'
                      : 'text-navy bg-navy/8 border border-navy/15'
                  }`}>
                    {selected.participation_type === 'pitcher' ? <><Mic size={9} /> Pitcher</> : <><Users size={9} /> Attendee</>}
                  </span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Contact */}
              <div>
                <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                <div className="space-y-2">
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-2 text-sm text-navy hover:text-orange transition-colors">
                    <Mail size={14} className="text-orange" />
                    {selected.email}
                  </a>
                  <a href={`tel:${selected.phone}`}
                    className="flex items-center gap-2 text-sm text-navy hover:text-orange transition-colors">
                    <Phone size={14} className="text-orange" />
                    {selected.phone}
                  </a>
                </div>
              </div>

              {/* Academic */}
              {(selected.course || selected.year_of_study) && (
                <div>
                  <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-2">Academic</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selected.course && (
                      <div className="p-3 rounded-xl bg-gray-50">
                        <div className="text-gray-400 text-xs mb-0.5">Course</div>
                        <div className="text-navy text-sm font-montserrat font-semibold">{selected.course}</div>
                      </div>
                    )}
                    {selected.year_of_study && (
                      <div className="p-3 rounded-xl bg-gray-50">
                        <div className="text-gray-400 text-xs mb-0.5">Year</div>
                        <div className="text-navy text-sm font-montserrat font-semibold">{selected.year_of_study}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Business (pitchers only) */}
              {selected.participation_type === 'pitcher' && (
                <div>
                  <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-2">Founder's Arena</p>
                  <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,151,0,0.06)', border: '1px solid rgba(255,151,0,0.2)' }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-gray-400 text-xs mb-0.5">Business Name</div>
                        <div className="text-navy text-sm font-montserrat font-bold">{selected.business_name || '—'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-0.5">Stage</div>
                        <div className="text-navy text-sm font-montserrat font-semibold">{selected.business_stage || '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* How heard */}
              {selected.how_heard && (
                <div>
                  <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">How They Heard</p>
                  <p className="text-sm text-gray-600">{selected.how_heard}</p>
                </div>
              )}

              {/* Message */}
              {selected.message && (
                <div>
                  <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">{selected.message}</p>
                </div>
              )}

              {/* Meta */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-montserrat">
                  Registered: {formatDate(selected.registered_at)}
                </p>
              </div>

              {/* Status update */}
              <div>
                <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => {
                    const Icon = cfg.icon
                    return (
                      <button key={val}
                        onClick={() => handleStatusUpdate(selected.id, val)}
                        disabled={updatingId === selected.id || selected.status === val}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-montserrat font-bold border transition-all disabled:opacity-50 ${
                          selected.status === val
                            ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                            : 'text-gray-500 bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}>
                        <Icon size={12} />
                        {cfg.label}
                        {selected.status === val && ' ✓'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-montserrat font-bold text-white transition-all"
                  style={{ background: '#FF9700' }}>
                  <Mail size={13} /> Email
                </a>
                <button onClick={() => handleDelete(selected.id)} disabled={deletingId === selected.id}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}