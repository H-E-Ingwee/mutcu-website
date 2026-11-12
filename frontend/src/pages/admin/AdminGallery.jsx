import { useEffect, useState, useRef } from 'react'
import { galleryAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Trash2, X, Check, Upload, Edit2, Images } from 'lucide-react'

const CATEGORIES = [
  'worship', 'outreach', 'fellowship', 'events', 'ministry', 'business-expo', 'general'
]

const CATEGORY_LABELS = {
  worship: 'Worship', outreach: 'Outreach', fellowship: 'Fellowship',
  events: 'Events', ministry: 'Ministry', 'business-expo': 'Business Expo', general: 'General',
}

const CATEGORY_COLORS = {
  worship: 'bg-blue-100 text-blue-700', outreach: 'bg-green-100 text-green-700',
  fellowship: 'bg-purple-100 text-purple-700', events: 'bg-orange/10 text-orange',
  ministry: 'bg-teal/10 text-teal', 'business-expo': 'bg-yellow-100 text-yellow-700',
  general: 'bg-gray-100 text-gray-600',
}

const EMPTY = { title: '', description: '', image_url: '', category: 'general', display_order: 0, is_active: true }

export default function AdminGallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | item object (edit)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploadMode, setUploadMode] = useState('url')
  const [uploading, setUploading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const fileRef = useRef(null)

  const load = () => {
    setLoading(true)
    galleryAPI.getAll({ limit: 300 })
      .then(d => setGallery(d.gallery || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = activeCategory === 'all'
    ? gallery
    : gallery.filter(g => g.category === activeCategory)

  // Category counts
  const counts = { all: gallery.length }
  CATEGORIES.forEach(c => { counts[c] = gallery.filter(g => g.category === c).length })

  const openAdd = () => { setForm(EMPTY); setUploadMode('url'); setModal('add') }
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setUploadMode('url'); setModal(item) }

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
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Upload failed') }
      toast.success('Photo uploaded!')
      setModal(null); setForm(EMPTY); load()
    } catch (err) { toast.error(err.message || 'Upload failed') }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  const handleSave = async () => {
    if (modal === 'add' && uploadMode === 'url' && !form.image_url.trim()) return toast.error('Image URL is required')
    setSaving(true)
    try {
      if (modal === 'add') {
        await galleryAPI.create(form)
        toast.success('Photo added!')
      } else {
        await galleryAPI.update(modal.id, form)
        toast.success('Photo updated!')
      }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo? This cannot be undone.')) return
    try { await galleryAPI.delete(id); toast.success('Photo deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const isEditing = modal && modal !== 'add'

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Gallery Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{gallery.length} photos across {CATEGORIES.filter(c => counts[c] > 0).length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm self-start sm:self-auto">
          <Plus size={14} /> Add Photo
        </button>
      </div>

      {/* Category filter tabs — scrollable on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all ${activeCategory === 'all' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          All <span className="opacity-60">({counts.all})</span>
        </button>
        {CATEGORIES.filter(c => counts[c] > 0).map(c => (
          <button key={c}
            onClick={() => setActiveCategory(c)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all capitalize ${activeCategory === c ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {CATEGORY_LABELS[c] || c} <span className="opacity-60">({counts[c]})</span>
          </button>
        ))}
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <i className="fas fa-images text-gray-200 text-5xl mb-4 block" />
          <p className="text-gray-400 font-montserrat font-semibold text-sm">
            {activeCategory === 'all' ? 'No photos yet. Add your first photo.' : `No photos in "${CATEGORY_LABELS[activeCategory] || activeCategory}" yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <img
                src={item.image_url} alt={item.title || 'Gallery'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={e => { e.target.style.background = '#e5e7eb'; e.target.style.display = 'none' }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-2 opacity-0 group-hover:opacity-100">
                {item.title && (
                  <span className="text-white text-xs font-montserrat font-semibold text-center line-clamp-2 px-1">{item.title}</span>
                )}
                <span className={`text-xs font-montserrat font-bold px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setLightbox(item)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                    title="View full size">
                    <i className="fas fa-expand text-xs" />
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors"
                    title="Edit">
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                    title="Delete">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-montserrat font-black text-navy text-base">
                {isEditing ? 'Edit Photo' : 'Add Photo'}
              </h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Upload mode toggle — only for new photos */}
              {!isEditing && (
                <div className="grid grid-cols-2 gap-2">
                  {[['url', 'fa-link', 'Paste URL'], ['upload', 'fa-upload', 'Upload File']].map(([mode, icon, label]) => (
                    <button key={mode} type="button" onClick={() => setUploadMode(mode)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-montserrat font-bold border-2 transition-all ${uploadMode === mode ? 'border-orange bg-orange/5 text-navy' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <i className={`fas ${icon} text-xs ${uploadMode === mode ? 'text-orange' : ''}`} />
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Title + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Photo title" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description <span className="text-gray-300 font-normal">(optional)</span></label>
                <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
              </div>

              {/* URL input or file upload */}
              {(!isEditing && uploadMode === 'upload') ? (
                <div>
                  <label className="form-label">Select Image File</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange/40 transition-colors">
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="gallery-file-input" />
                    <label htmlFor="gallery-file-input" className="cursor-pointer">
                      <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-montserrat font-semibold text-gray-500">Click to select image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 10MB</p>
                    </label>
                    {uploading && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-orange text-sm font-montserrat font-semibold">
                        <div className="w-4 h-4 rounded-full border-2 border-orange/30 border-t-orange animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://... or /assets/images/..." />
                  {/* Live preview */}
                  {form.image_url && (
                    <div className="mt-2 rounded-xl overflow-hidden bg-gray-100" style={{ height: '120px' }}>
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }} />
                    </div>
                  )}
                </div>
              )}

              {/* Display order */}
              <div>
                <label className="form-label">Display Order <span className="text-gray-300 font-normal">(lower = first)</span></label>
                <input type="number" className="form-input" value={form.display_order}
                  onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>

            {/* Footer actions */}
            {(isEditing || uploadMode === 'url') && (
              <div className="flex gap-3 p-5 border-t border-gray-100">
                <button onClick={handleSave} disabled={saving}
                  className="btn-primary flex-1 justify-center">
                  <Check size={15} />{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Photo'}
                </button>
                <button onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all" onClick={() => setLightbox(null)}>
            <X size={18} />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.title || 'Gallery'} className="w-full max-h-[80vh] object-contain rounded-xl" />
            {lightbox.title && (
              <div className="text-center mt-3">
                <p className="text-white font-montserrat font-semibold text-sm">{lightbox.title}</p>
                <p className="text-white/50 text-xs capitalize mt-0.5">{CATEGORY_LABELS[lightbox.category] || lightbox.category}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}