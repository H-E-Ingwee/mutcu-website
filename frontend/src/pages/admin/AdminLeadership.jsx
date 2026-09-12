import { useEffect, useState } from 'react'
import { leadershipAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

const ROLE_SLUGS = ['chairman', 'vice-chair1', 'vice-chair2', 'secretary', 'vice-secretary', 'treasurer', 'bible-study', 'prayer', 'missions', 'music', 'technical', 'creative']

const EMPTY = { name: '', role: '', role_slug: '', photo_url: '', bio: '', personal_message: '', email: '', is_patron: false, is_active: true, display_order: 0, spiritual_year: '2025/2026' }

export default function AdminLeadership() {
  const [leaders, setLeaders] = useState([])
  const [patrons, setPatrons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | leader object
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('ec') // ec | patrons

  const load = () => {
    setLoading(true)
    Promise.all([leadershipAPI.getAll(), leadershipAPI.getPatrons()])
      .then(([l, p]) => { setLeaders(l.leadership || []); setPatrons(p.patrons || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = (isPatron = false) => { setForm({ ...EMPTY, is_patron: isPatron }); setModal('add') }
  const openEdit = (leader) => { setForm({ ...EMPTY, ...leader }); setModal(leader) }

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim()) return toast.error('Name and role are required')
    setSaving(true)
    try {
      if (modal === 'add') {
        await leadershipAPI.create(form)
        toast.success('Leader added')
      } else {
        await leadershipAPI.update(modal.id, form)
        toast.success('Leader updated')
      }
      setModal(null)
      load()
    } catch (err) { toast.error(err.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leader?')) return
    try {
      await leadershipAPI.delete(id)
      toast.success('Leader deleted')
      load()
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const displayed = tab === 'ec' ? leaders : patrons

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Leadership Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage EC members and patrons displayed on the website</p>
        </div>
        <button onClick={() => openAdd(tab === 'patrons')} className="btn-primary btn-sm">
          <Plus size={14} /> Add {tab === 'patrons' ? 'Patron' : 'Leader'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[['ec', 'Executive Committee'], ['patrons', "Patron's Office"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-montserrat font-bold transition-all ${tab === key ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-sm text-blue-700 flex items-start gap-2">
        <i className="fas fa-info-circle mt-0.5 flex-shrink-0" />
        <span>Leaders added here override the DMS data on the About page. Leave empty to use DMS data automatically.</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map(leader => (
            <div key={leader.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
              <img src={leader.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=04003D&color=FF9700&size=200&bold=true`}
                alt={leader.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=04003D&color=FF9700&size=200&bold=true` }} />
              <div className="flex-1 min-w-0">
                <div className="font-montserrat font-bold text-navy text-sm truncate">{leader.name}</div>
                <div className="text-orange text-xs font-semibold truncate">{leader.role}</div>
                {leader.spiritual_year && <div className="text-gray-400 text-xs">{leader.spiritual_year}</div>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(leader)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(leader.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {displayed.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <i className="fas fa-users text-4xl mb-3 block" />
              <p>No {tab === 'patrons' ? 'patrons' : 'leaders'} added yet. Add one or use DMS data automatically.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-montserrat font-bold text-navy text-lg">{modal === 'add' ? 'Add Leader' : 'Edit Leader'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
                </div>
                <div>
                  <label className="form-label">Role *</label>
                  <input className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Chairman" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Role Slug</label>
                  <select className="form-select" value={form.role_slug} onChange={e => setForm(f => ({ ...f, role_slug: e.target.value }))}>
                    <option value="">Select slug...</option>
                    {ROLE_SLUGS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Spiritual Year</label>
                  <input className="form-input" value={form.spiritual_year} onChange={e => setForm(f => ({ ...f, spiritual_year: e.target.value }))} placeholder="2025/2026" />
                </div>
              </div>
              <div>
                <label className="form-label">Photo URL</label>
                <input className="form-input" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@mutcu.org" />
              </div>
              <div>
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Brief biography..." />
              </div>
              <div>
                <label className="form-label">Personal Message (shown on committee page)</label>
                <textarea className="form-textarea" rows={3} value={form.personal_message} onChange={e => setForm(f => ({ ...f, personal_message: e.target.value }))} placeholder="A word from this leader..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-input" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_patron} onChange={e => setForm(f => ({ ...f, is_patron: e.target.checked }))} className="w-4 h-4 accent-orange" />
                    <span className="text-sm font-montserrat font-semibold text-navy">Is Patron</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-orange" />
                    <span className="text-sm font-montserrat font-semibold text-navy">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Leader'}
              </button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}