import { useEffect, useState } from 'react'
import { contactAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Mail, CheckCircle } from 'lucide-react'

const STATUS_COLORS = { new: 'bg-orange/10 text-orange', read: 'bg-blue-100 text-blue-700', replied: 'bg-green-100 text-green-700', archived: 'bg-gray-100 text-gray-500' }

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    contactAPI.getAll().then(d => setContacts(d.contacts || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status)
      toast.success(`Marked as ${status}`)
      load()
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try { await contactAPI.delete(id); toast.success('Deleted'); load(); if (selected?.id === id) setSelected(null) }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Contact Messages</h1>
          <p className="text-gray-400 text-sm mt-0.5">{contacts.filter(c => c.status === 'new').length} new messages</p>
        </div>
        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied', 'archived'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${filter === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange" /></div> : filtered.map(c => (
            <div key={c.id} onClick={() => { setSelected(c); updateStatus(c.id, c.status === 'new' ? 'read' : c.status) }}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${selected?.id === c.id ? 'border-orange' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-montserrat font-bold text-navy text-sm truncate">{c.name}</div>
                <span className={`badge text-xs flex-shrink-0 ${STATUS_COLORS[c.status] || 'badge-gray'}`}>{c.status}</span>
              </div>
              <div className="text-gray-500 text-xs truncate mb-1">{c.subject}</div>
              <div className="text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString('en-GB')}</div>
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Mail size={32} className="mx-auto mb-2" />
              <p className="text-sm">No messages</p>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-montserrat font-bold text-navy text-lg">{selected.subject}</h3>
                  <div className="text-gray-400 text-sm mt-1">
                    From: <strong>{selected.name}</strong> · <a href={`mailto:${selected.email}`} className="text-orange hover:underline">{selected.email}</a>
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">{new Date(selected.created_at).toLocaleString('en-GB')}</div>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary btn-sm">
                  <Mail size={14} /> Reply via Email
                </a>
                {['read', 'replied', 'archived'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`btn-sm px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${selected.status === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s === 'replied' && <CheckCircle size={12} className="inline mr-1" />}Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <Mail size={40} className="mx-auto mb-3" />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}