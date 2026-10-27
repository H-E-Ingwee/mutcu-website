import { useEffect, useState, useCallback } from 'react'
import { expoAPI, galleryAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Save, RefreshCw, Image, ExternalLink } from 'lucide-react'

const SLOT_GROUPS = [
  {
    id: 'hero', label: 'Hero Section', icon: 'fa-image',
    slots: [{ key: 'expo_hero_bg', label: 'Hero Background Photo' }],
  },
  {
    id: 'poster', label: 'Official Poster', icon: 'fa-star',
    slots: [{ key: 'expo_poster', label: 'Expo Poster Image' }],
  },
  {
    id: 'speakers', label: 'Speaker Showcase Photos', icon: 'fa-microphone',
    slots: [
      { key: 'expo_speaker_1', label: 'Speaker Photo 1 — Keynote Session' },
      { key: 'expo_speaker_2', label: 'Speaker Photo 2 — Panel Discussion' },
      { key: 'expo_speaker_3', label: 'Speaker Photo 3 — Speaker Address' },
      { key: 'expo_speaker_4', label: 'Speaker Photo 4 — Business Panel' },
      { key: 'expo_speaker_5', label: 'Speaker Photo 5 — Founder Insights' },
      { key: 'expo_speaker_6', label: 'Speaker Photo 6 — Entrepreneur Talk' },
    ],
  },
  {
    id: 'about', label: 'About Section Collage', icon: 'fa-th',
    slots: [
      { key: 'expo_about_1', label: 'About Photo 1 (top-left)' },
      { key: 'expo_about_2', label: 'About Photo 2 (top-right, offset down)' },
      { key: 'expo_about_3', label: 'About Photo 3 (bottom-left, offset up)' },
      { key: 'expo_about_4', label: 'About Photo 4 (bottom-right)' },
    ],
  },
]

function PhotoSlot({ slotKey, label, value, onChange, galleryPhotos }) {
  const [showPicker, setShowPicker] = useState(false)
  const [urlInput, setUrlInput] = useState(value || '')
  const [pickerSearch, setPickerSearch] = useState('')

  const filtered = galleryPhotos.filter(p =>
    !pickerSearch || (p.title || '').toLowerCase().includes(pickerSearch.toLowerCase()) || (p.category || '').toLowerCase().includes(pickerSearch.toLowerCase())
  )

  const handleUrlSave = () => { onChange(slotKey, urlInput.trim()); setShowPicker(false) }
  const handleGalleryPick = (url) => { onChange(slotKey, url); setUrlInput(url); setShowPicker(false) }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Preview */}
      <div className="relative bg-gray-100" style={{ aspectRatio: '16/9' }}>
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-300">
              <Image size={32} className="mx-auto mb-2" />
              <p className="text-xs font-montserrat">No photo set</p>
            </div>
          </div>
        )}
        <button onClick={() => setShowPicker(true)}
          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center group">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-navy text-xs font-montserrat font-bold px-3 py-1.5 rounded-lg">
            Change Photo
          </span>
        </button>
      </div>

      {/* Label + current URL */}
      <div className="p-3">
        <p className="font-montserrat font-bold text-navy text-xs mb-1">{label}</p>
        <p className="text-gray-400 text-xs truncate font-lato">{value || 'Not set'}</p>
        <button onClick={() => setShowPicker(true)}
          className="mt-2 flex items-center gap-1 text-xs font-montserrat font-semibold text-orange hover:underline">
          <Image size={11} /> Change Photo
        </button>
      </div>

      {/* Picker modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-montserrat font-black text-navy text-base">Choose Photo</h3>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">✕</button>
            </div>

            {/* URL input */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-2">Paste a URL directly</p>
              <div className="flex gap-2">
                <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://... or /assets/images/expo/..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
                <button onClick={handleUrlSave}
                  className="px-4 py-2 rounded-xl font-montserrat font-bold text-white text-xs transition-all"
                  style={{ background: '#FF9700' }}>
                  Use URL
                </button>
              </div>
            </div>

            {/* Gallery picker */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Or pick from Gallery</p>
                <input type="text" value={pickerSearch} onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Search..." className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-lato focus:outline-none focus:border-orange transition-colors w-32" />
              </div>
              {galleryPhotos.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  <Image size={32} className="mx-auto mb-2" />
                  <p className="text-xs font-montserrat">No gallery photos found. Upload photos in Gallery first.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {filtered.map((photo, i) => (
                    <button key={i} onClick={() => handleGalleryPick(photo.image_url)}
                      className="relative overflow-hidden rounded-xl group focus:outline-none focus:ring-2 focus:ring-orange"
                      style={{ aspectRatio: '1/1' }}>
                      <img src={photo.image_url} alt={photo.title || 'Gallery photo'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={e => { e.target.parentElement.style.display = 'none' }} />
                      <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all duration-200 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-montserrat font-bold">Select</span>
                      </div>
                      {photo.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-navy/60">
                          <p className="text-white text-xs font-montserrat truncate">{photo.title}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminExpoSettings() {
  const [settings, setSettings] = useState({})
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeGroup, setActiveGroup] = useState('hero')
  const [hasChanges, setHasChanges] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [settingsData, galleryData] = await Promise.all([
        expoAPI.getSettings(),
        galleryAPI.getAll({ limit: 200 }),
      ])
      setSettings(settingsData.settings || {})
      // Also include expo photos from the expo folder
      const expoLocalPhotos = [
        'IMG_0578','IMG_0579','IMG_0616','IMG_0628','IMG_0630','IMG_0703','IMG_0715',
        'IMG_0751','IMG_0760','IMG_0761','IMG_0764','IMG_0777','IMG_0783 (1)','IMG_0802',
        'IMG_0818','IMG_0834','IMG_0909','IMG_0910','IMG_0912','IMG_0916','IMG_0917',
        'IMG_0918','IMG_0922','IMG_0924','IMG_0925',
      ].map(name => ({
        image_url: `/assets/images/expo/${name}.jpg`,
        title: `Expo Photo — ${name}`,
        category: 'business-expo',
      }))
      const posterPhoto = { image_url: '/assets/images/expo/busexpoposter.jpeg', title: 'Expo 2027 Official Poster', category: 'business-expo' }
      const allPhotos = [posterPhoto, ...expoLocalPhotos, ...(galleryData.gallery || [])]
      setGalleryPhotos(allPhotos)
    } catch (err) {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Map our local keys to the expo_settings keys
      const payload = {}
      Object.entries(settings).forEach(([k, v]) => {
        // Convert local key format to DB key format
        const dbKey = k.startsWith('expo_') ? k : `expo_${k}`
        payload[dbKey] = v
      })
      await expoAPI.updateSettings(payload)
      toast.success('Expo page photos updated! Changes are live immediately.')
      setHasChanges(false)
    } catch (err) {
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const currentGroup = SLOT_GROUPS.find(g => g.id === activeGroup)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-2xl mb-0.5">Expo Page Settings</h1>
          <p className="text-gray-400 text-sm">Edit photos shown on the Business Exposition page — changes apply instantly.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-semibold text-gray-500 bg-white border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={handleSave} disabled={saving || !hasChanges}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all disabled:opacity-50"
            style={{ background: hasChanges ? '#FF9700' : '#9CA3AF' }}>
            <Save size={13} />
            {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
          </button>
          <a href="/business-expo" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-semibold text-navy bg-white border border-gray-200 hover:border-orange transition-all">
            <ExternalLink size={13} /> Preview Page
          </a>
        </div>
      </div>

      {hasChanges && (
        <div className="mb-4 p-3 rounded-xl bg-orange/10 border border-orange/20 flex items-center gap-2">
          <i className="fas fa-exclamation-circle text-orange text-sm" />
          <p className="text-orange text-xs font-montserrat font-semibold">You have unsaved changes. Click "Save Changes" to apply them to the live page.</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="font-montserrat font-bold text-navy text-sm">Page Sections</p>
              </div>
              <nav className="p-2">
                {SLOT_GROUPS.map(group => (
                  <button key={group.id} onClick={() => setActiveGroup(group.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-montserrat font-semibold transition-all mb-0.5 ${activeGroup === group.id ? 'bg-orange text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <i className={`fas ${group.icon} text-xs ${activeGroup === group.id ? 'text-white' : 'text-orange'}`} />
                    {group.label}
                    <span className={`ml-auto text-xs rounded-full px-1.5 py-0.5 font-bold ${activeGroup === group.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {group.slots.length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Info card */}
            <div className="mt-4 p-4 rounded-2xl bg-navy text-white">
              <p className="font-montserrat font-bold text-sm mb-2">How it works</p>
              <ul className="space-y-1.5 text-xs text-white/60 font-lato">
                <li className="flex items-start gap-1.5"><i className="fas fa-check text-orange text-xs mt-0.5" />Click any photo to change it</li>
                <li className="flex items-start gap-1.5"><i className="fas fa-check text-orange text-xs mt-0.5" />Pick from gallery or paste a URL</li>
                <li className="flex items-start gap-1.5"><i className="fas fa-check text-orange text-xs mt-0.5" />Click Save Changes</li>
                <li className="flex items-start gap-1.5"><i className="fas fa-check text-orange text-xs mt-0.5" />Changes go live instantly</li>
              </ul>
            </div>
          </div>

          {/* Photo grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,151,0,0.1)' }}>
                  <i className={`fas ${currentGroup?.icon} text-orange text-sm`} />
                </div>
                <div>
                  <h2 className="font-montserrat font-black text-navy text-base">{currentGroup?.label}</h2>
                  <p className="text-gray-400 text-xs">{currentGroup?.slots.length} photo slot{currentGroup?.slots.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className={`grid gap-4 ${currentGroup?.slots.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {currentGroup?.slots.map(slot => (
                  <PhotoSlot
                    key={slot.key}
                    slotKey={slot.key}
                    label={slot.label}
                    value={settings[slot.key] || ''}
                    onChange={handleChange}
                    galleryPhotos={galleryPhotos}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}