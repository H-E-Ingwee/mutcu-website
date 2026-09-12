import { useEffect, useState } from 'react'
import { eventsAPI, galleryAPI, adminAPI } from '../../lib/api'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Save, Star, Image, Calendar, MessageSquare, Eye, EyeOff, GripVertical, Plus, Trash2, X, Check } from 'lucide-react'

const HERO_SLIDES_DEFAULT = [
  { image: '/assets/images/exec.jpg', title: 'Raising a Christ-like Family', subtitle: "Equipped in all aspects of life — united as one body, and reaching out to non-believers within our community and beyond.", cta1: 'Our Mission', cta1Link: '/about', cta2: 'View Programs', cta2Link: '/events' },
  { image: '/assets/images/Lumii_20241023_192938507.jpg', title: 'Inspire Love, Hope & Godliness', subtitle: "Murang'a University of Technology Christian Union — a Christ-centred family for discipleship, evangelism, mission work, and leadership development.", cta1: 'Join Us', cta1Link: '/register', cta2: 'Watch / Listen', cta2Link: '/resources' },
  { image: '/assets/images/church2.jpg', title: 'Growing in the Word & Prayer', subtitle: 'Join us for Bible study, prayer meetings, worship services, fellowships, and trainings that build a grounded and fruitful walk with Christ.', cta1: 'Resources', cta1Link: '/resources', cta2: 'Serve With Us', cta2Link: '/ministries' },
  { image: '/assets/images/church3.jpg', title: 'A Model Christian Union', subtitle: 'Cultivating Christ-centeredness among members to positively impact the society.', cta1: 'Our Vision', cta1Link: '/about', cta2: 'View Gallery', cta2Link: '/gallery' },
]

const TESTIMONIALS_DEFAULT = [
  { quote: 'MUTCU has been my family away from home. The fellowship and discipleship have deepened my faith and helped me navigate university life.', author: 'MUTCU Member' },
  { quote: 'Serving in ministry helped me grow in discipline, accountability, and boldness for Christ.', author: 'MUTCU Member' },
  { quote: 'The Word, prayer meetings, and mentorship shaped me spiritually and gave me purpose in campus.', author: 'MUTCU Member' },
]

export default function AdminHomepage() {
  const [activeTab, setActiveTab] = useState('hero')
  const [heroSlides, setHeroSlides] = useState(HERO_SLIDES_DEFAULT)
  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DEFAULT)
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [allGallery, setAllGallery] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editSlide, setEditSlide] = useState(null)
  const [editTestimonial, setEditTestimonial] = useState(null)
  const [newTestimonial, setNewTestimonial] = useState({ quote: '', author: '', role: '' })

  useEffect(() => {
    Promise.all([
      eventsAPI.getAll({ limit: 100 }),
      galleryAPI.getAll({ limit: 100 }),
      api.get('/settings'),
      adminAPI.getTestimonials(),
    ]).then(([ev, gal, sett, test]) => {
      setAllEvents(ev.events || [])
      setFeaturedEvents((ev.events || []).filter(e => e.is_featured))
      setAllGallery(gal.gallery || [])
      setGalleryPhotos((gal.gallery || []).slice(0, 8))
      setSettings(sett.settings || {})
      if (test.testimonials?.length > 0) setTestimonials(test.testimonials)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const saveSettings = async (updates) => {
    setSaving(true)
    try {
      await api.put('/settings', updates)
      setSettings(prev => ({ ...prev, ...updates }))
      toast.success('Homepage settings saved!')
    } catch (err) { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const toggleEventFeatured = async (event) => {
    try {
      await eventsAPI.update(event.id, { is_featured: !event.is_featured })
      setAllEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_featured: !e.is_featured } : e))
      setFeaturedEvents(prev => event.is_featured ? prev.filter(e => e.id !== event.id) : [...prev, { ...event, is_featured: true }])
      toast.success(event.is_featured ? 'Removed from homepage' : 'Added to homepage')
    } catch (err) { toast.error('Failed to update') }
  }

  const saveTestimonial = async () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.author.trim()) return toast.error('Quote and author are required')
    try {
      const data = await adminAPI.createTestimonial(newTestimonial)
      setTestimonials(prev => [...prev, data.testimonial])
      setNewTestimonial({ quote: '', author: '', role: '' })
      toast.success('Testimonial added!')
    } catch (err) { toast.error('Failed to add testimonial') }
  }

  const deleteTestimonial = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try {
      await adminAPI.deleteTestimonial(id)
      setTestimonials(prev => prev.filter(t => t.id !== id))
      toast.success('Testimonial deleted')
    } catch (err) { toast.error('Failed to delete') }
  }

  const TABS = [
    { id: 'hero', label: 'Hero Slides', icon: Image },
    { id: 'events', label: 'Featured Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery Preview', icon: Image },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'sections', label: 'Sections', icon: Eye },
  ]

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Homepage Manager</h1>
          <p className="text-gray-400 text-sm mt-0.5">Control what appears on the homepage without touching code</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">
          <Eye size={14} /> Preview Site
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-montserrat font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
            <tab.icon size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* ─── Hero Slides ─────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">Manage the rotating hero slideshow on the homepage. Each slide has a background image, title, subtitle, and two CTA buttons.</p>
            <button onClick={() => setEditSlide({ image: '', title: '', subtitle: '', cta1: 'Learn More', cta1Link: '/about', cta2: 'Join Us', cta2Link: '/register', _new: true })}
              className="btn-primary btn-sm"><Plus size={14} /> Add Slide</button>
          </div>
          <div className="space-y-3">
            {heroSlides.map((slide, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover"
                      onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-bold text-navy text-sm">{slide.title}</div>
                    <div className="text-gray-400 text-xs line-clamp-1 mt-0.5">{slide.subtitle}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="badge badge-orange text-xs">{slide.cta1}</span>
                      <span className="badge badge-navy text-xs">{slide.cta2}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setEditSlide({ ...slide, _index: i })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors text-xs font-semibold">Edit</button>
                    <button onClick={() => setHeroSlides(prev => prev.filter((_, j) => j !== i))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
            <i className="fas fa-info-circle mr-2" />Hero slides auto-rotate every 5 seconds. Changes take effect after deploying the updated code.
          </div>
        </div>
      )}

      {/* ─── Featured Events ──────────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm">Toggle which events appear in the "Upcoming Highlights" section on the homepage.</p>
              <p className="text-gray-400 text-xs mt-1">Currently showing: <strong>{featuredEvents.length}</strong> featured events (limit: {settings.homepage_events_limit || 6})</p>
            </div>
            <button onClick={() => saveSettings({ homepage_events_limit: String(parseInt(settings.homepage_events_limit || 6) + 1) })}
              className="btn-outline btn-sm">Increase Limit</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
                {allEvents.slice(0, 30).map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-navy text-sm">{ev.title}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{ev.date ? new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`badge text-xs ${ev.service_type === 'SUNDAY' ? 'badge-navy' : ev.service_type === 'FRIDAY' ? 'badge-orange' : 'badge-teal'}`}>{ev.service_type}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleEventFeatured(ev)}
                        className={`p-1.5 rounded-lg transition-all ${ev.is_featured ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400 hover:bg-orange/10 hover:text-orange'}`}>
                        <Star size={14} fill={ev.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Gallery Preview ──────────────────────────────────────────────────── */}
      {activeTab === 'gallery' && (
        <div>
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Select which photos appear in the homepage gallery preview section.</p>
            <p className="text-gray-400 text-xs mt-1">Currently showing: <strong>{galleryPhotos.length}</strong> photos (limit: {settings.homepage_gallery_limit || 8})</p>
          </div>
          <div className="mb-5">
            <h4 className="font-montserrat font-bold text-navy text-sm mb-3">Selected for Homepage</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {galleryPhotos.map((photo, i) => (
                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={photo.image_url} alt={photo.title || ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => setGalleryPhotos(prev => prev.filter((_, j) => j !== i))}
                      className="p-1 rounded-full bg-red-500 text-white">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold">{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-montserrat font-bold text-navy text-sm mb-3">All Gallery Photos — Click to Add</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {allGallery.filter(g => !galleryPhotos.find(p => p.id === g.id)).map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => { if (galleryPhotos.length < parseInt(settings.homepage_gallery_limit || 8)) setGalleryPhotos(prev => [...prev, photo]); else toast.error(`Limit is ${settings.homepage_gallery_limit || 8} photos`) }}>
                  <img src={photo.image_url} alt={photo.title || ''} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus size={20} className="text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Testimonials ─────────────────────────────────────────────────────── */}
      {activeTab === 'testimonials' && (
        <div>
          <p className="text-gray-500 text-sm mb-5">Manage the testimonials shown in the rotating carousel on the homepage.</p>
          <div className="space-y-3 mb-6">
            {testimonials.map((t, i) => (
              <div key={t.id || i} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm italic leading-relaxed mb-2">"{t.quote}"</p>
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-bold text-navy text-xs">— {t.author}</span>
                      {t.role && <span className="text-gray-400 text-xs">· {t.role}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h4 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
              <Plus size={14} className="text-orange" /> Add New Testimonial
            </h4>
            <div className="space-y-3">
              <div>
                <label className="form-label">Quote <span className="text-orange">*</span></label>
                <textarea className="form-textarea" rows={3} placeholder="Share your MUTCU experience..."
                  value={newTestimonial.quote} onChange={e => setNewTestimonial(p => ({ ...p, quote: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Author <span className="text-orange">*</span></label>
                  <input className="form-input" placeholder="MUTCU Member" value={newTestimonial.author}
                    onChange={e => setNewTestimonial(p => ({ ...p, author: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Role (optional)</label>
                  <input className="form-input" placeholder="Full Member" value={newTestimonial.role}
                    onChange={e => setNewTestimonial(p => ({ ...p, role: e.target.value }))} />
                </div>
              </div>
              <button onClick={saveTestimonial} className="btn-primary btn-sm">
                <Check size={14} /> Add Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sections Toggle ──────────────────────────────────────────────────── */}
      {activeTab === 'sections' && (
        <div>
          <p className="text-gray-500 text-sm mb-5">Toggle homepage sections on or off. Changes take effect after saving.</p>
          <div className="space-y-3">
            {[
              { key: 'show_hero', label: 'Hero Slideshow', desc: 'The rotating hero banner at the top of the homepage' },
              { key: 'show_join_cta', label: 'Join CTA Banner', desc: 'The orange "Ready to Join Us?" call-to-action banner' },
              { key: 'show_about', label: 'About Section', desc: 'Mission, vision, and FOCUS Kenya affiliation' },
              { key: 'show_values', label: 'Core Values', desc: 'The 6 core values section (Faith, Love, Hope, etc.)' },
              { key: 'show_ministries', label: 'Ministries Preview', desc: 'Ministry cards linking to ministry pages' },
              { key: 'show_events', label: 'Upcoming Events', desc: 'Featured upcoming events from the events database' },
              { key: 'show_prayer', label: 'Prayer Request Form', desc: 'The prayer request submission form' },
              { key: 'show_testimonials', label: 'Testimonials', desc: 'Member testimonials carousel' },
              { key: 'show_gallery', label: 'Gallery Preview', desc: 'Photo gallery preview grid' },
              { key: 'show_newsletter', label: 'Newsletter Section', desc: 'Email newsletter subscription form' },
            ].map(section => {
              const isOn = settings[section.key] !== 'false'
              return (
                <div key={section.key} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <div className="font-montserrat font-bold text-navy text-sm">{section.label}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{section.desc}</div>
                  </div>
                  <button onClick={() => saveSettings({ [section.key]: isOn ? 'false' : 'true' })}
                    className={`relative w-12 h-6 rounded-full transition-all ${isOn ? 'bg-orange' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${isOn ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={() => saveSettings(settings)} disabled={saving} className="btn-primary">
              <Save size={14} />{saving ? 'Saving...' : 'Save Section Settings'}
            </button>
          </div>
        </div>
      )}

      {/* ─── Edit Slide Modal ─────────────────────────────────────────────────── */}
      {editSlide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-montserrat font-bold text-navy text-lg">{editSlide._new ? 'Add Slide' : 'Edit Slide'}</h3>
              <button onClick={() => setEditSlide(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Background Image URL</label>
                <input className="form-input" value={editSlide.image} onChange={e => setEditSlide(s => ({ ...s, image: e.target.value }))} placeholder="/assets/images/exec.jpg" />
                {editSlide.image && <img src={editSlide.image} alt="Preview" className="mt-2 w-full h-24 object-cover rounded-xl" onError={e => { e.target.style.display = 'none' }} />}
              </div>
              <div>
                <label className="form-label">Title</label>
                <input className="form-input" value={editSlide.title} onChange={e => setEditSlide(s => ({ ...s, title: e.target.value }))} placeholder="Slide title..." />
              </div>
              <div>
                <label className="form-label">Subtitle</label>
                <textarea className="form-textarea" rows={2} value={editSlide.subtitle} onChange={e => setEditSlide(s => ({ ...s, subtitle: e.target.value }))} placeholder="Slide subtitle..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Button 1 Text</label>
                  <input className="form-input" value={editSlide.cta1} onChange={e => setEditSlide(s => ({ ...s, cta1: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Button 1 Link</label>
                  <input className="form-input" value={editSlide.cta1Link} onChange={e => setEditSlide(s => ({ ...s, cta1Link: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Button 2 Text</label>
                  <input className="form-input" value={editSlide.cta2} onChange={e => setEditSlide(s => ({ ...s, cta2: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Button 2 Link</label>
                  <input className="form-input" value={editSlide.cta2Link} onChange={e => setEditSlide(s => ({ ...s, cta2Link: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => {
                if (editSlide._new) setHeroSlides(prev => [...prev, { ...editSlide, _new: undefined, _index: undefined }])
                else setHeroSlides(prev => prev.map((s, i) => i === editSlide._index ? { ...editSlide, _new: undefined, _index: undefined } : s))
                setEditSlide(null)
                toast.success(editSlide._new ? 'Slide added' : 'Slide updated')
              }} className="btn-primary flex-1 justify-center">
                <Check size={14} />{editSlide._new ? 'Add Slide' : 'Save Changes'}
              </button>
              <button onClick={() => setEditSlide(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}