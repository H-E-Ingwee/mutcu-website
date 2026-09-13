import { useState, useRef } from 'react'
import { galleryAPI } from '../../lib/api'
import toast from 'react-hot-toast'

/**
 * ImagePicker — reusable component for all admin image fields
 * Supports: URL input, upload from device, browse from gallery
 */
export default function ImagePicker({ value, onChange, label = 'Image', folder = 'mutcu-website' }) {
  const [mode, setMode] = useState('url') // url | upload | browse
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryLoaded, setGalleryLoaded] = useState(false)
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
      formData.append('category', 'general')
      formData.append('title', file.name.replace(/\.[^.]+$/, ''))

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
      const url = data.item?.image_url || data.url
      if (url) {
        onChange(url)
        setMode('url')
        toast.success('Image uploaded successfully!')
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const loadGallery = async () => {
    if (galleryLoaded) return
    setGalleryLoading(true)
    try {
      const data = await galleryAPI.getAll({ limit: 100 })
      setGallery(data.gallery || [])
      setGalleryLoaded(true)
    } catch {
      toast.error('Failed to load gallery')
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleBrowseClick = () => {
    setMode('browse')
    loadGallery()
  }

  return (
    <div>
      <label className="form-label">{label}</label>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-2">
        {[
          { id: 'url', icon: 'fa-link', label: 'URL' },
          { id: 'upload', icon: 'fa-upload', label: 'Upload' },
          { id: 'browse', icon: 'fa-images', label: 'Gallery' },
        ].map(tab => (
          <button key={tab.id} type="button"
            onClick={() => { setMode(tab.id); if (tab.id === 'browse') loadGallery() }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all ${mode === tab.id ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <i className={`fas ${tab.icon} text-xs`} />{tab.label}
          </button>
        ))}
      </div>

      {/* URL input */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input type="url" className="form-input flex-1" placeholder="https://..." value={value || ''}
            onChange={e => onChange(e.target.value)} />
          {value && (
            <img src={value} alt="Preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
              onError={e => { e.target.style.display = 'none' }} />
          )}
        </div>
      )}

      {/* Upload from device */}
      {mode === 'upload' && (
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${uploading ? 'border-orange bg-orange/5' : 'border-gray-200 hover:border-orange hover:bg-orange/5'}`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
                <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <i className="fas fa-cloud-upload-alt text-gray-300 text-3xl" />
                <p className="text-sm font-montserrat font-semibold text-gray-500">Click to upload image</p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP — max 10MB</p>
              </div>
            )}
          </div>
          {value && (
            <div className="mt-2 flex items-center gap-2">
              <img src={value} alt="Current" className="w-12 h-12 rounded-lg object-cover border border-gray-200" onError={e => { e.target.style.display = 'none' }} />
              <div className="text-xs text-gray-400">
                <div className="font-semibold text-navy">Current image</div>
                <div className="truncate max-w-48">{value}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Browse from gallery */}
      {mode === 'browse' && (
        <div>
          {galleryLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange" />
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 text-xs text-gray-400 font-semibold border-b border-gray-200">
                {gallery.length} photos in gallery — click to select
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-2 max-h-48 overflow-y-auto">
                {gallery.map(item => (
                  <div key={item.id}
                    onClick={() => { onChange(item.image_url); setMode('url'); toast.success('Image selected!') }}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:border-orange ${value === item.image_url ? 'border-orange' : 'border-transparent'}`}>
                    <img src={item.image_url} alt={item.title || ''} className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                    {value === item.image_url && (
                      <div className="absolute inset-0 bg-orange/30 flex items-center justify-center">
                        <i className="fas fa-check-circle text-white text-lg" />
                      </div>
                    )}
                  </div>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-6 text-center py-6 text-gray-400 text-sm">
                    No images in gallery yet. Upload some first.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}