import { useEffect, useState } from 'react'
import { ministriesAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import ImagePicker from '../../components/admin/ImagePicker'

const EMPTY = { name: '', slug: '', description: '', long_description: '', icon: 'fa-star', image_url: '', is_active: true, display_order: 0 }

export default function AdminMinistries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    ministriesAPI.getAll().then(d => setMinistries(d.ministries || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (m) => { setForm({ ...EMPTY, ...m }); setModal(m) }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return toast.error('Name and slug are required')
    setSaving(true)
    try {
      if (modal === 'add') { await ministriesAPI.create(form); toast.success('Ministry added') }
      else { await ministriesAPI.update(modal.id, form); toast.success('Ministry updated') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ministry?')) return
    try { await ministriesAPI.delete(id); toast.success('Deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Ministries Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{ministries.length} ministries</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14} /> Add Ministry</button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-sm text-blue-700 flex items-start gap-2">
        <i className="fas fa-info-circle mt-0.5 flex-shrink-0" />
        <span>Ministry data here overrides the static content on the Ministries page. Update descriptions and images to keep content fresh.</span>
      </div>

      {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ministries.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${m.icon || 'fa-star'} text-orange`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-montserrat font-bold text-navy text-sm">{m.name}</div>
                  <div className="text-gray-400 text-xs">{m.slug}</div>
                </div>
              </div>
              {m.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2">{m.description}</p>}
              <div className="flex gap-2 justify-end">
                <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-montserrat font-bold text-navy text-lg">{modal === 'add' ? 'Add Ministry' : 'Edit Ministry'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ministry name" />
                </div>
                <div>
                  <label className="form-label">Slug *</label>
                  <input className="form-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-slug" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Icon (Font Awesome)</label>
                  <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="fa-music" />
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input type="number" className="form-input" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <ImagePicker
                label="Ministry Image"
                value={form.image_url}
                onChange={url => setForm(f => ({ ...f, image_url: url }))}
              />
              <div>
                <label className="form-label">Short Description</label>
                <textarea className="form-textarea" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description for ministry cards..." />
              </div>
              <div>
                <label className="form-label">Long Description (shown on ministry page)</label>
                <textarea className="form-textarea" rows={4} value={form.long_description} onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))} placeholder="Detailed description..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Ministry'}
              </button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}