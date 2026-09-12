import { useEffect, useState } from 'react'
import { newsletterAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Download, Newspaper } from 'lucide-react'

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const load = () => {
    setLoading(true)
    newsletterAPI.getAll().then(d => setSubscribers(d.subscribers || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return
    try { await newsletterAPI.delete(id); toast.success('Subscriber removed'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const exportCSV = () => {
    const csv = ['Email,Subscribed At,Active', ...subscribers.map(s => `${s.email},${s.subscribed_at},${s.is_active}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'mutcu-newsletter-subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = query.trim() ? subscribers.filter(s => s.email.toLowerCase().includes(query.toLowerCase())) : subscribers
  const active = subscribers.filter(s => s.is_active).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Newsletter Subscribers</h1>
          <p className="text-gray-400 text-sm mt-0.5">{active} active · {subscribers.length} total</p>
        </div>
        <button onClick={exportCSV} className="btn-outline btn-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input type="text" placeholder="Search by email..." value={query} onChange={e => setQuery(e.target.value)} className="form-input pl-9" />
      </div>

      {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden sm:table-cell">Subscribed</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy">{s.email}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(s.subscribed_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`badge text-xs ${s.is_active ? 'badge-green' : 'badge-gray'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400">
                  <Newspaper size={32} className="mx-auto mb-2" />
                  <p>{query ? 'No subscribers found' : 'No subscribers yet'}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}