import { useEffect, useState } from 'react'
import { resourcesAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'

const TYPES = ['PDF', 'AUDIO', 'VIDEO', 'LINK', 'DOCUMENT']
const CATEGORIES = ['sermons', 'devotionals', 'constitution', 'forms', 'other']
const EMPTY = { title: '', description: '', url: '', type: 'PDF', category: 'other', image_url: '', is_active: true, display_order: 0 }

export default function AdminResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    resourcesAPI.getAll().then(d => setResources(d.resources || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (r) => { setForm({ ...EMPTY, ...r }); setModal(r) }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      if (modal === 'add') { await resourcesAPI.create(form); toast.success('Resource added') }
      else { await resourcesAPI.update(modal.id, form); toast.success('Resource updated') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    try { await resourcesAPI.delete(id); toast.success('Deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const TYPE_ICONS = { PDF: 'fa-file-pdf text-red-500', AUDIO: 'fa-headphones text-purple-500', VIDEO: 'fa-play-circle text-blue-500', LINK: 'fa-external-link-alt text-teal', DOCUMENT: 'fa-file-word text-navy' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Resources Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{resources.length} resources</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14} /> Add Resource</button>
      </div>

      {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${TYPE_ICONS[r.type]?.split(' ')[0] || 'fa-file'} ${TYPE_ICONS[r.type]?.split(' ')[1] || 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-montserrat font-bold text-navy text-sm line-clamp-1">{r.title}</div>
                  <div className="flex gap-1 mt-1">
                    <span className="badge badge-gray text-xs">{r.type}</span>
                    <span className="badge badge-navy text-xs capitalize">{r.category}</span>
                  </div>
                </div>
              </div>
              {r.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2">{r.description}</p>}
              <div className="flex gap-2">
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm flex-1 justify-center text-xs">Open</a>}
                <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {resources.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <i className="fas fa-folder-open text-4xl mb-3 block" />
              <p>No resources yet.</p>
            </div>
          )}
        </div>
      )}

      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-montserrat font-bold text-navy text-lg">{modal === 'add' ? 'Add Resource' : 'Edit Resource'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Resource title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">URL (file link or external link)</label>
                <input className="form-input" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
              </div>
              <div>
                <label className="form-label">Display Order</label>
                <input type="number" className="form-input" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Resource'}
              </button>
              <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}