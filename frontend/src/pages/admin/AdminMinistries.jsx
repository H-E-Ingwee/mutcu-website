import { useEffect, useState, useMemo } from 'react'
import { ministriesAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check, Search, ExternalLink, Church } from 'lucide-react'
import ImagePicker from '../../components/admin/ImagePicker'
import ConfirmModal from '../../components/admin/ConfirmModal'

const EMPTY = { name: '', slug: '', description: '', long_description: '', icon: 'fa-star', image_url: '', is_active: true, display_order: 0 }

const MINISTRY_SLUGS = [
  'prayer-ministry', 'music-ministry', 'missions-evangelism', 'bible-study',
  'discipleship', 'technical-department', 'creative-arts', 'hospitality-ministry',
  'welfare-committee', 'rmc',
]

const ICON_SUGGESTIONS = [
  'fa-praying-hands', 'fa-music', 'fa-globe', 'fa-book-open', 'fa-user-friends',
  'fa-photo-video', 'fa-theater-masks', 'fa-mug-hot', 'fa-hand-holding-heart', 'fa-donate',
  'fa-star', 'fa-cross', 'fa-church', 'fa-heart', 'fa-hands-helping',
]

export default function AdminMinistries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    ministriesAPI.getAll().then(d => setMinistries(d.ministries || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (m) => { setForm({ ...EMPTY, ...m }); setModal(m) }

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm(f => ({ ...f, name, ...(modal === 'add' || !f.slug ? { slug } : {}) }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return toast.error('Name and slug are required')
    setSaving(true)
    try {
      if (modal === 'add') { await ministriesAPI.create(form); toast.success('Ministry added!') }
      else { await ministriesAPI.update(modal.id, form); toast.success('Ministry updated!') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = (id, name) => {
    setConfirm({
      title: 'Delete Ministry?',
      message: `"${name}" will be permanently deleted. This will affect the Ministries page.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try { await ministriesAPI.delete(id); toast.success('Ministry deleted'); load() }
        catch (err) { toast.error(err.message || 'Failed') }
      }
    })
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return ministries
    const q = search.toLowerCase()
    return ministries.filter(m => m.name?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q))
  }, [ministries, search])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Ministries Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{ministries.length} ministries</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm self-start sm:self-auto"><Plus size={14} /> Add Ministry</button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-700 flex items-start gap-2">
        <i className="fas fa-info-circle mt-0.5 flex-shrink-0" />
        <span>Ministry data here overrides the static content on the Ministries page. Update descriptions and images to keep content fresh.</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search ministries..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
      </div>

      {/* Ministries grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <Church size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-montserrat font-semibold text-sm">{search ? 'No ministries match your search' : 'No ministries yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange/20 hover:shadow-sm transition-all group">
              <div className="flex items-start gap-3 mb-3">
                {/* Ministry image or icon */}
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${m.icon || 'fa-star'} text-orange text-lg`} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-montserrat font-bold text-navy text-sm">{m.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5 font-lato">/ministries/{m.slug}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-montserrat font-bold ${m.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {m.is_active ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-gray-300 text-xs font-montserrat">Order: {m.display_order}</span>
                  </div>
                </div>
              </div>
              {m.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">{m.description}</p>}
              <div className="flex gap-2 items-center">
                <a href={`/ministries/${m.slug}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-montserrat font-semibold text-orange hover:underline flex-1">
                  <ExternalLink size={11} />View Page
                </a>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors" title="Edit"><Edit2 size={13} /></button>
                  <button onClick={() => handleDelete(m.id, m.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-montserrat font-black text-navy text-base">{modal === 'add' ? 'Add Ministry' : 'Edit Ministry'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name}
                    onChange={e => handleNameChange(e.target.value)} placeholder="Ministry name" />
                </div>
                <div>
                  <label className="form-label">Slug *</label>
                  <input className="form-input" value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-slug" />
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <label className="form-label">Icon (Font Awesome class)</label>
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${form.icon || 'fa-star'} text-orange`} />
                  </div>
                  <input className="form-input flex-1" value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="fa-music" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ICON_SUGGESTIONS.map(ic => (
                    <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${form.icon === ic ? 'bg-navy' : 'bg-gray-100 hover:bg-gray-200'}`}
                      title={ic}>
                      <i className={`fas ${ic} text-xs ${form.icon === ic ? 'text-orange' : 'text-gray-500'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-input" value={form.display_order}
                    onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-orange" />
                    <span className="text-sm font-montserrat font-semibold text-navy">Active</span>
                  </label>
                </div>
              </div>

              <ImagePicker label="Ministry Image" value={form.image_url}
                onChange={url => setForm(f => ({ ...f, image_url: url }))} />

              <div>
                <label className="form-label">Short Description <span className="text-gray-400 font-normal">(shown on ministry cards)</span></label>
                <textarea className="form-textarea" rows={2} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description for ministry cards..." />
              </div>
              <div>
                <label className="form-label">Long Description <span className="text-gray-400 font-normal">(shown on ministry page)</span></label>
                <textarea className="form-textarea" rows={4} value={form.long_description}
                  onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))}
                  placeholder="Detailed description..." />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Ministry'}
              </button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal config={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}