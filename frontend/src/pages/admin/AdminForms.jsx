import { useEffect, useState, useCallback } from 'react'
import { formsAPI, getToken } from '../../lib/api'
import toast from 'react-hot-toast'
import {
  Plus, Trash2, Edit2, Eye, Download, FileSpreadsheet,
  FileText, RefreshCw, GripVertical, ChevronDown, ChevronUp,
  CheckCircle, Clock, XCircle, Users, ExternalLink, Copy
} from 'lucide-react'

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: 'fa-font' },
  { value: 'textarea', label: 'Long Text', icon: 'fa-align-left' },
  { value: 'email', label: 'Email', icon: 'fa-envelope' },
  { value: 'tel', label: 'Phone', icon: 'fa-phone' },
  { value: 'number', label: 'Number', icon: 'fa-hashtag' },
  { value: 'select', label: 'Dropdown', icon: 'fa-chevron-circle-down' },
  { value: 'radio', label: 'Single Choice', icon: 'fa-dot-circle' },
  { value: 'checkbox', label: 'Multiple Choice', icon: 'fa-check-square' },
  { value: 'date', label: 'Date', icon: 'fa-calendar' },
]

const STATUS_CONFIG = {
  draft:  { label: 'Draft',  color: 'text-gray-500',  bg: 'bg-gray-50',  border: 'border-gray-200',  icon: Clock },
  open:   { label: 'Open',   color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
  closed: { label: 'Closed', color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   icon: XCircle },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={10} />{cfg.label}
    </span>
  )
}

function FieldEditor({ field, index, total, onChange, onDelete, onMove }) {
  const [expanded, setExpanded] = useState(true)
  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-100">
        <div className="text-gray-300 cursor-grab"><GripVertical size={16} /></div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.1)' }}>
          <i className={`fas ${FIELD_TYPES.find(t => t.value === field.type)?.icon || 'fa-font'} text-orange text-xs`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-montserrat font-bold text-navy text-xs truncate">{field.label || 'Untitled Field'}</p>
          <p className="text-gray-400 text-xs">{FIELD_TYPES.find(t => t.value === field.type)?.label} {field.required ? '· Required' : '· Optional'}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(index, -1)} disabled={index === 0} className="p-1 rounded text-gray-400 hover:text-navy disabled:opacity-30 transition-colors"><ChevronUp size={14} /></button>
          <button onClick={() => onMove(index, 1)} disabled={index === total - 1} className="p-1 rounded text-gray-400 hover:text-navy disabled:opacity-30 transition-colors"><ChevronDown size={14} /></button>
          <button onClick={() => setExpanded(!expanded)} className="p-1 rounded text-gray-400 hover:text-navy transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onDelete(index)} className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Field Label *</label>
              <input type="text" value={field.label} onChange={e => onChange(index, 'label', e.target.value)}
                placeholder="e.g. Full Name" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Field Key *</label>
              <input type="text" value={field.key} onChange={e => onChange(index, 'key', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. full_name" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
              <p className="text-gray-300 text-xs mt-0.5 font-lato">Used as the data key (no spaces)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Field Type</label>
              <select value={field.type} onChange={e => onChange(index, 'type', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-montserrat font-semibold focus:outline-none focus:border-orange transition-colors">
                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Placeholder</label>
              <input type="text" value={field.placeholder || ''} onChange={e => onChange(index, 'placeholder', e.target.value)}
                placeholder="Hint text shown in the field" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={field.required || false} onChange={e => onChange(index, 'required', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange focus:ring-orange" />
              <span className="text-sm font-montserrat font-semibold text-navy">Required field</span>
            </label>
          </div>

          {hasOptions && (
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Options (one per line)</label>
              <textarea
                value={(field.options || []).join('\n')}
                onChange={e => onChange(index, 'options', e.target.value.split('\n').filter(Boolean))}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FormEditor({ form, onSave, onCancel }) {
  const [title, setTitle] = useState(form?.title || '')
  const [description, setDescription] = useState(form?.description || '')
  const [status, setStatus] = useState(form?.status || 'draft')
  const [deadline, setDeadline] = useState(form?.deadline ? form.deadline.split('T')[0] : '')
  const [successMessage, setSuccessMessage] = useState(form?.success_message || 'Thank you for your submission! We will be in touch soon.')
  const [notifyEmail, setNotifyEmail] = useState(form?.notify_email || 'mutcunion@gmail.com')
  const [fields, setFields] = useState(() => {
    let f = form?.fields || []
    if (typeof f === 'string') { try { f = JSON.parse(f) } catch { f = [] } }
    return f
  })
  const [saving, setSaving] = useState(false)

  const addField = () => {
    const newField = { key: `field_${Date.now()}`, label: '', type: 'text', placeholder: '', required: false, options: [] }
    setFields(prev => [...prev, newField])
  }

  const updateField = (index, key, value) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f))
  }

  const deleteField = (index) => {
    setFields(prev => prev.filter((_, i) => i !== index))
  }

  const moveField = (index, direction) => {
    const newFields = [...fields]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= newFields.length) return
    ;[newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]]
    setFields(newFields)
  }

  const handleSave = async () => {
    if (!title.trim()) return toast.error('Form title is required')
    if (fields.length === 0) return toast.error('Add at least one field')
    const invalidFields = fields.filter(f => !f.label.trim() || !f.key.trim())
    if (invalidFields.length > 0) return toast.error('All fields must have a label and key')

    setSaving(true)
    try {
      const payload = { title: title.trim(), description: description.trim(), fields, status, deadline: deadline || null, success_message: successMessage.trim(), notify_email: notifyEmail.trim() }
      await onSave(payload)
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      {/* Form settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-montserrat font-black text-navy text-base mb-4">Form Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Form Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. MUTCU Choir Auditions 2027" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Brief description shown above the form..." rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-montserrat font-semibold focus:outline-none focus:border-orange transition-colors">
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline (optional)</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Notify Email</label>
              <input type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)}
                placeholder="mutcunion@gmail.com" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Success Message</label>
            <input type="text" value={successMessage} onChange={e => setSuccessMessage(e.target.value)}
              placeholder="Thank you for your submission!" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-montserrat font-black text-navy text-base">Form Fields ({fields.length})</h3>
          <button onClick={addField}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all"
            style={{ background: '#FF9700' }}>
            <Plus size={13} /> Add Field
          </button>
        </div>
        {fields.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
            <i className="fas fa-plus-circle text-gray-300 text-3xl mb-3 block" />
            <p className="text-gray-400 font-montserrat font-semibold text-sm">No fields yet</p>
            <p className="text-gray-300 text-xs mt-1">Click "Add Field" to start building your form</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, i) => (
              <FieldEditor key={i} field={field} index={i} total={fields.length}
                onChange={updateField} onDelete={deleteField} onMove={moveField} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl font-montserrat font-bold text-gray-600 text-sm bg-white border border-gray-200 hover:border-gray-300 transition-all">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all disabled:opacity-60"
          style={{ background: '#FF9700' }}>
          {saving ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving...</> : <><i className="fas fa-save" />{form ? 'Update Form' : 'Create Form'}</>}
        </button>
      </div>
    </div>
  )
}

function SubmissionsView({ form, onBack }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [exportingExcel, setExportingExcel] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [selected, setSelected] = useState(null)

  let fields = form.fields || []
  if (typeof fields === 'string') { try { fields = JSON.parse(fields) } catch { fields = [] } }

  useEffect(() => {
    formsAPI.getSubmissions(form.id)
      .then(data => setSubmissions(data.submissions || []))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false))
  }, [form.id])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return
    try {
      await formsAPI.deleteSubmission(form.id, id)
      setSubmissions(prev => prev.filter(s => s.id !== id))
      toast.success('Submission deleted')
      if (selected?.id === id) setSelected(null)
    } catch { toast.error('Failed to delete') }
  }

  const handleExportExcel = async () => {
    setExportingExcel(true)
    try {
      const token = getToken()
      const url = formsAPI.exportExcel(form.id)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
      a.download = `${form.slug}-submissions.xlsx`; a.click(); URL.revokeObjectURL(a.href)
      toast.success('Excel downloaded!')
    } catch { toast.error('Excel export failed') } finally { setExportingExcel(false) }
  }

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      const token = getToken()
      const url = formsAPI.exportPdf(form.id)
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
      a.download = `${form.slug}-submissions.pdf`; a.click(); URL.revokeObjectURL(a.href)
      toast.success('PDF downloaded!')
    } catch { toast.error('PDF export failed') } finally { setExportingPdf(false) }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 text-xs font-montserrat font-semibold text-gray-400 hover:text-navy transition-colors mb-1">
            ← Back to Forms
          </button>
          <h2 className="font-montserrat font-black text-navy text-xl">{form.title} — Submissions</h2>
          <p className="text-gray-400 text-sm">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} disabled={exportingExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white disabled:opacity-60"
            style={{ background: '#16A34A' }}>
            <FileSpreadsheet size={13} />{exportingExcel ? 'Exporting...' : 'Excel'}
          </button>
          <button onClick={handleExportPdf} disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold text-white disabled:opacity-60"
            style={{ background: '#DC2626' }}>
            <FileText size={13} />{exportingPdf ? 'Exporting...' : 'PDF'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-montserrat font-semibold text-sm">No submissions yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">#</th>
                  {fields.slice(0, 4).map(f => (
                    <th key={f.key} className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">{f.label}</th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, i) => {
                  const data = typeof sub.data === 'string' ? JSON.parse(sub.data) : (sub.data || {})
                  return (
                    <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelected(sub)}>
                      <td className="px-4 py-3 text-gray-400 text-xs font-montserrat">{i + 1}</td>
                      {fields.slice(0, 4).map(f => (
                        <td key={f.key} className="px-4 py-3 text-navy text-sm font-montserrat font-semibold">
                          {Array.isArray(data[f.key]) ? data[f.key].join(', ') : (data[f.key] || '—')}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-gray-400 text-xs">{sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-GB') : '—'}</td>
                      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleDelete(sub.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-montserrat font-black text-navy text-base">Submission Details</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {fields.map(f => {
                const data = typeof selected.data === 'string' ? JSON.parse(selected.data) : (selected.data || {})
                const val = data[f.key]
                if (!val) return null
                return (
                  <div key={f.key}>
                    <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-0.5">{f.label}</p>
                    <p className="text-navy text-sm font-lato">{Array.isArray(val) ? val.join(', ') : val}</p>
                  </div>
                )
              })}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-montserrat">Submitted: {selected.submitted_at ? new Date(selected.submitted_at).toLocaleString('en-GB') : '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminForms() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // list | create | edit | submissions
  const [editingForm, setEditingForm] = useState(null)
  const [viewingSubmissions, setViewingSubmissions] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await formsAPI.getAllAdmin()
      setForms(data.forms || [])
    } catch { toast.error('Failed to load forms') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (payload) => {
    try {
      await formsAPI.create(payload)
      toast.success('Form created!')
      setView('list')
      load()
    } catch (err) { toast.error(err.message || 'Failed to create form') }
  }

  const handleUpdate = async (payload) => {
    try {
      await formsAPI.update(editingForm.id, payload)
      toast.success('Form updated!')
      setView('list')
      setEditingForm(null)
      load()
    } catch (err) { toast.error(err.message || 'Failed to update form') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this form and all its submissions? This cannot be undone.')) return
    try {
      await formsAPI.delete(id)
      toast.success('Form deleted')
      load()
    } catch { toast.error('Failed to delete form') }
  }

  const handleToggleStatus = async (form) => {
    const newStatus = form.status === 'open' ? 'closed' : form.status === 'closed' ? 'open' : 'open'
    try {
      await formsAPI.update(form.id, { status: newStatus })
      toast.success(`Form ${newStatus === 'open' ? 'opened' : 'closed'}`)
      load()
    } catch { toast.error('Failed to update status') }
  }

  const copyLink = (slug) => {
    const url = `${window.location.origin}/register/${slug}`
    navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => toast.error('Could not copy'))
  }

  if (view === 'create') return (
    <div>
      <div className="mb-6">
        <button onClick={() => setView('list')} className="flex items-center gap-1 text-xs font-montserrat font-semibold text-gray-400 hover:text-navy transition-colors mb-1">← Back to Forms</button>
        <h1 className="font-montserrat font-black text-navy text-2xl">Create New Form</h1>
      </div>
      <FormEditor onSave={handleCreate} onCancel={() => setView('list')} />
    </div>
  )

  if (view === 'edit' && editingForm) return (
    <div>
      <div className="mb-6">
        <button onClick={() => { setView('list'); setEditingForm(null) }} className="flex items-center gap-1 text-xs font-montserrat font-semibold text-gray-400 hover:text-navy transition-colors mb-1">← Back to Forms</button>
        <h1 className="font-montserrat font-black text-navy text-2xl">Edit Form</h1>
      </div>
      <FormEditor form={editingForm} onSave={handleUpdate} onCancel={() => { setView('list'); setEditingForm(null) }} />
    </div>
  )

  if (view === 'submissions' && viewingSubmissions) return (
    <SubmissionsView form={viewingSubmissions} onBack={() => { setView('list'); setViewingSubmissions(null) }} />
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-2xl mb-0.5">Form Builder</h1>
          <p className="text-gray-400 text-sm">Create registration forms that appear at /register/[slug]</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-semibold text-gray-500 bg-white border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={() => setView('create')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-montserrat font-bold text-white transition-all" style={{ background: '#FF9700' }}>
            <Plus size={13} /> New Form
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : forms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <i className="fas fa-wpforms text-gray-200 text-5xl mb-4 block" />
          <p className="text-gray-400 font-montserrat font-semibold text-sm mb-1">No forms yet</p>
          <p className="text-gray-300 text-xs mb-4">Create your first registration form</p>
          <button onClick={() => setView('create')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm" style={{ background: '#FF9700' }}>
            <Plus size={14} /> Create Form
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map(form => (
            <div key={form.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-orange/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-montserrat font-black text-navy text-base">{form.title}</h3>
                    <StatusBadge status={form.status} />
                  </div>
                  {form.description && <p className="text-gray-500 text-sm mb-2 line-clamp-1">{form.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-montserrat">
                    <span className="flex items-center gap-1"><Users size={11} />{form.submission_count || 0} submissions</span>
                    {form.deadline && <span className="flex items-center gap-1"><i className="fas fa-clock text-xs" />Deadline: {new Date(form.deadline).toLocaleDateString('en-GB')}</span>}
                    <button onClick={() => copyLink(form.slug)} className="flex items-center gap-1 text-orange hover:underline">
                      <Copy size={11} />/register/{form.slug}
                    </button>
                    <a href={`/register/${form.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-navy hover:text-orange transition-colors">
                      <ExternalLink size={11} />Preview
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleToggleStatus(form)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold border transition-all ${form.status === 'open' ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100'}`}>
                    {form.status === 'open' ? <><XCircle size={12} />Close</> : <><CheckCircle size={12} />Open</>}
                  </button>
                  <button onClick={() => { setViewingSubmissions(form); setView('submissions') }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold text-navy bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all">
                    <Eye size={12} />Submissions ({form.submission_count || 0})
                  </button>
                  <button onClick={() => { setEditingForm(form); setView('edit') }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold text-navy bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all">
                    <Edit2 size={12} />Edit
                  </button>
                  <button onClick={() => handleDelete(form.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all">
                    <Trash2 size={12} />Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}