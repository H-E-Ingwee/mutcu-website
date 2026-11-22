import { useEffect, useState, useMemo } from 'react'
import { prayerAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Heart, Search, Download, CheckSquare, Lock, Globe, Send, X, RefreshCw } from 'lucide-react'
import ConfirmModal from '../../components/admin/ConfirmModal'

const STATUS_COLORS = {
  pending:    'bg-orange/10 text-orange border border-orange/20',
  prayed_for: 'bg-blue-100 text-blue-700',
  answered:   'bg-green-100 text-green-700',
}

export default function AdminPrayer() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const [bulkMarking, setBulkMarking] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [forwardModal, setForwardModal] = useState(false)
  const [forwardEmail, setForwardEmail] = useState('')
  const [forwardMessage, setForwardMessage] = useState('')
  const [forwarding, setForwarding] = useState(false)

  const load = () => {
    setLoading(true)
    prayerAPI.getAll().then(d => setRequests(d.requests || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await prayerAPI.updateStatus(id, status)
      toast.success(`Marked as ${status.replace('_', ' ')}`)
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleDelete = (id) => {
    setConfirm({
      title: 'Delete Prayer Request?',
      message: 'This prayer request will be permanently deleted.',
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await prayerAPI.delete(id)
          toast.success('Deleted')
          setRequests(prev => prev.filter(r => r.id !== id))
          setSelected(prev => prev.filter(s => s !== id))
        } catch (err) { toast.error(err.message || 'Failed') }
      }
    })
  }

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  const selectAll = () => setSelected(prev => prev.length === filtered.length ? [] : filtered.map(r => r.id))

  const bulkMarkPrayed = async () => {
    if (selected.length === 0) return toast.error('Select at least one request')
    setBulkMarking(true)
    try {
      await Promise.all(selected.map(id => prayerAPI.updateStatus(id, 'prayed_for')))
      toast.success(`${selected.length} request${selected.length !== 1 ? 's' : ''} marked as prayed for`)
      setRequests(prev => prev.map(r => selected.includes(r.id) ? { ...r, status: 'prayed_for' } : r))
      setSelected([])
    } catch { toast.error('Failed to update') }
    finally { setBulkMarking(false) }
  }

  const handleForward = async (e) => {
    e.preventDefault()
    if (!forwardEmail.trim()) return toast.error('Please enter the coordinator email')
    const idsToForward = selected.length > 0 ? selected : filtered.filter(r => r.status === 'pending').map(r => r.id)
    if (idsToForward.length === 0) return toast.error('No pending requests to forward')
    setForwarding(true)
    try {
      const res = await prayerAPI.forward(idsToForward, forwardEmail.trim(), forwardMessage.trim())
      toast.success(res.message || 'Prayer requests forwarded!')
      setForwardModal(false)
      setForwardEmail('')
      setForwardMessage('')
      setSelected([])
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to forward. Check email configuration.')
    } finally { setForwarding(false) }
  }

  const exportCSV = () => {
    setExporting(true)
    try {
      const rows = [
        ['Name', 'Request', 'Status', 'Public', 'Date'],
        ...requests.map(r => [
          r.name || 'Anonymous',
          r.request?.replace(/\n/g, ' '),
          r.status,
          r.is_public ? 'Yes' : 'No',
          r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB') : '',
        ])
      ]
      const csv = rows.map(row => row.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `mutcu-prayer-requests-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('Prayer requests exported!')
    } catch { toast.error('Export failed') }
    finally { setExporting(false) }
  }

  const filtered = useMemo(() => {
    let list = requests
    if (filter !== 'all') list = list.filter(r => r.status === filter)
    if (visibilityFilter === 'public') list = list.filter(r => r.is_public)
    if (visibilityFilter === 'private') list = list.filter(r => !r.is_public)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r => r.name?.toLowerCase().includes(q) || r.request?.toLowerCase().includes(q))
    }
    return list
  }, [requests, filter, visibilityFilter, search])

  const pending = requests.filter(r => r.status === 'pending').length
  const allSelected = filtered.length > 0 && selected.length === filtered.length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Prayer Requests</h1>
          <p className="text-gray-400 text-sm mt-0.5">{pending} pending intercession · {requests.length} total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(selected.length > 0 || pending > 0) && (
            <button onClick={() => setForwardModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all"
              style={{ background: '#04003D' }}>
              <Send size={13} />
              Forward to Prayer Ministry {selected.length > 0 ? `(${selected.length})` : `(${pending} pending)`}
            </button>
          )}
          {selected.length > 0 && (
            <button onClick={bulkMarkPrayed} disabled={bulkMarking}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all disabled:opacity-60"
              style={{ background: '#3B82F6' }}>
              <CheckSquare size={13} />{bulkMarking ? 'Marking...' : `Mark ${selected.length} as Prayed`}
            </button>
          )}
          <button onClick={exportCSV} disabled={exporting} className="btn-outline btn-sm">
            <Download size={13} />{exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or request..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
            {[['all', 'All'], ['pending', 'Pending'], ['prayed_for', 'Prayed'], ['answered', 'Answered']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all whitespace-nowrap ${filter === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[['all', 'All'], ['public', 'Public'], ['private', 'Private']].map(([val, label]) => (
              <button key={val} onClick={() => setVisibilityFilter(val)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all ${visibilityFilter === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Select all bar */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-3 mb-3 px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={allSelected} onChange={selectAll} className="w-4 h-4 accent-orange rounded" />
            <span className="text-xs font-montserrat font-semibold text-gray-500">
              {allSelected ? 'Deselect all' : `Select all ${filtered.length}`}
            </span>
          </label>
          {selected.length > 0 && <span className="text-xs text-orange font-montserrat font-bold">{selected.length} selected</span>}
        </div>
      )}

      {/* Prayer requests list */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <Heart size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-montserrat font-semibold text-sm">
            {search || filter !== 'all' || visibilityFilter !== 'all' ? 'No requests match your filters' : 'No prayer requests yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl border transition-all ${selected.includes(r.id) ? 'border-orange/40 bg-orange/2' : 'border-gray-100'}`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)}
                    className="w-4 h-4 accent-orange rounded mt-0.5 flex-shrink-0" />
                  <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                    <Heart size={13} className="text-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-montserrat font-bold text-navy text-sm">{r.name || 'Anonymous'}</span>
                        {r.is_public ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-montserrat font-semibold">
                            <Globe size={9} />Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full font-montserrat font-semibold">
                            <Lock size={9} />Private
                          </span>
                        )}
                        <span className="text-gray-300 text-xs">{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge text-xs ${STATUS_COLORS[r.status] || 'badge-gray'}`}>{r.status?.replace('_', ' ')}</span>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3 mb-3">{r.request}</p>
                    <div className="flex gap-2 flex-wrap">
                      {['pending', 'prayed_for', 'answered'].map(s => (
                        <button key={s} onClick={() => updateStatus(r.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${r.status === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-3 text-xs text-gray-400 font-montserrat text-center">
          Showing {filtered.length} of {requests.length} requests
        </div>
      )}

      {/* Forward to Prayer Ministry Modal */}
      {forwardModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setForwardModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-montserrat font-black text-navy text-base">Forward to Prayer Ministry</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {selected.length > 0 ? `${selected.length} selected request${selected.length !== 1 ? 's' : ''}` : `${pending} pending request${pending !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button onClick={() => setForwardModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <form onSubmit={handleForward} className="p-5 space-y-4">
              <div>
                <label className="form-label">Prayer Coordinator Email *</label>
                <input type="email" className="form-input" value={forwardEmail}
                  onChange={e => setForwardEmail(e.target.value)}
                  placeholder="prayer.coordinator@mutcu.org" required autoFocus />
                <p className="text-gray-400 text-xs mt-1">A formatted email with all selected prayer requests will be sent to this address.</p>
              </div>
              <div>
                <label className="form-label">Message to Coordinator <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea className="form-textarea" rows={3} value={forwardMessage}
                  onChange={e => setForwardMessage(e.target.value)}
                  placeholder="Any specific instructions or context for the prayer team..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={forwarding} className="btn-primary flex-1 justify-center">
                  {forwarding ? <><RefreshCw size={13} className="animate-spin" />Sending...</> : <><Send size={13} />Forward Requests</>}
                </button>
                <button type="button" onClick={() => setForwardModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal config={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}