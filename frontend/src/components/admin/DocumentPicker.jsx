import { useState, useRef } from 'react'
import { resourcesAPI } from '../../lib/api'
import toast from 'react-hot-toast'

const DOC_TYPES = {
  'application/pdf': { ext: 'PDF', icon: 'fa-file-pdf', color: 'text-red-500' },
  'application/msword': { ext: 'DOC', icon: 'fa-file-word', color: 'text-blue-500' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'DOCX', icon: 'fa-file-word', color: 'text-blue-500' },
  'application/vnd.ms-excel': { ext: 'XLS', icon: 'fa-file-excel', color: 'text-green-500' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'XLSX', icon: 'fa-file-excel', color: 'text-green-500' },
}

export default function DocumentPicker({ value, onChange, label = 'Document', onTypeChange }) {
  const [mode, setMode] = useState('url') // url | upload | browse
  const [uploading, setUploading] = useState(false)
  const [resources, setResources] = useState([])
  const [resourcesLoading, setResourcesLoading] = useState(false)
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const fileRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = Object.keys(DOC_TYPES)
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|xls|xlsx)$/i)) {
      return toast.error('Please select a PDF, Word, or Excel file')
    }
    if (file.size > 25 * 1024 * 1024) return toast.error('File must be under 25MB')

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', file.name.replace(/\.[^.]+$/, ''))
      formData.append('type', DOC_TYPES[file.type]?.ext || 'DOCUMENT')

      const token = localStorage.getItem('mutcu_website_token')
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/resources/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }

      const data = await res.json()
      const url = data.resource?.url || data.url
      if (url) {
        onChange(url)
        if (onTypeChange) onTypeChange(DOC_TYPES[file.type]?.ext || 'DOCUMENT')
        setMode('url')
        toast.success('Document uploaded successfully!')
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const loadResources = async () => {
    if (resourcesLoaded) return
    setResourcesLoading(true)
    try {
      const data = await resourcesAPI.getAll()
      setResources((data.resources || []).filter(r => r.url && ['PDF', 'DOCUMENT', 'AUDIO', 'VIDEO'].includes(r.type)))
      setResourcesLoaded(true)
    } catch {
      toast.error('Failed to load resources')
    } finally {
      setResourcesLoading(false)
    }
  }

  const TYPE_ICONS = { PDF: 'fa-file-pdf', DOCUMENT: 'fa-file-word', AUDIO: 'fa-headphones', VIDEO: 'fa-play-circle', LINK: 'fa-external-link-alt' }
  const TYPE_COLORS = { PDF: 'text-red-500', DOCUMENT: 'text-blue-500', AUDIO: 'text-purple-500', VIDEO: 'text-blue-400', LINK: 'text-teal' }

  return (
    <div>
      <label className="form-label">{label}</label>

      {/* Mode tabs */}
      <div className="flex gap-1 mb-2">
        {[
          { id: 'url', icon: 'fa-link', label: 'URL' },
          { id: 'upload', icon: 'fa-upload', label: 'Upload File' },
          { id: 'browse', icon: 'fa-folder-open', label: 'Existing' },
        ].map(tab => (
          <button key={tab.id} type="button"
            onClick={() => { setMode(tab.id); if (tab.id === 'browse') loadResources() }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all ${mode === tab.id ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <i className={`fas ${tab.icon} text-xs`} />{tab.label}
          </button>
        ))}
      </div>

      {/* URL input */}
      {mode === 'url' && (
        <input type="url" className="form-input" placeholder="https://..." value={value || ''}
          onChange={e => onChange(e.target.value)} />
      )}

      {/* Upload from device */}
      {mode === 'upload' && (
        <div>
          <input ref={fileRef} type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden" onChange={handleFileUpload} />
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${uploading ? 'border-orange bg-orange/5' : 'border-gray-200 hover:border-orange hover:bg-orange/5'}`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
                <p className="text-sm text-gray-500">Uploading document...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-3 text-2xl text-gray-300">
                  <i className="fas fa-file-pdf text-red-300" />
                  <i className="fas fa-file-word text-blue-300" />
                  <i className="fas fa-file-excel text-green-300" />
                </div>
                <p className="text-sm font-montserrat font-semibold text-gray-500">Click to upload document</p>
                <p className="text-xs text-gray-400">PDF, Word (.doc/.docx), Excel (.xls/.xlsx) — max 25MB</p>
              </div>
            )}
          </div>
          {value && (
            <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <i className="fas fa-file text-gray-400" />
              <span className="text-xs text-gray-500 truncate flex-1">{value}</span>
              <a href={value} target="_blank" rel="noopener noreferrer" className="text-orange text-xs hover:underline">Open</a>
            </div>
          )}
        </div>
      )}

      {/* Browse existing resources */}
      {mode === 'browse' && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 text-xs text-gray-400 font-semibold border-b border-gray-200">
            Select from existing resources
          </div>
          {resourcesLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange" />
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
              {resources.map(r => (
                <div key={r.id}
                  onClick={() => { onChange(r.url); if (onTypeChange) onTypeChange(r.type); setMode('url'); toast.success('Document selected!') }}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange/5 transition-all ${value === r.url ? 'bg-orange/10' : ''}`}>
                  <i className={`fas ${TYPE_ICONS[r.type] || 'fa-file'} ${TYPE_COLORS[r.type] || 'text-gray-400'} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-navy truncate">{r.title}</div>
                    <div className="text-xs text-gray-400">{r.type} · {r.category}</div>
                  </div>
                  {value === r.url && <i className="fas fa-check-circle text-orange flex-shrink-0" />}
                </div>
              ))}
              {resources.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">No documents uploaded yet.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}