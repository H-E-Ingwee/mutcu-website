import { useEffect, useState, useRef } from 'react'
import { galleryAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Check, Upload } from 'lucide-react'

const CATEGORIES = ['worship', 'outreach', 'fellowship', 'events', 'ministry', 'general']
const EMPTY = { title: '', description: '', image_url: '', category: 'general', display_order: 0, is_active: true }

export default function AdminGallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploadMode, setUploadMode] = useState('url') // url | upload
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file')
    if (file.size > 10 * 1024 * 1024) return toast.error('Image must be under 10MB')

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('category', form.category || 'general')
      formData.append('title', form.title || file.name.replace(/\.[^.]+$/, ''))

      const token = localStorage.getItem('mutcu_website_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/gallery/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }

      const data = await res.json()
      toast.success('Photo uploaded successfully!')
      setModal(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

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
        <button onClick={() => { setForm(EMPTY); setUploadMode('url'); setModal(true) }} className="btn-primary btn-sm"><Plus size={14} /> Add Photo</button>
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