import { useEffect, useState } from 'react'
import { galleryAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Check } from 'lucide-react'

const CATEGORIES = ['worship', 'outreach', 'fellowship', 'events', 'ministry', 'general']
const EMPTY = { title: '', description: '', image_url: '', category: 'general', display_order: 0, is_active: true }

export default function AdminGallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    galleryAPI.getAll({ limit: 200 }).then(d => setGallery(d.gallery || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.image_url.trim()) return toast.error('Image URL is required')
    setSaving(true)
    try {
      await galleryAPI.create(form)
      toast.success('Photo added')
      setModal(false); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return
    try { await galleryAPI.delete(id); toast.success('Photo deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Gallery Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{gallery.length} photos</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal(true) }} className="btn-primary btn-sm"><Plus size={14} /> Add Photo</button>
      </div>

      {loading ? <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {gallery.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <img src={item.image_url} alt={item.title || 'Gallery'} className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://via.placeholder.com/200x200?text=Error' }} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                {item.title && <span className="text-white text-xs font-semibold text-center line-clamp-2">{item.title}</span>}
                <span className="text-white/60 text-xs capitalize">{item.category}</span>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-span-5 text-center py-12 text-gray-400">
              <i className="fas fa-images text-4xl mb-3 block" />
              <p>No photos yet. Add your first photo.</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-montserrat font-bold text-navy text-lg">Add Photo</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Image URL *</label>
                <input className="form-input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
                {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl" onError={e => { e.target.style.display = 'none' }} />}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Photo title" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Adding...' : 'Add Photo'}
              </button>
              <button onClick={() => setModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}