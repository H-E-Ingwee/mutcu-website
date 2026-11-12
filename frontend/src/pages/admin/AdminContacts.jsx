import { useEffect, useState, useMemo } from 'react'
import { contactAPI } from '../../lib/api'
import api from '../../lib/api'
import { getToken } from '../../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Mail, CheckCircle, Send, X, Search, Archive, Download, Sparkles, RefreshCw } from 'lucide-react'

const STATUS_COLORS = {
  new: 'bg-orange/10 text-orange border border-orange/20',
  read: 'bg-blue-100 text-blue-700',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [replyModal, setReplyModal] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [exportingExcel, setExportingExcel] = useState(false)

  const load = () => {
    setLoading(true)
    contactAPI.getAll().then(d => setContacts(d.contacts || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status)
      toast.success(`Marked as ${status}`)
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await contactAPI.delete(id)
      toast.success('Deleted')
      setContacts(prev => prev.filter(c => c.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const bulkArchive = async () => {
    const toArchive = filtered.filter(c => c.status === 'read').map(c => c.id)
    if (toArchive.length === 0) return toast.error('No read messages to archive')
    try {
      await Promise.all(toArchive.map(id => contactAPI.updateStatus(id, 'archived')))
      toast.success(`${toArchive.length} messages archived`)
      load()
    } catch { toast.error('Failed to archive') }
  }

  const generateAiReply = async () => {
    if (!replyModal) return
    setAiGenerating(true)
    try {
      const res = await api.post('/ai/contact-reply', {
        name: replyModal.name,
        subject: replyModal.subject,
        message: replyModal.message,
      })
      if (res.reply) {
        setReplyText(res.reply)
        toast.success('AI reply generated!')
      }
    } catch (err) {
      toast.error('AI generation failed. Write your reply manually.')
    } finally {
      setAiGenerating(false)
    }
  }

  const sendReply = async () => {
    if (!replyText.trim()) return toast.error('Please write a reply message')
    setReplySending(true)
    try {
      await api.post('/admin/send-reply', {
        to: replyModal.email,
        name: replyModal.name,
        subject: `Re: ${replyModal.subject}`,
        message: replyText.trim(),
        originalSubject: replyModal.subject,
      })
      await updateStatus(replyModal.id, 'replied')
      toast.success(`Reply sent to ${replyModal.name}!`)
      setReplyModal(null)
      setReplyText('')
    } catch (err) {
      toast.error(err.message || 'Failed to send reply')
    } finally {
      setReplySending(false)
    }
  }

  const exportExcel = async () => {
    setExportingExcel(true)
    try {
      // Build CSV as fallback (no backend Excel endpoint for contacts yet)
      const rows = [
        ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date'],
        ...contacts.map(c => [c.name, c.email, c.subject, c.message?.replace(/\n/g, ' '), c.status, c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB') : ''])
      ]
      const csv = rows.map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `mutcu-contacts-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
      toast.success('Contacts exported!')
    } catch { toast.error('Export failed') }
    finally { setExportingExcel(false) }
  }

  const filtered = useMemo(() => {
    let list = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      )
    }
    return list
  }, [contacts, filter, search])

  const newCount = contacts.filter(c => c.status === 'new').length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Contact Messages</h1>
          <p className="text-gray-400 text-sm mt-0.5">{newCount} new message{newCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={bulkArchive} className="btn-outline btn-sm">
            <Archive size={13} /> Archive Read
          </button>
          <button onClick={exportExcel} disabled={exportingExcel} className="btn-outline btn-sm">
            <Download size={13} />{exportingExcel ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {['all', 'new', 'read', 'replied', 'archived'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-montserrat font-bold capitalize transition-all ${filter === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s} {s !== 'all' && `(${contacts.filter(c => c.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel layout — stacked on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Message list */}
        <div className="lg:col-span-1 space-y-2 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-0.5">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Mail size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm font-montserrat">{search ? 'No messages match your search' : 'No messages'}</p>
            </div>
          ) : filtered.map(c => (
            <div key={c.id}
              onClick={() => { setSelected(c); if (c.status === 'new') updateStatus(c.id, 'read') }}
              className={`bg-white rounded-xl border p-3.5 cursor-pointer transition-all hover:shadow-sm ${selected?.id === c.id ? 'border-orange shadow-sm' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-montserrat font-bold text-navy text-sm truncate">{c.name}</div>
                <span className={`badge text-xs flex-shrink-0 ${STATUS_COLORS[c.status] || 'badge-gray'}`}>{c.status}</span>
              </div>
              <div className="text-gray-500 text-xs truncate mb-1">{c.subject}</div>
              <div className="text-gray-300 text-xs">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          ))}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <h3 className="font-montserrat font-bold text-navy text-base sm:text-lg truncate">{selected.subject}</h3>
                  <div className="text-gray-400 text-sm mt-1">
                    From: <strong>{selected.name}</strong>
                    <span className="mx-2">·</span>
                    <a href={`mailto:${selected.email}`} className="text-orange hover:underline text-xs sm:text-sm">{selected.email}</a>
                  </div>
                  <div className="text-gray-300 text-xs mt-0.5">{new Date(selected.created_at).toLocaleString('en-GB')}</div>
                </div>
                <button onClick={() => handleDelete(selected.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                {selected.message}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setReplyModal(selected); setReplyText('') }} className="btn-primary btn-sm">
                  <Send size={13} /> Reply via MUTCU
                </button>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-outline btn-sm">
                  <Mail size={13} /> Open in Email App
                </a>
                {['read', 'replied', 'archived'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${selected.status === s ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {s === 'replied' && <CheckCircle size={11} className="inline mr-1" />}
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
              <Mail size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-montserrat font-semibold text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setReplyModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-montserrat font-black text-navy text-base">Reply to {replyModal.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">Sending via MUTCU email system</p>
              </div>
              <button onClick={() => setReplyModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <div className="p-5">
              {/* Original message */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-500">
                <div className="font-semibold mb-1">Original: {replyModal.subject}</div>
                <div className="line-clamp-2 italic">{replyModal.message}</div>
              </div>
              {/* AI generate button */}
              <div className="flex items-center justify-between mb-2">
                <label className="form-label mb-0">Your Reply</label>
                <button onClick={generateAiReply} disabled={aiGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold border border-orange/30 text-orange bg-orange/5 hover:bg-orange/10 transition-all disabled:opacity-60">
                  {aiGenerating ? <><RefreshCw size={11} className="animate-spin" />Generating...</> : <><Sparkles size={11} />Generate with AI</>}
                </button>
              </div>
              <textarea
                className="form-textarea w-full"
                rows={6}
                placeholder={`Dear ${replyModal.name},\n\nThank you for reaching out to MUTCU...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                autoFocus
              />
              <p className="text-gray-400 text-xs mt-1">
                Sent from <strong>noreply@mutcu.org</strong> to <strong>{replyModal.email}</strong>
              </p>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={sendReply} disabled={replySending || !replyText.trim()} className="btn-primary flex-1 justify-center">
                {replySending ? <><RefreshCw size={13} className="animate-spin" />Sending...</> : <><Send size={13} />Send Reply</>}
              </button>
              <button onClick={() => setReplyModal(null)} className="btn-outline px-5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}