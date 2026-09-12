import { useEffect, useState } from 'react'
import { prayerAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Heart } from 'lucide-react'

const STATUS_COLORS = { pending: 'bg-orange/10 text-orange', prayed_for: 'bg-blue-100 text-blue-700', answered: 'bg-green-100 text-green-700' }

export default function AdminPrayer() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    prayerAPI.getAll().then(d => setRequests(d.requests || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try { await prayerAPI.updateStatus(id, status); toast.success(`Marked as ${status.replace('_', ' ')}`); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this prayer request?')) return
    try { await prayerAPI.delete(id); toast.success('Deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Prayer Requests</h1>
          <p className="text-gray-400 text-sm mt-0.5">{requests.filter(r => r.status === 'pending').length} pending intercession</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'prayed_for', 'answered'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${filter === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div> : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                    <Heart size={14} className="text-orange" />
                  </div>
                  <div>
                    <div className="font-montserrat font-bold text-navy text-sm">{r.name || 'Anonymous'}</div>
                    <div className="text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge text-xs ${STATUS_COLORS[r.status] || 'badge-gray'}`}>{r.status?.replace('_', ' ')}</span>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 bg-gray-50 rounded-xl p-3">{r.request}</p>
              <div className="flex gap-2">
                {['pending', 'prayed_for', 'answered'].map(s => (
                  <button key={s} onClick={() => updateStatus(r.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${r.status === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Heart size={40} className="mx-auto mb-3" />
              <p>No prayer requests in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}