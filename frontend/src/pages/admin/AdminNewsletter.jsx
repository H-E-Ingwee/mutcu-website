import { useEffect, useState } from 'react'
import { newsletterAPI, blogsAPI } from '../../lib/api'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Download, Newspaper, Send, X, Check, ChevronDown, ChevronUp } from 'lucide-react'

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([]) // empty = all
  const [selectAll, setSelectAll] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [selectedBlogIds, setSelectedBlogIds] = useState([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [showBlogPicker, setShowBlogPicker] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      newsletterAPI.getAll(),
      blogsAPI.getAllAdmin(),
    ]).then(([news, bl]) => {
      setSubscribers(news.subscribers || [])
      setBlogs((bl.blogs || []).filter(b => b.status === 'published'))
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return
    try { await newsletterAPI.delete(id); toast.success('Subscriber removed'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const exportCSV = () => {
    const csv = ['Email,Subscribed At,Active', ...subscribers.map(s => `${s.email},${s.subscribed_at},${s.is_active}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'mutcu-newsletter-subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSubscriber = (id) => {
    if (selectAll) {
      // Switch to manual selection, deselect this one
      setSelectAll(false)
      setSelectedIds(subscribers.filter(s => s.id !== id).map(s => s.id))
    } else {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }
  }

  const toggleSelectAll = () => {
    setSelectAll(!selectAll)
    setSelectedIds([])
  }

  const toggleBlog = (id) => {
    setSelectedBlogIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const generateWithAI = async () => {
    setAiGenerating(true)
    try {
      const selectedBlogs = blogs.filter(b => selectedBlogIds.includes(b.id))
      const res = await api.post('/ai/newsletter-content', {
        blogs: selectedBlogs.map(b => ({ title: b.title, author: b.author })),
        events: [],
        customMessage: subject,
      })
      if (res.content) {
        setBody(res.content)
        toast.success('Newsletter content generated!')
      }
    } catch (err) {
      toast.error('Failed to generate content')
    } finally {
      setAiGenerating(false)
    }
  }

  const sendNewsletter = async () => {
    if (!subject.trim()) return toast.error('Please enter a subject')
    if (!body.trim()) return toast.error('Please write the newsletter content')

    const activeSubscribers = subscribers.filter(s => s.is_active)
    const recipientCount = selectAll ? activeSubscribers.length : selectedIds.length

    if (recipientCount === 0) return toast.error('No recipients selected')
    if (!window.confirm(`Send newsletter to ${recipientCount} subscriber${recipientCount !== 1 ? 's' : ''}?`)) return

    setSending(true)
    try {
      const recipientIds = selectAll ? [] : selectedIds
      const res = await api.post('/admin/newsletter/send', { subject, body, recipientIds })
      toast.success(res.message || 'Newsletter sent!')
      setShowCompose(false)
      setSubject('')
      setBody('')
      setSelectedBlogIds([])
    } catch (err) {
      toast.error(err.message || 'Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  const filtered = query.trim() ? subscribers.filter(s => s.email.toLowerCase().includes(query.toLowerCase())) : subscribers
  const active = subscribers.filter(s => s.is_active).length
  const recipientCount = selectAll ? active : selectedIds.length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Newsletter</h1>
          <p className="text-gray-400 text-sm mt-0.5">{active} active · {subscribers.length} total subscribers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-outline btn-sm">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => setShowCompose(true)} className="btn-primary btn-sm">
            <Send size={14} /> Send Newsletter
          </button>
        </div>
      </div>

      {/* ─── Compose Modal ─────────────────────────────────────────────────── */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-montserrat font-bold text-navy text-lg">Send Newsletter</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Sending to: <strong>{recipientCount} subscriber{recipientCount !== 1 ? 's' : ''}</strong>
                  {!selectAll && <span className="text-orange ml-1">(custom selection)</span>}
                </p>
              </div>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Recipients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label mb-0">Recipients</label>
                  <button onClick={toggleSelectAll}
                    className={`text-xs font-montserrat font-bold px-3 py-1 rounded-lg transition-all ${selectAll ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {selectAll ? `✓ All ${active} active subscribers` : `${selectedIds.length} selected`}
                  </button>
                </div>
                {!selectAll && (
                  <div className="border border-gray-200 rounded-xl max-h-32 overflow-y-auto">
                    {subscribers.filter(s => s.is_active).map(s => (
                      <div key={s.id} onClick={() => toggleSubscriber(s.id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedIds.includes(s.id) ? 'bg-orange border-orange' : 'border-gray-300'}`}>
                          {selectedIds.includes(s.id) && <i className="fas fa-check text-white text-xs" />}
                        </div>
                        <span className="text-sm text-navy">{s.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Include Blogs */}
              <div>
                <button onClick={() => setShowBlogPicker(!showBlogPicker)}
                  className="flex items-center gap-2 text-sm font-montserrat font-bold text-navy hover:text-orange transition-colors">
                  {showBlogPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Include Blog Posts ({selectedBlogIds.length} selected)
                </button>
                {showBlogPicker && (
                  <div className="mt-2 border border-gray-200 rounded-xl max-h-40 overflow-y-auto">
                    {blogs.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 text-sm">No published blogs yet</div>
                    ) : blogs.map(b => (
                      <div key={b.id} onClick={() => toggleBlog(b.id)}
                        className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedBlogIds.includes(b.id) ? 'bg-orange border-orange' : 'border-gray-300'}`}>
                          {selectedBlogIds.includes(b.id) && <i className="fas fa-check text-white text-xs" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-navy truncate">{b.title}</div>
                          <div className="text-xs text-gray-400">{b.author || 'MUTCU'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="form-label">Subject *</label>
                <input className="form-input" placeholder="e.g. MUTCU Newsletter — September 2026"
                  value={subject} onChange={e => setSubject(e.target.value)} />
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0">Newsletter Content *</label>
                  <button onClick={generateWithAI} disabled={aiGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition-all text-xs font-montserrat font-bold disabled:opacity-50">
                    {aiGenerating ? <><i className="fas fa-spinner fa-spin text-xs" /> Generating...</> : <><i className="fas fa-magic text-xs" /> Generate with AI</>}
                  </button>
                </div>
                <textarea className="form-textarea" rows={10}
                  placeholder="Write your newsletter content here... You can also use the AI generator above."
                  value={body} onChange={e => setBody(e.target.value)} />
                <p className="text-gray-400 text-xs mt-1">{body.length} characters · Line breaks will be preserved in the email</p>
              </div>

              {/* Preview note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                <i className="fas fa-info-circle mr-1" />
                The newsletter will be sent from <strong>noreply@mutcu.org</strong> with MUTCU branding. Each subscriber receives an individual email.
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button onClick={sendNewsletter} disabled={sending || !subject.trim() || !body.trim()}
                className="btn-primary flex-1 justify-center">
                {sending ? <><i className="fas fa-spinner fa-spin" /> Sending to {recipientCount} subscribers...</> : <><Send size={14} /> Send to {recipientCount} Subscriber{recipientCount !== 1 ? 's' : ''}</>}
              </button>
              <button onClick={() => setShowCompose(false)} className="btn-outline px-4">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Subscriber List ───────────────────────────────────────────────── */}
      <div className="relative mb-5">
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input type="text" placeholder="Search by email..." value={query} onChange={e => setQuery(e.target.value)} className="form-input pl-9" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden sm:table-cell">Subscribed</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy">{s.email}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(s.subscribed_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`badge text-xs ${s.is_active ? 'badge-green' : 'badge-gray'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400">
                  <Newspaper size={32} className="mx-auto mb-2" />
                  <p>{query ? 'No subscribers found' : 'No subscribers yet'}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}