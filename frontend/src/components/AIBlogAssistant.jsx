import { useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

const TONES = [
  { value: 'devotional', label: 'Devotional', icon: 'fa-bible', desc: 'Spiritual reflection with scripture' },
  { value: 'inspirational', label: 'Inspirational', icon: 'fa-fire', desc: 'Motivating and uplifting' },
  { value: 'educational', label: 'Educational', icon: 'fa-graduation-cap', desc: 'Teaching and informative' },
  { value: 'testimony', label: 'Testimony', icon: 'fa-heart', desc: 'Personal faith story style' },
]

export default function AIBlogAssistant({ onInsert, currentTitle = '' }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(currentTitle)
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('devotional')
  const [generating, setGenerating] = useState(false)
  const [preview, setPreview] = useState('')

  const generate = async () => {
    if (!title.trim()) return toast.error('Please enter a title first')
    setGenerating(true)
    setPreview('')
    try {
      const res = await api.post('/ai/blog-draft', { title: title.trim(), topic: topic.trim(), tone })
      setPreview(res.draft || '')
      toast.success('Draft generated! Review and insert when ready.')
    } catch (err) {
      toast.error(err.message || 'Generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const insertDraft = () => {
    if (!preview) return
    onInsert(preview)
    setOpen(false)
    setPreview('')
    toast.success('Draft inserted into editor!')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => { setTitle(currentTitle); setOpen(true) }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition-all text-sm font-montserrat font-semibold"
      >
        <i className="fas fa-robot text-sm" />
        Generate with AI
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <i className="fas fa-robot text-purple-600 text-lg" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-navy text-lg">AI Blog Assistant</h3>
              <p className="text-gray-400 text-xs">Powered by Google Gemini</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <i className="fas fa-times text-lg" />
          </button>
        </div>

        {!preview ? (
          <div className="space-y-4">
            <div>
              <label className="form-label">Blog Title <span className="text-orange">*</span></label>
              <input className="form-input" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Walking in Faith During Exam Season" />
            </div>
            <div>
              <label className="form-label">Additional Focus / Topic (Optional)</label>
              <input className="form-input" value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g. trusting God with academic pressure, Philippians 4:6-7" />
              <p className="text-gray-400 text-xs mt-1">Add specific scriptures, themes, or focus areas for the AI to include</p>
            </div>
            <div>
              <label className="form-label">Writing Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button key={t.value} type="button" onClick={() => setTone(t.value)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${tone === t.value ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <i className={`fas ${t.icon} mt-0.5 flex-shrink-0 ${tone === t.value ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div>
                      <div className={`font-montserrat font-bold text-sm ${tone === t.value ? 'text-purple-700' : 'text-navy'}`}>{t.label}</div>
                      <div className="text-gray-400 text-xs">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700">
              <i className="fas fa-info-circle mr-1" />
              The AI will generate a 400-600 word blog post draft. You can edit it freely in the editor before publishing.
            </div>

            <div className="flex gap-3">
              <button onClick={generate} disabled={generating || !title.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-montserrat font-bold text-sm transition-all disabled:opacity-50">
                {generating ? (
                  <><i className="fas fa-spinner fa-spin" /> Generating...</>
                ) : (
                  <><i className="fas fa-magic" /> Generate Draft</>
                )}
              </button>
              <button onClick={() => setOpen(false)} className="btn-outline px-4">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-montserrat font-bold text-navy">Generated Draft</h4>
              <button onClick={() => setPreview('')} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
                <i className="fas fa-redo text-xs" /> Regenerate
              </button>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 max-h-64 overflow-y-auto">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{preview}</p>
            </div>
            <div className="bg-orange/5 border border-orange/20 rounded-xl p-3 mb-4 text-xs text-orange">
              <i className="fas fa-edit mr-1" />
              This is an AI-generated draft. Review and edit it in the editor before publishing. Always verify scripture references.
            </div>
            <div className="flex gap-3">
              <button onClick={insertDraft} className="flex-1 btn-primary justify-center">
                <i className="fas fa-check" /> Insert into Editor
              </button>
              <button onClick={() => setPreview('')} className="btn-outline px-4">
                <i className="fas fa-redo" /> Redo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}