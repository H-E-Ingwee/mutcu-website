import { useEffect, useState } from 'react'
import { eventsAPI, adminAPI } from '../../lib/api'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Save, Star, Image, Calendar, MessageSquare, Eye, Plus, Trash2, X, ExternalLink, RefreshCw } from 'lucide-react'

const HERO_SLIDES_DEFAULT = [
  { image: '/assets/images/exec.jpg', title: 'Raising a Christ-like Family', subtitle: "Equipped in all aspects of life — united as one body, and reaching out to non-believers within our community and beyond.", cta1: 'Our Mission', cta1Link: '/about', cta2: 'View Programs', cta2Link: '/events' },
  { image: '/assets/images/Lumii_20241023_192938507.jpg', title: 'Inspire Love, Hope & Godliness', subtitle: "Murang'a University of Technology Christian Union — a Christ-centred family for discipleship, evangelism, mission work, and leadership development.", cta1: 'Join Us', cta1Link: '/register', cta2: 'Watch / Listen', cta2Link: '/resources' },
  { image: '/assets/images/church2.jpg', title: 'Growing in the Word & Prayer', subtitle: 'Join us for Bible study, prayer meetings, worship services, fellowships, and trainings that build a grounded and fruitful walk with Christ.', cta1: 'Resources', cta1Link: '/resources', cta2: 'Serve With Us', cta2Link: '/ministries' },
  { image: '/assets/images/church3.jpg', title: 'A Model Christian Union', subtitle: 'Cultivating Christ-centeredness among members to positively impact the society.', cta1: 'Our Vision', cta1Link: '/about', cta2: 'View Gallery', cta2Link: '/gallery' },
]

const SECTION_TOGGLES = [
  { key: 'show_join_cta', label: 'Join CTA Banner', desc: 'Orange "Ready to Join Us?" banner below hero' },
  { key: 'show_about', label: 'About Section', desc: 'Who We Are — mission, vision, FOCUS Kenya' },
  { key: 'show_values', label: 'Core Values', desc: 'Faith, Love, Hope, Godliness, Accountability, Service' },
  { key: 'show_ministries', label: 'Ministries Preview', desc: '6 ministry cards grid' },
  { key: 'show_events', label: 'Upcoming Events', desc: 'Featured events from the database' },
  { key: 'show_prayer', label: 'Prayer Section', desc: 'Prayer form with AI encouragement' },
  { key: 'show_testimonials', label: 'Testimonials', desc: 'Rotating member testimonials' },
  { key: 'show_gallery', label: 'Gallery Preview', desc: '8-photo gallery grid' },
]

const TABS = [
  { id: 'hero', label: 'Hero Slides', icon: Image },
  { id: 'events', label: 'Featured Events', icon: Calendar },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'sections', label: 'Sections', icon: Eye },
]

export default function AdminHomepage() {
  const [activeTab, setActiveTab] = useState('hero')
  const [heroSlides, setHeroSlides] = useState(HERO_SLIDES_DEFAULT)
  const [testimonials, setTestimonials] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingSlides, setSavingSlides] = useState(false)
  const [editSlide, setEditSlide] = useState(null)
  const [newTestimonial, setNewTestimonial] = useState({ quote: '', author: '', role: '' })
  const [addingTestimonial, setAddingTestimonial] = useState(false)

  useEffect(() => {
    Promise.all([
      eventsAPI.getAll({ limit: 100 }),
      api.get('/settings'),
      adminAPI.getTestimonials(),
    ]).then(([ev, sett, test]) => {
      setAllEvents(ev.events || [])
      const s = sett.settings || {}
      setSettings(s)
      if (test.testimonials?.length > 0) setTestimonials(test.testimonials)
      if (s.hero_slides) {
        try {
          const parsed = JSON.parse(s.hero_slides)
          if (Array.isArray(parsed) && parsed.length > 0) setHeroSlides(parsed)
        } catch {}
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const saveHeroSlides = async () => {
    setSavingSlides(true)
    try {
      await api.put('/settings', { hero_slides: JSON.stringify(heroSlides) })
      toast.success('Hero slides saved! Changes are live on the homepage.')
    } catch { toast.error('Failed to save hero slides') }
    finally { setSavingSlides(false) }
  }

  const saveSlide = (slide) => {
    const clean = { image: slide.image, title: slide.title, subtitle: slide.subtitle, cta1: slide.cta1, cta1Link: slide.cta1Link, cta2: slide.cta2, cta2Link: slide.cta2Link }
    if (slide._new) setHeroSlides(prev => [...prev, clean])
    else setHeroSlides(prev => prev.map((s, i) => i === slide._index ? clean : s))
    setEditSlide(null)
  }

  const deleteSlide = (index) => {
    if (heroSlides.length <= 1) return toast.error('You need at least one hero slide')
    setHeroSlides(prev => prev.filter((_, i) => i !== index))
  }

  const toggleEventFeatured = async (event) => {
    try {
      await eventsAPI.update(event.id, { is_featured: !event.is_featured })
      setAllEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_featured: !e.is_featured } : e))
      toast.success(event.is_featured ? 'Removed from homepage' : 'Added to homepage ⭐')
    } catch { toast.error('Failed to update') }
  }

  const saveTestimonial = async () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.author.trim()) return toast.error('Quote and author are required')
    setAddingTestimonial(true)
    try {
      const data = await adminAPI.createTestimonial(newTestimonial)
      setTestimonials(prev => [...prev, data.testimonial])
      setNewTestimonial({ quote: '', author: '', role: '' })
      toast.success('Testimonial added!')
    } catch { toast.error('Failed to add testimonial') }
    finally { setAddingTestimonial(false) }
  }

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try { await adminAPI.deleteTestimonial(id); setTestimonials(prev => prev.filter(t => t.id !== id)); toast.success('Deleted') }
    catch { toast.error('Failed to delete') }
  }

  const toggleSection = async (key) => {
    const newVal = settings[key] === 'false' ? 'true' : 'false'
    try {
      await api.put('/settings', { [key]: newVal })
      setSettings(prev => ({ ...prev, [key]: newVal }))
      toast.success(`Section ${newVal === 'false' ? 'hidden' : 'shown'} on homepage`)
    } catch { toast.error('Failed to update') }
  }

  const featuredCount = allEvents.filter(e => e.is_featured).length

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Homepage Manager</h1>
          <p className="text-gray-400 text-sm mt-0.5">Control what appears on the homepage without touching code</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm self-start sm:self-auto">
          <ExternalLink size={14} /> Preview Site
        </a>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-montserrat font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
            <tab.icon size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* ── HERO SLIDES ── */}
      {activeTab === 'hero' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <p className="text-gray-500 text-sm">Manage the rotating hero slideshow. Changes are saved to the database and go live immediately — no redeployment needed.</p>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditSlide({ image: '', title: '', subtitle: '', cta1: 'Learn More', cta1Link: '/about', cta2: 'Join Us', cta2Link: '/register', _new: true })} className="btn-outline btn-sm">
                <Plus size={14} /> Add Slide
              </button>
              <button onClick={saveHeroSlides} disabled={savingSlides} className="btn-primary btn-sm">
                {savingSlides ? <><RefreshCw size={13} className="animate-spin" />Saving...</> : <><Save size={13} />Save Slides</>}
              </button>
            </div>
          </div>
          <div className="space-y-3 mb-4">
            {heroSlides.map((slide, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange/20 transition-all">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-bold text-navy text-sm truncate">{slide.title || 'Untitled Slide'}</div>
                    <div className="text-gray-400 text-xs line-clamp-1 mt-0.5">{slide.subtitle}</div>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold">{slide.cta1}</span>
                      <span className="px-2 py-0.5 rounded-full bg-navy/10 text-navy text-xs font-montserrat font-bold">{slide.cta2}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-montserrat font-black text-gray-500">{i + 1}</span>
                    <button onClick={() => setEditSlide({ ...slide, _index: i })} className="px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-navy transition-colors text-xs font-montserrat font-semibold">Edit</button>
                    <button onClick={() => deleteSlide(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 flex items-start gap-2">
            <i className="fas fa-check-circle mt-0.5 flex-shrink-0" />
            <span>Hero slides are saved to the database. Click <strong>Save Slides</strong> after making changes — they go live immediately.</span>
          </div>
        </div>
      )}

      {/* ── FEATURED EVENTS ── */}
      {activeTab === 'events' && (
        <div>
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Toggle which events appear in the "Upcoming Highlights" section on the homepage.</p>
            <p className="text-gray-400 text-xs mt-1">Currently showing: <strong className="text-navy">{featuredCount}</strong> featured events (limit: {settings.homepage_events_limit || 6})</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Event</th>
                    <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-center px-4 py-3 font-montserrat font-bold text-navy text-xs uppercase tracking-wider">Homepage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allEvents.slice(0, 40).map(ev => (
                    <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-navy text-sm">{ev.title}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{ev.date ? new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`badge text-xs ${ev.service_type === 'SUNDAY' ? 'badge-navy' : ev.service_type === 'FRIDAY' ? 'badge-orange' : 'badge-teal'}`}>{ev.service_type}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleEventFeatured(ev)}
                          className={`p-1.5 rounded-lg transition-all ${ev.is_featured ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400 hover:bg-orange/10 hover:text-orange'}`}
                          title={ev.is_featured ? 'Remove from homepage' : 'Add to homepage'}>
                          <Star size={14} fill={ev.is_featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allEvents.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No events found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TESTIMONIALS ── */}
      {activeTab === 'testimonials' && (
        <div>
          <p className="text-gray-500 text-sm mb-5">Manage the rotating testimonials shown on the homepage.</p>
          <div className="space-y-3 mb-6">
            {testimonials.map((t, i) => (
              <div key={t.id || i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0 text-orange font-montserrat font-black text-sm">
                  {(t.author || 'M').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 italic">"{t.quote}"</p>
                  <p className="text-navy font-montserrat font-bold text-xs mt-1">— {t.author}{t.role ? `, ${t.role}` : ''}</p>
                </div>
                {t.id && (
                  <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <MessageSquare size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm">No testimonials yet. Add one below.</p>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2"><Plus size={14} className="text-orange" />Add New Testimonial</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Quote *</label>
                <textarea className="form-textarea" rows={3} value={newTestimonial.quote} onChange={e => setNewTestimonial(t => ({ ...t, quote: e.target.value }))} placeholder="What did this member say about MUTCU?" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Author *</label>
                  <input className="form-input" value={newTestimonial.author} onChange={e => setNewTestimonial(t => ({ ...t, author: e.target.value }))} placeholder="e.g. MUTCU Member" />
                </div>
                <div>
                  <label className="form-label">Role <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className="form-input" value={newTestimonial.role} onChange={e => setNewTestimonial(t => ({ ...t, role: e.target.value }))} placeholder="e.g. Ministry Leader" />
                </div>
              </div>
              <button onClick={saveTestimonial} disabled={addingTestimonial} className="btn-primary btn-sm">
                {addingTestimonial ? 'Adding...' : <><Plus size={14} />Add Testimonial</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTIONS ── */}
      {activeTab === 'sections' && (
        <div>
          <p className="text-gray-500 text-sm mb-5">Show or hide sections on the homepage. Changes take effect immediately.</p>
          <div className="space-y-3">
            {SECTION_TOGGLES.map(section => {
              const isOn = settings[section.key] !== 'false'
              return (
                <div key={section.key} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-bold text-navy text-sm">{section.label}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{section.desc}</div>
                  </div>
                  <button onClick={() => toggleSection(section.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isOn ? 'bg-orange' : 'bg-gray-200'}`}
                    role="switch" aria-checked={isOn}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── SLIDE EDIT MODAL ── */}
      {editSlide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditSlide(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-montserrat font-black text-navy text-base">{editSlide._new ? 'Add New Slide' : 'Edit Slide'}</h3>
              <button onClick={() => setEditSlide(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="form-label">Background Image URL</label>
                <input className="form-input" value={editSlide.image} onChange={e => setEditSlide(s => ({ ...s, image: e.target.value }))} placeholder="/assets/images/church2.jpg or https://..." />
                {editSlide.image && (
                  <div className="mt-2 rounded-xl overflow-hidden bg-gray-100" style={{ height: '100px' }}>
                    <img src={editSlide.image} alt="Preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">Title</label>
                <input className="form-input" value={editSlide.title} onChange={e => setEditSlide(s => ({ ...s, title: e.target.value }))} placeholder="Slide headline" />
              </div>
              <div>
                <label className="form-label">Subtitle</label>
                <textarea className="form-textarea" rows={2} value={editSlide.subtitle} onChange={e => setEditSlide(s => ({ ...s, subtitle: e.target.value }))} placeholder="Supporting text below the title" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Button 1 Label</label>
                  <input className="form-input" value={editSlide.cta1} onChange={e => setEditSlide(s => ({ ...s, cta1: e.target.value }))} placeholder="Our Mission" />
                </div>
                <div>
                  <label className="form-label">Button 1 Link</label>
                  <input className="form-input" value={editSlide.cta1Link} onChange={e => setEditSlide(s => ({ ...s, cta1Link: e.target.value }))} placeholder="/about" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Button 2 Label</label>
                  <input className="form-input" value={editSlide.cta2} onChange={e => setEditSlide(s => ({ ...s, cta2: e.target.value }))} placeholder="Join Us" />
                </div>
                <div>
                  <label className="form-label">Button 2 Link</label>
                  <input className="form-input" value={editSlide.cta2Link} onChange={e => setEditSlide(s => ({ ...s, cta2Link: e.target.value }))} placeholder="/register" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={() => saveSlide(editSlide)} className="btn-primary flex-1 justify-center">
                <Save size={15} />{editSlide._new ? 'Add Slide' : 'Save Changes'}
              </button>
              <button onClick={() => setEditSlide(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}