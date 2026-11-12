import { useEffect, useState, useMemo } from 'react'
import { resourcesAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check, Search, ExternalLink, BookOpen } from 'lucide-react'
import ImagePicker from '../../components/admin/ImagePicker'
import DocumentPicker from '../../components/admin/DocumentPicker'
import ConfirmModal from '../../components/admin/ConfirmModal'

const TYPES = ['PDF', 'AUDIO', 'VIDEO', 'LINK', 'DOCUMENT']
const CATEGORIES = ['sermons', 'devotionals', 'constitution', 'forms', 'other']
const EMPTY = { title: '', description: '', url: '', type: 'PDF', category: 'other', image_url: '', is_active: true, display_order: 0 }

const TYPE_CONFIG = {
  PDF:      { icon: 'fa-file-pdf',         color: 'text-red-500',    bg: 'bg-red-50',    badge: 'bg-red-100 text-red-700' },
  AUDIO:    { icon: 'fa-headphones',        color: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
  VIDEO:    { icon: 'fa-play-circle',       color: 'text-blue-500',   bg: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700' },
  LINK:     { icon: 'fa-external-link-alt', color: 'text-teal',       bg: 'bg-teal/10',   badge: 'bg-teal/10 text-teal' },
  DOCUMENT: { icon: 'fa-file-word',         color: 'text-navy',       bg: 'bg-navy/10',   badge: 'bg-navy/10 text-navy' },
}

export default function AdminResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [confirm, setConfirm] = useState(null)

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
      if (modal === 'add') { await resourcesAPI.create(form); toast.success('Resource added!') }
      else { await resourcesAPI.update(modal.id, form); toast.success('Resource updated!') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = (id, title) => {
    setConfirm({
      title: 'Delete Resource?',
      message: `"${title}" will be permanently deleted.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try { await resourcesAPI.delete(id); toast.success('Resource deleted'); load() }
        catch (err) { toast.error(err.message || 'Failed') }
      }
    })
  }

  // Category counts
  const counts = { all: resources.length }
  CATEGORIES.forEach(c => { counts[c] = resources.filter(r => r.category === c).length })

  const filtered = useMemo(() => {
    let list = resources
    if (categoryFilter !== 'all') list = list.filter(r => r.category === categoryFilter)
    if (typeFilter !== 'all') list = list.filter(r => r.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r => r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
    }
    return list
  }, [resources, categoryFilter, typeFilter, search])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Resources Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">{resources.length} resources across {CATEGORIES.filter(c => counts[c] > 0).length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm self-start sm:self-auto"><Plus size={14} /> Add Resource</button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors capitalize">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c} ({counts[c] || 0})</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors">
            <option value="all">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Resources grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-montserrat font-semibold text-sm">
            {search || categoryFilter !== 'all' || typeFilter !== 'all' ? 'No resources match your filters' : 'No resources yet'}
          </p>
          {!search && categoryFilter === 'all' && <p className="text-xs mt-1">Click "Add Resource" to add your first resource</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => {
            const tc = TYPE_CONFIG[r.type] || TYPE_CONFIG.LINK
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange/20 hover:shadow-sm transition-all group">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${tc.icon} ${tc.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-bold text-navy text-sm line-clamp-1">{r.title}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-montserrat font-bold ${tc.badge}`}>{r.type}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-montserrat font-bold bg-gray-100 text-gray-600 capitalize">{r.category}</span>
                      {!r.is_active && <span className="px-1.5 py-0.5 rounded-full text-xs font-montserrat font-bold bg-red-100 text-red-600">Hidden</span>}
                    </div>
                  </div>
                </div>
                {r.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">{r.description}</p>}
                <div className="flex gap-2 items-center">
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-montserrat font-semibold text-orange hover:underline flex-1 truncate">
                      <ExternalLink size={11} />
                      <span className="truncate">{r.type === 'VIDEO' ? 'Watch' : r.type === 'AUDIO' ? 'Listen' : 'Open'}</span>
                    </a>
                  )}
                  <div className="flex gap-1 ml-auto">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors" title="Edit"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(r.id, r.title)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-3 text-xs text-gray-400 font-montserrat text-center">
          Showing {filtered.length} of {resources.length} resources
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-montserrat font-black text-navy text-base">{modal === 'add' ? 'Add Resource' : 'Edit Resource'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
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
              <DocumentPicker label="Document / File URL" value={form.url}
                onChange={url => setForm(f => ({ ...f, url }))}
                onTypeChange={type => setForm(f => ({ ...f, type }))} />
              <ImagePicker label="Thumbnail Image (optional)" value={form.image_url}
                onChange={url => setForm(f => ({ ...f, image_url: url }))} />
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
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
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Resource'}
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