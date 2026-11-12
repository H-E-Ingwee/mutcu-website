import { useEffect, useState } from 'react'
import { leadershipAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check, Users } from 'lucide-react'
import ImagePicker from '../../components/admin/ImagePicker'

const ROLE_SLUGS = [
  'chairman', 'vice-chair1', 'vice-chair2', 'secretary', 'vice-secretary',
  'treasurer', 'bible-study', 'prayer', 'missions', 'music', 'technical', 'creative',
]

const EMPTY = {
  name: '', role: '', role_slug: '', photo_url: '', bio: '', personal_message: '',
  email: '', is_patron: false, is_active: true, display_order: 0, spiritual_year: '2025/2026',
}

export default function AdminLeadership() {
  const [leaders, setLeaders] = useState([])
  const [patrons, setPatrons] = useState([])
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('ec')
  const [yearFilter, setYearFilter] = useState('all')

  const load = () => {
    setLoading(true)
    Promise.all([
      leadershipAPI.getAll(),
      leadershipAPI.getPatrons(),
      leadershipAPI.getYears(),
    ])
      .then(([l, p, y]) => {
        setLeaders(l.leadership || [])
        setPatrons(p.patrons || [])
        setYears(y.years || [])
      })
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
      if (modal === 'add') { await leadershipAPI.create(form); toast.success('Leader added!') }
      else { await leadershipAPI.update(modal.id, form); toast.success('Leader updated!') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leader?')) return
    try { await leadershipAPI.delete(id); toast.success('Leader deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  // Filter by year
  const baseList = tab === 'ec' ? leaders : patrons
  const displayed = yearFilter === 'all'
    ? baseList
    : baseList.filter(l => l.spiritual_year === yearFilter)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Leadership Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage EC members and patrons displayed on the website</p>
        </div>
        <button onClick={() => openAdd(tab === 'patrons')} className="btn-primary btn-sm self-start sm:self-auto">
          <Plus size={14} /> Add {tab === 'patrons' ? 'Patron' : 'Leader'}
        </button>
      </div>

      {/* EC / Patrons tabs */}
      <div className="flex gap-2 mb-4">
        {[['ec', 'Executive Committee'], ['patrons', "Patron's Office"]].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setYearFilter('all') }}
            className={`px-4 py-2 rounded-xl text-sm font-montserrat font-bold transition-all ${tab === key ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Year filter — only show if years exist */}
      {years.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          <button onClick={() => setYearFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all ${yearFilter === 'all' ? 'bg-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All Years
          </button>
          {years.map(y => (
            <button key={y} onClick={() => setYearFilter(y)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all ${yearFilter === y ? 'bg-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {y}
            </button>
          ))}
        </div>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-sm text-blue-700 flex items-start gap-2">
        <i className="fas fa-info-circle mt-0.5 flex-shrink-0 text-xs" />
        <span className="text-xs">Leaders added here override the DMS data on the About page. Leave empty to use DMS data automatically.</span>
      </div>

      {/* Leader grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-montserrat font-semibold text-sm">
            {yearFilter !== 'all' ? `No leaders for ${yearFilter}` : `No ${tab === 'patrons' ? 'patrons' : 'leaders'} added yet`}
          </p>
          <p className="text-gray-300 text-xs mt-1">Add one or use DMS data automatically</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map(leader => (
            <div key={leader.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:border-orange/20 hover:shadow-sm transition-all">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <img
                  src={leader.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=04003D&color=FF9700&size=200&bold=true`}
                  alt={leader.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=04003D&color=FF9700&size=200&bold=true` }}
                />
                {leader.is_active && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" title="Active" />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-montserrat font-bold text-navy text-sm truncate">{leader.name}</div>
                <div className="text-orange text-xs font-semibold truncate mt-0.5">{leader.role}</div>
                {leader.spiritual_year && (
                  <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-montserrat font-semibold">
                    {leader.spiritual_year}
                  </div>
                )}
                {leader.email && (
                  <div className="text-gray-400 text-xs mt-1 truncate">{leader.email}</div>
                )}
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => openEdit(leader)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors"
                  title="Edit">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => handleDelete(leader.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-montserrat font-black text-navy text-base">
                {modal === 'add' ? 'Add Leader' : 'Edit Leader'}
              </h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Photo preview + picker */}
              <div>
                <label className="form-label">Photo</label>
                <div className="flex items-start gap-4">
                  {/* Live photo preview */}
                  <div className="flex-shrink-0">
                    <img
                      src={form.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'Leader')}&background=04003D&color=FF9700&size=200&bold=true`}
                      alt="Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'Leader')}&background=04003D&color=FF9700&size=200&bold=true` }}
                    />
                    <p className="text-gray-400 text-xs text-center mt-1">Preview</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <ImagePicker
                      label=""
                      value={form.photo_url}
                      onChange={url => setForm(f => ({ ...f, photo_url: url }))}
                    />
                  </div>
                </div>
              </div>

              {/* Name + Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full name" />
                </div>
                <div>
                  <label className="form-label">Role *</label>
                  <input className="form-input" value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. Chairman" />
                </div>
              </div>

              {/* Role slug + Spiritual year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Role Slug</label>
                  <select className="form-select" value={form.role_slug}
                    onChange={e => setForm(f => ({ ...f, role_slug: e.target.value }))}>
                    <option value="">Select slug...</option>
                    {ROLE_SLUGS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Spiritual Year</label>
                  <input className="form-input" value={form.spiritual_year}
                    onChange={e => setForm(f => ({ ...f, spiritual_year: e.target.value }))}
                    placeholder="2025/2026" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@mutcu.org" />
              </div>

              {/* Bio */}
              <div>
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" rows={3} value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Brief biography..." />
              </div>

              {/* Personal message */}
              <div>
                <label className="form-label">Personal Message <span className="text-gray-400 font-normal">(shown on committee page)</span></label>
                <textarea className="form-textarea" rows={3} value={form.personal_message}
                  onChange={e => setForm(f => ({ ...f, personal_message: e.target.value }))}
                  placeholder="A word from this leader..." />
              </div>

              {/* Display order + toggles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-input" value={form.display_order}
                    onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex flex-col gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_patron}
                      onChange={e => setForm(f => ({ ...f, is_patron: e.target.checked }))}
                      className="w-4 h-4 accent-orange" />
                    <span className="text-sm font-montserrat font-semibold text-navy">Is Patron</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active}
                      onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                      className="w-4 h-4 accent-orange" />
                    <span className="text-sm font-montserrat font-semibold text-navy">Active</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : modal === 'add' ? 'Add Leader' : 'Save Changes'}
              </button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}