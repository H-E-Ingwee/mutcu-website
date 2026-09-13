import { useEffect, useState } from 'react'
import { blogsAPI } from '../../lib/api'
import RichTextEditor from '../../components/RichTextEditor'
import AIBlogAssistant from '../../components/AIBlogAssistant'
import ImagePicker from '../../components/admin/ImagePicker'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff, FileText, Clock } from 'lucide-react'

const EMPTY = { title: '', slug: '', excerpt: '', content: '', featured_image: '', author: '', status: 'draft', tags: '' }

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | blog object
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const load = () => {
    setLoading(true)
    blogsAPI.getAllAdmin().then(d => setBlogs(d.blogs || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setPreview(false); setModal('add') }
  const openEdit = (b) => { setForm({ ...EMPTY, ...b }); setPreview(false); setModal(b) }

  // Auto-generate slug from title
  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm(f => ({ ...f, title, ...(modal === 'add' || !f.slug ? { slug } : {}) }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.content || form.content === '<p></p>') return toast.error('Content is required')
    setSaving(true)
    try {
      if (modal === 'add') { await blogsAPI.create(form); toast.success('Blog post created!') }
      else { await blogsAPI.update(modal.id, form); toast.success('Blog post updated!') }
      setModal(null); load()
    } catch (err) { toast.error(err.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post? This cannot be undone.')) return
    try { await blogsAPI.delete(id); toast.success('Blog post deleted'); load() }
    catch (err) { toast.error(err.message || 'Failed') }
  }

  const toggleStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published'
    try {
      await blogsAPI.update(blog.id, { status: newStatus })
      toast.success(`Blog ${newStatus === 'published' ? 'published ✓' : 'moved to draft'}`)
      load()
    } catch (err) { toast.error(err.message || 'Failed') }
  }

  const published = blogs.filter(b => b.status === 'published').length
  const drafts = blogs.filter(b => b.status === 'draft').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Blog Management</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><Eye size={11} />{published} published</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />{drafts} draft{drafts !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14} /> New Post</button>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden sm:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blogs.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy text-sm line-clamp-1">{b.title}</div>
                    {b.tags && <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{b.tags}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{b.author || 'MUTCU'}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleStatus(b)} title={b.status === 'published' ? 'Unpublish' : 'Publish'}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors">
                        {b.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-montserrat font-semibold">No blog posts yet</p>
                  <p className="text-xs mt-1">Click "New Post" to write your first article</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Blog Editor Modal ─────────────────────────────────────────────────── */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl my-4 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange/10 flex items-center justify-center">
                  <FileText size={16} className="text-orange" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-navy text-base">
                    {modal === 'add' ? 'New Blog Post' : 'Edit Blog Post'}
                  </h3>
                  <p className="text-gray-400 text-xs">{form.status === 'published' ? '● Published' : '○ Draft'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Preview toggle */}
                <button onClick={() => setPreview(!preview)}
                  className={`btn-sm px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all ${preview ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {preview ? <><Eye size={12} className="inline mr-1" />Preview</> : <><Eye size={12} className="inline mr-1" />Preview</>}
                </button>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {preview ? (
                /* ─── Preview Mode ─────────────────────────────────────────── */
                <div className="max-w-3xl mx-auto">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    {form.featured_image && (
                      <img src={form.featured_image} alt={form.title} className="w-full h-56 object-cover rounded-2xl mb-5"
                        onError={e => { e.target.style.display = 'none' }} />
                    )}
                    {form.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {form.tags.split(',').map(t => <span key={t} className="badge badge-orange text-xs">{t.trim()}</span>)}
                      </div>
                    )}
                    <h1 className="font-montserrat font-black text-navy text-3xl mb-2">{form.title || 'Untitled Post'}</h1>
                    {form.excerpt && <p className="text-gray-500 text-lg italic border-l-4 border-orange pl-4">{form.excerpt}</p>}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>By {form.author || 'MUTCU'}</span>
                      <span>·</span>
                      <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="blog-content" dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-gray-400 italic">No content yet...</p>' }} />
                </div>
              ) : (
                /* ─── Edit Mode ────────────────────────────────────────────── */
                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="form-label">Title <span className="text-orange">*</span></label>
                    <input className="form-input text-lg font-montserrat font-bold" value={form.title}
                      onChange={e => handleTitleChange(e.target.value)} placeholder="Your blog post title..." />
                  </div>

                  {/* Slug + Author */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">URL Slug</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/blogs/</span>
                        <input className="form-input pl-14 text-sm" value={form.slug}
                          onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-slug" />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Author</label>
                      <input className="form-input" value={form.author}
                        onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Author name" />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="form-label">Excerpt <span className="text-gray-400 font-normal">(shown in blog list)</span></label>
                    <textarea className="form-textarea" rows={2} value={form.excerpt}
                      onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                      placeholder="A brief summary of this post..." />
                  </div>

                  {/* Featured Image */}
                  <ImagePicker
                    label="Featured Image"
                    value={form.featured_image}
                    onChange={url => setForm(f => ({ ...f, featured_image: url }))}
                  />

                  {/* Tags */}
                  <div>
                    <label className="form-label">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                    <input className="form-input" value={form.tags}
                      onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                      placeholder="faith, devotional, prayer, testimony" />
                  </div>

                  
                      value={form.content}
                      onChange={content => setForm(f => ({ ...f, content }))}
                      placeholder="Write your blog post here... Use the toolbar above to format your content."
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-4 pt-2">
                    <label className="form-label mb-0">Status:</label>
                    <div className="flex gap-2">
                      {['draft', 'published'].map(s => (
                        <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                          className={`px-4 py-2 rounded-xl text-sm font-montserrat font-bold capitalize transition-all ${form.status === s ? (s === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white') : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {s === 'published' ? <><Eye size={13} className="inline mr-1.5" />Publish</> : <><Clock size={13} className="inline mr-1.5" />Save as Draft</>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
              <button onClick={() => setModal(null)} className="btn-outline btn-sm">
                <X size={14} /> Cancel
              </button>
              <div className="flex gap-3">
                <button onClick={() => setPreview(!preview)} className="btn-outline btn-sm">
                  {preview ? 'Back to Edit' : 'Preview'}
                </button>
                <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
                  <Check size={14} />
                  {saving ? 'Saving...' : form.status === 'published' ? 'Publish Post' : 'Save Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}