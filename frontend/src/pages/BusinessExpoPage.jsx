import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { expoAPI, getToken } from '../lib/api'
import toast from 'react-hot-toast'

// ─── Default photo pools (overridden by expo_settings from API) ───────────────
const DEFAULT_PHOTOS = {
  hero_bg:   '/assets/images/expo/IMG_0630.jpg',
  speaker_1: '/assets/images/expo/IMG_0917.jpg',
  speaker_2: '/assets/images/expo/IMG_0916.jpg',
  speaker_3: '/assets/images/expo/IMG_0910.jpg',
  speaker_4: '/assets/images/expo/IMG_0912.jpg',
  speaker_5: '/assets/images/expo/IMG_0909.jpg',
  speaker_6: '/assets/images/expo/IMG_0918.jpg',
  about_1:   '/assets/images/expo/IMG_0917.jpg',
  about_2:   '/assets/images/expo/IMG_0910.jpg',
  about_3:   '/assets/images/expo/IMG_0777.jpg',
  about_4:   '/assets/images/expo/IMG_0834.jpg',
  poster:    '/assets/images/expo/busexpoposter.jpeg',
}

const EDITION1_PHOTOS = [
  { src: '/assets/images/expo/IMG_0578.jpg', alt: '1st Edition — Opening session' },
  { src: '/assets/images/expo/IMG_0579.jpg', alt: '1st Edition — Attendees' },
  { src: '/assets/images/expo/IMG_0703.jpg', alt: '1st Edition — Student entrepreneurs' },
]

const EDITION2_PHOTOS = [
  { src: '/assets/images/expo/IMG_0616.jpg', alt: 'Expo 2026 — Audience' },
  { src: '/assets/images/expo/IMG_0628.jpg', alt: 'Expo 2026 — Speaker session' },
  { src: '/assets/images/expo/IMG_0777.jpg', alt: 'Expo 2026 — Panel discussion' },
  { src: '/assets/images/expo/IMG_0834.jpg', alt: 'Expo 2026 — Networking' },
  { src: '/assets/images/expo/IMG_0715.jpg', alt: 'Expo 2026 — Pitch showcase' },
  { src: '/assets/images/expo/IMG_0751.jpg', alt: 'Expo 2026 — Attendees' },
  { src: '/assets/images/expo/IMG_0760.jpg', alt: 'Expo 2026 — Entrepreneurs' },
  { src: '/assets/images/expo/IMG_0761.jpg', alt: 'Expo 2026 — Presentations' },
  { src: '/assets/images/expo/IMG_0764.jpg', alt: 'Expo 2026 — Workshop' },
  { src: '/assets/images/expo/IMG_0802.jpg', alt: 'Expo 2026 — Engagement' },
  { src: '/assets/images/expo/IMG_0818.jpg', alt: 'Expo 2026 — Speakers' },
  { src: '/assets/images/expo/IMG_0922.jpg', alt: 'Expo 2026 — Networking' },
  { src: '/assets/images/expo/IMG_0924.jpg', alt: 'Expo 2026 — Celebration' },
  { src: '/assets/images/expo/IMG_0925.jpg', alt: 'Expo 2026 — Closing' },
  { src: '/assets/images/expo/IMG_0783 (1).jpg', alt: 'Expo 2026 — Founders' },
]

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])
  return timeLeft
}

// ─── SEO ──────────────────────────────────────────────────────────────────────
function ExpoSEO() {
  useEffect(() => {
    document.title = 'MUTCU Business Exposition 2027 — Beyond Ideas: Blueprint of a CEO'
    const setMeta = (name, content, prop = false) => {
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    const desc = "Join the 3rd MUTCU Business Exposition on 13 March 2027 at Murang'a University of Technology. Keynotes, workshops, Founder's Arena pitch competition with KSh 100,000 prize pool. Register free."
    const img = 'https://mutcu.org/assets/images/expo/busexpoposter.jpeg'
    const url = 'https://mutcu.org/business-expo'
    setMeta('description', desc)
    setMeta('keywords', "MUTCU Business Exposition, MUTCU Business Expo 2027, MUT entrepreneurship, student pitch competition Kenya, Founder's Arena, Beyond Ideas Blueprint CEO, Murang'a University business event, student startup Kenya, MUTCU 2027, Christian entrepreneurship Kenya")
    setMeta('author', "Murang'a University of Technology Christian Union")
    setMeta('robots', 'index, follow')
    setMeta('og:title', 'MUTCU Business Exposition 2027 — Beyond Ideas: Blueprint of a CEO', true)
    setMeta('og:description', desc, true)
    setMeta('og:image', img, true)
    setMeta('og:image:width', '1200', true)
    setMeta('og:image:height', '630', true)
    setMeta('og:image:alt', 'MUTCU Business Exposition 2027 official poster', true)
    setMeta('og:url', url, true)
    setMeta('og:type', 'website', true)
    setMeta('og:site_name', 'MUTCU', true)
    setMeta('og:locale', 'en_KE', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', 'MUTCU Business Exposition 2027 — Beyond Ideas: Blueprint of a CEO')
    setMeta('twitter:description', desc)
    setMeta('twitter:image', img)
    setMeta('twitter:site', '@muranga_university_cu')
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', url)
    const removeOld = document.querySelector('script[data-seo="expo"]')
    if (removeOld) removeOld.remove()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', 'expo')
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Event',
      name: 'MUTCU Business Exposition 2027 — Beyond Ideas: Blueprint of a CEO',
      description: desc,
      startDate: '2027-03-13T08:00:00+03:00', endDate: '2027-03-13T16:00:00+03:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: "Murang'a University of Technology", address: { '@type': 'PostalAddress', addressLocality: "Murang'a", addressCountry: 'KE' } },
      image: [img],
      organizer: { '@type': 'Organization', name: "Murang'a University of Technology Christian Union (MUTCU)", url: 'https://mutcu.org', email: 'mutcunion@gmail.com', telephone: '+254757930723' },
      offers: { '@type': 'Offer', name: 'Free Attendance', price: '0', priceCurrency: 'KES', availability: 'https://schema.org/InStock', url: 'https://mutcu.org/business-expo#register', validFrom: '2026-10-01' },
      isAccessibleForFree: true, maximumAttendeeCapacity: 300,
    })
    document.head.appendChild(script)
    return () => { const s = document.querySelector('script[data-seo="expo"]'); if (s) s.remove() }
  }, [])
  return null
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function SectionBadge({ text, icon }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4"
      style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.25)' }}>
      {icon && <i className={`fas ${icon}`} />}{text}
    </div>
  )
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-montserrat font-black text-white"
        style={{ background: 'rgba(255,151,0,0.15)', border: '1px solid rgba(255,151,0,0.4)' }}>
        {String(value ?? 0).padStart(2, '0')}
      </div>
      <span className="text-white/50 text-xs font-montserrat font-bold uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  )
}

// ─── Photo grid with lightbox ─────────────────────────────────────────────────
function PhotoGrid({ photos, initialVisible = 12 }) {
  const [lightbox, setLightbox] = useState(null)
  const [visible, setVisible] = useState(initialVisible)
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {photos.slice(0, visible).map((p, i) => (
          <button key={i} onClick={() => setLightbox(i)}
            className="relative overflow-hidden rounded-xl group focus:outline-none focus:ring-2 focus:ring-orange"
            style={{ aspectRatio: '1/1' }}>
            <img src={p.src} alt={p.alt || p.caption || 'Expo photo'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy" onError={e => { e.target.parentElement.style.display = 'none' }} />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all duration-300 flex items-end justify-start p-2">
              {p.caption && <span className="text-white text-xs font-montserrat font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-navy/60 px-2 py-1 rounded-lg">{p.caption}</span>}
              <i className="fas fa-expand text-white text-sm absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>
      {visible < photos.length && (
        <div className="text-center mt-6">
          <button onClick={() => setVisible(photos.length)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-montserrat font-bold text-navy text-sm border-2 border-navy hover:bg-navy hover:text-white transition-all duration-200">
            View All {photos.length} Photos <i className="fas fa-images" />
          </button>
        </div>
      )}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[200] bg-black/96 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-all" onClick={() => setLightbox(null)}><i className="fas fa-times" /></button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-all" onClick={e => { e.stopPropagation(); setLightbox(prev => (prev - 1 + photos.length) % photos.length) }}><i className="fas fa-chevron-left" /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={photos[lightbox].src} alt={photos[lightbox].alt || 'Expo photo'} className="w-full max-h-[80vh] object-contain rounded-xl" loading="lazy" />
            {photos[lightbox].caption && <p className="text-white/60 text-sm text-center mt-3 font-montserrat">{photos[lightbox].caption}</p>}
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10 transition-all" onClick={e => { e.stopPropagation(); setLightbox(prev => (prev + 1) % photos.length) }}><i className="fas fa-chevron-right" /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-montserrat">{lightbox + 1} / {photos.length}</div>
        </div>
      )}
    </>
  )
}

// ─── Registration Form ────────────────────────────────────────────────────────
function RegistrationForm() {
  const [type, setType] = useState('attendee')
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', course: '', year_of_study: '',
    business_name: '', business_stage: '', business_description: '',
    support_needed: [], how_heard: '', message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [emailNote, setEmailNote] = useState(null)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: '' })) }

  const toggleSupport = (val) => {
    setForm(f => ({
      ...f,
      support_needed: f.support_needed.includes(val)
        ? f.support_needed.filter(v => v !== val)
        : [...f.support_needed, val],
    }))
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.trim().length < 7) e.phone = 'Valid phone number required'
    if (type === 'pitcher' && !form.business_name.trim()) e.business_name = 'Business name is required'
    if (type === 'pitcher' && !form.business_description.trim()) e.business_description = 'Please tell us about your business idea'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const res = await expoAPI.register({ ...form, participation_type: type })
      setSubmitted({ type, name: form.full_name.trim() })
      if (res.emailNote) setEmailNote(res.emailNote)
    } catch (err) {
      if (err.response?.status === 409) toast.error(err.message || 'You are already registered. Check your email.')
      else toast.error(err.message || 'Submission failed. Please try again.')
    } finally { setSubmitting(false) }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-lato transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-orange'}`
  const labelClass = 'block text-xs font-montserrat font-bold text-navy uppercase tracking-wider mb-1.5'

  if (submitted) {
    return (
      <div className="text-center py-10 px-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid #16A34A' }}>
          <i className="fas fa-check-circle text-green-600 text-4xl" />
        </div>
        <h3 className="font-montserrat font-black text-navy text-2xl mb-2">
          {submitted.type === 'pitcher' ? "You're In, Founder!" : "You're Registered!"}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
          {submitted.type === 'pitcher'
            ? `Welcome to Founder's Arena, ${submitted.name}! Your application has been received. Check your email for confirmation and next steps.`
            : `See you on 13 March 2027, ${submitted.name}! A confirmation has been sent to your email.`}
        </p>
        {emailNote && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-montserrat max-w-sm mx-auto">
            <i className="fas fa-exclamation-triangle mr-1" /> {emailNote}
          </div>
        )}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-montserrat font-semibold text-white mb-6"
          style={{ background: '#FF9700' }}>
          <i className="fas fa-calendar-alt" /> Saturday, 13 March 2027 · 8:00 AM
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => { setSubmitted(null); setEmailNote(null); setForm({ full_name:'',email:'',phone:'',course:'',year_of_study:'',business_name:'',business_stage:'',business_description:'',support_needed:[],how_heard:'',message:'' }); setType('attendee') }}
            className="text-sm font-montserrat font-semibold text-orange hover:underline">Register another person</button>
          <span className="text-gray-300">·</span>
          <a href="https://www.instagram.com/muranga_university_cu/" target="_blank" rel="noopener noreferrer"
            className="text-sm font-montserrat font-semibold text-navy hover:text-orange transition-colors">Follow us for updates</a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { val: 'attendee', icon: 'fa-users', label: 'Attend the Expo', sub: 'Free entry' },
          { val: 'pitcher', icon: 'fa-microphone', label: 'Pitch My Business', sub: "Founder's Arena" },
        ].map(opt => (
          <button key={opt.val} type="button" onClick={() => setType(opt.val)}
            className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 ${type === opt.val ? 'border-orange bg-orange/5' : 'border-gray-200 hover:border-orange/40'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${type === opt.val ? 'bg-orange' : 'bg-gray-100'}`}>
              <i className={`fas ${opt.icon} text-sm ${type === opt.val ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <span className={`font-montserrat font-bold text-sm ${type === opt.val ? 'text-navy' : 'text-gray-500'}`}>{opt.label}</span>
            <span className={`text-xs font-montserrat ${type === opt.val ? 'text-orange' : 'text-gray-400'}`}>{opt.sub}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input type="text" value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" className={inputClass('full_name')} />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email Address *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" className={inputClass('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone Number *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+254 7XX XXX XXX" className={inputClass('phone')} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Course / Programme</label>
            <input type="text" value={form.course} onChange={e => set('course', e.target.value)} placeholder="e.g. BSc Computer Science" className={inputClass('course')} />
          </div>
          <div>
            <label className={labelClass}>Year of Study</label>
            <select value={form.year_of_study} onChange={e => set('year_of_study', e.target.value)} className={inputClass('year_of_study')}>
              <option value="">Select year</option>
              {['1st Year','2nd Year','3rd Year','4th Year','5th Year','Postgraduate','Alumni','Other'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pitcher fields */}
      {type === 'pitcher' && (
        <div className="space-y-4 mb-4 p-4 rounded-2xl" style={{ background: 'rgba(255,151,0,0.05)', border: '1px solid rgba(255,151,0,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <i className="fas fa-fire text-orange text-sm" />
            <span className="font-montserrat font-bold text-navy text-sm">Founder's Arena Details</span>
          </div>
          <div>
            <label className={labelClass}>Business / Idea Name *</label>
            <input type="text" value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="What is your business called?" className={inputClass('business_name')} />
            {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>}
          </div>
          <div>
            <label className={labelClass}>Business Stage</label>
            <select value={form.business_stage} onChange={e => set('business_stage', e.target.value)} className={inputClass('business_stage')}>
              <option value="">Select stage</option>
              <option value="Just an idea">Just an idea — not started yet</option>
              <option value="Early stage">Early stage — testing / MVP</option>
              <option value="Growing">Growing — have customers / revenue</option>
              <option value="Established">Established — running for 1+ year</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Tell Us About Your Business Idea *</label>
            <textarea value={form.business_description} onChange={e => set('business_description', e.target.value)}
              placeholder="What problem does your business solve? Who does it serve? What makes it unique? What have you done so far?"
              rows={4} className={`${inputClass('business_description')} resize-none`} />
            {errors.business_description && <p className="text-red-500 text-xs mt-1">{errors.business_description}</p>}
          </div>
          <div>
            <label className={labelClass}>What Support Would Help You Most?</label>
            <p className="text-gray-400 text-xs mb-2 font-lato">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {['Mentorship','Funding connections','Marketing advice','Technical support','Legal guidance','Networking','Pitching skills','Other'].map(opt => (
                <button key={opt} type="button" onClick={() => toggleSupport(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-semibold border transition-all ${form.support_needed.includes(opt) ? 'bg-orange text-white border-orange' : 'bg-white text-gray-600 border-gray-200 hover:border-orange/40'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className={labelClass}>How did you hear about the Expo?</label>
          <select value={form.how_heard} onChange={e => set('how_heard', e.target.value)} className={inputClass('how_heard')}>
            <option value="">Select one</option>
            {['MUTCU Sunday Service','Instagram','WhatsApp','Facebook','TikTok','Friend / Classmate','Poster / Flyer','MUTCU Website','Other'].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Anything else you'd like us to know?</label>
          <textarea value={form.message} onChange={e => set('message', e.target.value)}
            placeholder="Questions, dietary needs, accessibility requirements, or anything else..."
            rows={3} className={`${inputClass('message')} resize-none`} />
        </div>
      </div>

      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: submitting ? '#ccc' : '#FF9700', boxShadow: submitting ? 'none' : '0 4px 20px rgba(255,151,0,0.35)' }}>
        {submitting ? (
          <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Submitting...</>
        ) : type === 'pitcher' ? (
          <><i className="fas fa-fire" /> Apply to Founder's Arena</>
        ) : (
          <><i className="fas fa-check" /> Secure My Spot — It's Free</>
        )}
      </button>
      <p className="text-center text-gray-400 text-xs mt-3 font-lato">A confirmation email will be sent to you. No spam, ever.</p>
    </form>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BusinessExpoPage() {
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS)
  const [activeStage, setActiveStage] = useState(0)
  const [activeSpeakerPhoto, setActiveSpeakerPhoto] = useState(0)

  // Fetch admin-editable settings
  useEffect(() => {
    expoAPI.getSettings().then(data => {
      if (data?.settings) {
        setPhotos(prev => ({
          hero_bg:   data.settings.expo_hero_bg   || prev.hero_bg,
          speaker_1: data.settings.expo_speaker_1 || prev.speaker_1,
          speaker_2: data.settings.expo_speaker_2 || prev.speaker_2,
          speaker_3: data.settings.expo_speaker_3 || prev.speaker_3,
          speaker_4: data.settings.expo_speaker_4 || prev.speaker_4,
          speaker_5: data.settings.expo_speaker_5 || prev.speaker_5,
          speaker_6: data.settings.expo_speaker_6 || prev.speaker_6,
          about_1:   data.settings.expo_about_1   || prev.about_1,
          about_2:   data.settings.expo_about_2   || prev.about_2,
          about_3:   data.settings.expo_about_3   || prev.about_3,
          about_4:   data.settings.expo_about_4   || prev.about_4,
          poster:    data.settings.expo_poster     || prev.poster,
        }))
      }
    }).catch(() => {})
  }, [])

  const SPEAKER_PHOTOS = [
    { src: photos.speaker_1, caption: 'Keynote Session' },
    { src: photos.speaker_2, caption: 'Panel Discussion' },
    { src: photos.speaker_3, caption: 'Speaker Address' },
    { src: photos.speaker_4, caption: 'Business Panel' },
    { src: photos.speaker_5, caption: 'Founder Insights' },
    { src: photos.speaker_6, caption: 'Entrepreneur Talk' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActiveSpeakerPhoto(p => (p + 1) % SPEAKER_PHOTOS.length), 3500)
    return () => clearInterval(t)
  }, [SPEAKER_PHOTOS.length])

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  const deadlineCountdown = useCountdown('2026-11-30T23:59:59')
  const expoCountdown = useCountdown('2027-03-13T08:00:00')

  const STAGES = [
    { num: '01', label: 'The Call', shortLabel: 'The Call', icon: 'fa-bullhorn', tagline: 'Every journey starts with an idea.', desc: 'Have a business idea or an existing venture? Step forward, fill the application form, identify the problem you want to solve, share your vision, and begin your journey towards the pitch stage. This is your opportunity to put your entrepreneurial ambitions into motion.' },
    { num: '02', label: 'The Den', shortLabel: 'The Den', icon: 'fa-fire', tagline: 'Challenge your thinking. Refine your idea.', desc: 'A good idea must stand up to questions. The Den is where participants are challenged to think critically about their business ideas, test their assumptions, and identify gaps. Through questions, feedback, and constructive critique, you will strengthen your idea and develop a clearer understanding of your business.' },
    { num: '03', label: 'Blueprint Training', shortLabel: 'Training', icon: 'fa-graduation-cap', tagline: 'Prepare to build and lead.', desc: 'Selected Top 10 participants advance to focused training designed to strengthen their business models and sharpen their entrepreneurial skills. The training helps participants develop their understanding of their markets, communicate their value, and prepare to present their ventures effectively.' },
    { num: '04', label: 'Pitch Showcase', shortLabel: 'Pitch', icon: 'fa-trophy', tagline: 'Present your vision. Make your case.', desc: 'Bring everything together and present your business idea or existing venture before a panel of judges and business leaders. Explain the problem you are solving, the value your business offers, and the potential of your idea. Compete for recognition and a share of the KSh 100,000 total prize pool.' },
  ]

  const WHAT_TO_EXPECT = [
    { icon: 'fa-microphone-alt', title: 'Keynote Sessions', desc: 'Learn about leadership, the CEO mindset, and excellence in the marketplace from experienced business leaders.' },
    { icon: 'fa-tools', title: 'Practical Workshops', desc: 'Develop business skills and gain insights you can apply directly to your own venture.' },
    { icon: 'fa-fire-alt', title: "Founder's Arena", desc: 'A structured 4-stage journey to challenge your thinking, strengthen your idea, and prepare to pitch.' },
    { icon: 'fa-comments', title: 'Panel Discussions', desc: 'Learn from experienced entrepreneurs about the challenges and opportunities of building a business.' },
    { icon: 'fa-handshake', title: 'Networking', desc: 'Connect with entrepreneurs, mentors, speakers, and fellow students who share your passion for business.' },
    { icon: 'fa-trophy', title: 'Pitch Competition', desc: 'Present your venture before judges and compete for a share of the KSh 100,000 prize pool.' },
  ]

  const EDITION2_SPEAKERS = [
    { name: 'Lionel Tinega', company: 'DigiAfrica', icon: 'fa-laptop-code', color: '#3B82F6' },
    { name: 'Lennox Omondi', company: 'EcoBana', icon: 'fa-leaf', color: '#16A34A' },
    { name: 'Elizabeth Nungari', company: 'Bagged & Beyond', icon: 'fa-shopping-bag', color: '#EC4899' },
    { name: 'Dennis Waweru', company: 'GYEF', icon: 'fa-rocket', color: '#FF9700' },
    { name: 'Marion', company: 'Tichi Investment Limited', icon: 'fa-chart-pie', color: '#8B5CF6' },
  ]

  const EDITION1_SPEAKERS = [
    { name: 'Daphne Mukami', topic: 'Networking in Business', icon: 'fa-network-wired' },
    { name: 'Steve Mbogo & Panel', topic: 'Kingdom Entrepreneurship', icon: 'fa-crown' },
    { name: 'AMICA', topic: 'Capital Acquisition', icon: 'fa-coins' },
  ]

  return (
    <>
      <ExpoSEO />
      <div className="overflow-x-hidden">

        {/* ═══ 1. HERO ═══════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ marginTop: '-80px' }}>
          <div className="absolute inset-0">
            <img src={photos.hero_bg} alt="MUTCU Business Exposition 2027"
              className="w-full h-full object-cover object-center"
              onError={e => { e.target.style.background = '#04003D' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(4,0,61,0.86) 0%, rgba(4,0,61,0.62) 55%, rgba(4,0,61,0.80) 100%)' }} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ border: '1px solid rgba(255,151,0,0.07)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ border: '1px solid rgba(255,151,0,0.04)' }} />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-28 pb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-5"
              style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.3)' }}>
              <i className="fas fa-star" /> 3rd Edition · 13 March 2027
            </div>
            <p className="text-white/60 text-xs sm:text-sm font-montserrat font-semibold uppercase tracking-[0.25em] mb-4">
              Murang'a University of Technology Christian Union
            </p>
            <h1 className="font-montserrat font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.2rem, 6.5vw, 5rem)' }}>
              MUTCU BUSINESS <span style={{ color: '#FF9700' }}>EXPOSITION</span>
            </h1>
            <div className="flex items-center justify-center gap-4 my-5">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(255,151,0,0.35)' }} />
              <p className="text-white/90 font-montserrat font-bold text-base sm:text-xl tracking-wide">BEYOND IDEAS: BLUEPRINT OF A CEO</p>
              <div className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(255,151,0,0.35)' }} />
            </div>

            {/* ── Improved hero caption ── */}
            <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8 font-lato">
              You have the idea but you may now need to get the blueprint. This day offers you that opporutnity as we get to see what the path of a CEO looks like.<br className="hidden sm:block" />
              <span className="text-white/60">This is where student kingdom entrepreneurers are made.</span>
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-8 text-xs sm:text-sm">
              {[{ icon: 'fa-calendar-alt', text: 'Saturday, 13 March 2027' }, { icon: 'fa-clock', text: '8:00 AM – 4:00 PM' }, { icon: 'fa-map-marker-alt', text: "Murang'a University of Technology" }].map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-white/75 font-montserrat font-semibold">
                  <i className={`fas ${d.icon} text-orange`} />{d.text}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <button onClick={() => scrollTo('register')} className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1" style={{ background: '#FF9700', boxShadow: '0 4px 20px rgba(255,151,0,0.4)' }}>
                Secure Your Spot <i className="fas fa-arrow-right" />
              </button>
              <button onClick={() => scrollTo('founders-arena')} className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1" style={{ border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.07)' }}>
                Apply to Pitch <i className="fas fa-microphone" />
              </button>
              <button onClick={() => scrollTo('about')} className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-montserrat font-bold text-white/70 text-sm transition-all hover:text-white hover:-translate-y-1" style={{ border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' }}>
                Learn More <i className="fas fa-chevron-down" />
              </button>
            </div>

            {/* ── Dual Countdown ── */}
            <div className="space-y-5">
              {/* Applications deadline */}
              {!deadlineCountdown.expired ? (
                <div className="rounded-2xl p-4" style={{ background: 'rgba(255,151,0,0.1)', border: '1px solid rgba(255,151,0,0.25)' }}>
                  <p className="text-orange text-xs font-montserrat font-black uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                    <i className="fas fa-fire animate-pulse" /> Founder's Arena Applications Close In
                  </p>
                  <div className="flex justify-center gap-3">
                    <CountdownUnit value={deadlineCountdown.days} label="Days" />
                    <CountdownUnit value={deadlineCountdown.hours} label="Hours" />
                    <CountdownUnit value={deadlineCountdown.minutes} label="Mins" />
                    <CountdownUnit value={deadlineCountdown.seconds} label="Secs" />
                  </div>
                  <p className="text-white/40 text-xs font-montserrat mt-2">Deadline: 30 November 2026</p>
                </div>
              ) : (
                <div className="rounded-2xl p-3" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}>
                  <p className="text-red-400 text-xs font-montserrat font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <i className="fas fa-lock" /> Founder's Arena Applications Closed
                  </p>
                </div>
              )}
              {/* Expo day countdown */}
              <div>
                <p className="text-white/35 text-xs font-montserrat font-bold uppercase tracking-widest mb-3">
                  <i className="fas fa-calendar-alt mr-1" /> Expo Day Countdown
                </p>
                <div className="flex justify-center gap-3">
                  <CountdownUnit value={expoCountdown.days} label="Days" />
                  <CountdownUnit value={expoCountdown.hours} label="Hours" />
                  <CountdownUnit value={expoCountdown.minutes} label="Mins" />
                  <CountdownUnit value={expoCountdown.seconds} label="Secs" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/25 text-xs font-montserrat">
            <span>Scroll</span><i className="fas fa-chevron-down animate-bounce" />
          </div>
        </section>

        {/* ═══ 2. STATS BAR ══════════════════════════════════════════════════ */}
        <section style={{ background: '#FF9700' }}>
          <div className="max-w-5xl mx-auto px-4 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { value: '3', label: 'Editions', icon: 'fa-star' },
                { value: '1,000+', label: 'Lives Impacted', icon: 'fa-users' },
                { value: '15+', label: 'Founders Recognized', icon: 'fa-fire' },
                { value: 'KSh 100K', label: 'Prize Pool 2027', icon: 'fa-trophy' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <i className={`fas ${s.icon} text-white/70 text-sm mb-1`} />
                  <div className="font-montserrat font-black text-white text-xl sm:text-2xl">{s.value}</div>
                  <div className="text-white/80 text-xs font-montserrat font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 3. EXPO 2027 ══════════════════════════════════════════════════ */}
        <section id="expo2027" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Poster + details side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start mb-16">
              {/* Poster */}
              <div className="lg:col-span-2 flex justify-center">
                <div className="rounded-3xl overflow-hidden shadow-2xl max-w-xs w-full" style={{ border: '2px solid rgba(255,151,0,0.3)' }}>
                  <img src={photos.poster} alt="MUTCU Business Exposition 2027 Official Poster"
                    className="w-full object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              </div>
              {/* Details */}
              <div className="lg:col-span-3">
                <SectionBadge text="Business Expo 2027" icon="fa-rocket" />
                <h2 className="font-montserrat font-black text-navy text-3xl sm:text-4xl mb-4">Beyond Ideas: Blueprint of a CEO</h2>
                <div className="h-1 w-12 rounded-full mb-5" style={{ background: '#FF9700' }} />
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  The 3rd MUTCU Business Exposition is designed to help students move from having ideas to building businesses. We will explore what it takes to think like a leader, develop practical business skills, make sound decisions, and create meaningful impact.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: 'fa-calendar-alt', label: 'Date', value: 'Saturday, 13 March 2027' },
                    { icon: 'fa-clock', label: 'Time', value: '8:00 AM – 4:00 PM' },
                    { icon: 'fa-map-marker-alt', label: 'Venue', value: "Murang'a University of Technology" },
                    { icon: 'fa-trophy', label: 'Prize Pool', value: 'KSh 100,000' },
                    { icon: 'fa-lightbulb', label: 'Theme', value: 'Beyond Ideas: Blueprint of a CEO' },
                    { icon: 'fa-users', label: 'Organiser', value: 'MUTCU Business Exposition Committee' },
                  ].map((d, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.1)' }}>
                        <i className={`fas ${d.icon} text-orange text-sm`} />
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs font-montserrat font-bold uppercase tracking-wider">{d.label}</div>
                        <div className="text-navy font-montserrat font-semibold text-sm mt-0.5">{d.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => scrollTo('register')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5" style={{ background: '#FF9700' }}>
                    Register Free <i className="fas fa-arrow-right" />
                  </button>
                  <button onClick={() => scrollTo('founders-arena')} className="flex items-center gap-2 px-6 py-3 rounded-xl font-montserrat font-bold text-navy text-sm border-2 border-navy hover:bg-navy hover:text-white transition-all">
                    Apply to Pitch <i className="fas fa-fire" />
                  </button>
                </div>
              </div>
            </div>

            {/* What to expect */}
            <div className="text-center mb-8">
              <h3 className="font-montserrat font-black text-navy text-2xl mb-2">What to Expect</h3>
              <p className="text-gray-500 text-sm">A full day packed with sessions designed to equip, inspire, and connect.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHAT_TO_EXPECT.map((item, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-100 hover:border-orange/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(255,151,0,0.1)' }}>
                    <i className={`fas ${item.icon} text-orange text-lg`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-navy text-sm mb-1.5">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 4. FOUNDER'S ARENA ════════════════════════════════════════════ */}
        <section id="founders-arena" className="py-20 sm:py-24" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge text="Founder's Arena" icon="fa-fire-alt" />
              <h2 className="font-montserrat font-black text-white text-3xl sm:text-4xl mb-4">From Idea to the Pitch Stage</h2>
              <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
                Every business starts with an idea. But turning that idea into a business takes more than inspiration. Founder's Arena is the structured journey every student who wishes to pitch must go through.
              </p>
            </div>
            <div className="max-w-3xl mx-auto mb-10">
              <div className="flex items-center mb-6">
                {STAGES.map((s, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <button onClick={() => setActiveStage(i)}
                      className="w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black text-sm transition-all duration-300 flex-shrink-0"
                      style={{ background: i <= activeStage ? '#FF9700' : 'rgba(255,255,255,0.1)', border: i === activeStage ? '3px solid rgba(255,255,255,0.4)' : 'none', color: i <= activeStage ? 'white' : 'rgba(255,255,255,0.4)', transform: i === activeStage ? 'scale(1.1)' : 'scale(1)' }}>
                      {i < activeStage ? <i className="fas fa-check text-xs" /> : s.num}
                    </button>
                    {i < STAGES.length - 1 && <div className="flex-1 h-0.5 mx-1 transition-all duration-500" style={{ background: i < activeStage ? '#FF9700' : 'rgba(255,255,255,0.1)' }} />}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 mb-8">
                {STAGES.map((s, i) => (
                  <button key={i} onClick={() => setActiveStage(i)} className={`text-center text-xs font-montserrat font-bold transition-colors duration-200 ${i === activeStage ? 'text-orange' : 'text-white/40 hover:text-white/70'}`}>{s.shortLabel}</button>
                ))}
              </div>
              <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,151,0,0.2)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.15)', border: '1px solid rgba(255,151,0,0.3)' }}>
                    <i className={`fas ${STAGES[activeStage].icon} text-orange text-2xl`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange font-montserrat font-black text-xs">Stage {STAGES[activeStage].num}</span>
                    <h3 className="font-montserrat font-black text-white text-xl sm:text-2xl mb-1">{STAGES[activeStage].label}</h3>
                    <p className="text-orange font-montserrat font-semibold text-sm mb-3 italic">{STAGES[activeStage].tagline}</p>
                    <p className="text-white/65 text-sm leading-relaxed">{STAGES[activeStage].desc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-3xl mx-auto mb-10">
              <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left" style={{ background: 'rgba(255,151,0,0.1)', border: '1px solid rgba(255,151,0,0.25)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#FF9700' }}>
                  <i className="fas fa-trophy text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="font-montserrat font-black text-white text-xl">KSh 100,000 Prize Pool</div>
                  <div className="text-white/60 text-sm">Compete, pitch your idea, and win a share of the biggest prize pool in MUTCU Expo history.</div>
                </div>
                <button onClick={() => scrollTo('register')} className="px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm whitespace-nowrap transition-all hover:-translate-y-0.5" style={{ background: '#FF9700' }}>Apply to Pitch →</button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm font-montserrat mb-1">You don't have to have everything figured out to begin.</p>
              <p className="text-white font-montserrat font-bold text-lg mb-5">Your Idea. Your Journey. Your Next Step.</p>
              <button onClick={() => { setActiveStage(0); scrollTo('register') }} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1" style={{ background: '#FF9700', boxShadow: '0 4px 24px rgba(255,151,0,0.3)' }}>
                Apply to Founder's Arena <i className="fas fa-fire" />
              </button>
            </div>
          </div>
        </section>

        {/* ═══ 5. OUR JOURNEY ════════════════════════════════════════════════ */}
        <section id="journey" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBadge text="Our Journey" icon="fa-road" />
              <h2 className="font-montserrat font-black text-navy text-3xl sm:text-4xl mb-4">Three Editions. One Growing Story.</h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">From a bold first step to a growing annual event — each edition builds on the last.</p>
            </div>
            <div className="space-y-10">
              {/* Edition 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-2">
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50">
                      {EDITION1_PHOTOS.map((p, i) => <img key={i} src={p.src} alt={p.alt} className="w-full h-28 sm:h-32 object-cover rounded-lg" loading="lazy" onError={e => { e.target.style.display = 'none' }} />)}
                    </div>
                    <div className="px-4 py-3 bg-navy">
                      <p className="text-white/60 text-xs font-montserrat font-semibold">Theme: <span className="text-orange">"Networking and Businesses"</span></p>
                      <p className="text-white/40 text-xs font-montserrat mt-0.5">9 March 2025 · Ecop Hall, MUT</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-3" style={{ background: 'rgba(255,151,0,0.1)', border: '1px solid rgba(255,151,0,0.2)' }}>1st Edition · 9 March 2025</div>
                  <h3 className="font-montserrat font-black text-navy text-2xl mb-3">Laying the Foundation</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">The inaugural Business Exposition established a platform for bringing faith and entrepreneurship together at MUT. Held at Ecop Hall, it introduced students to foundational business topics — networking, funding, and the basics of entrepreneurship — challenging the traditional mindset that the church's role is limited to spiritual activities.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[{ icon: 'fa-users', label: 'High Turnout' }, { icon: 'fa-microphone', label: '3 Speakers' }, { icon: 'fa-store', label: 'Student Booths' }, { icon: 'fa-briefcase', label: 'Job Secured' }].map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-montserrat font-semibold text-gray-600 bg-gray-50 border border-gray-100">
                        <i className={`fas ${s.icon} text-orange text-xs`} />{s.label}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs font-montserrat font-bold uppercase tracking-wider mb-2">Featured Speakers</p>
                  <div className="flex flex-wrap gap-2">
                    {EDITION1_SPEAKERS.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                        <i className={`fas ${s.icon} text-orange text-xs`} />
                        <div><div className="text-navy text-xs font-montserrat font-bold">{s.name}</div><div className="text-gray-400 text-xs">{s.topic}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4"><div className="flex-1 h-px bg-gray-100" /><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-montserrat font-black flex-shrink-0" style={{ background: '#FF9700' }}>↓</div><div className="flex-1 h-px bg-gray-100" /></div>
              {/* Edition 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                <div className="lg:col-span-3 lg:order-1 order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-3" style={{ background: 'rgba(255,151,0,0.1)', border: '1px solid rgba(255,151,0,0.2)' }}>2nd Edition · 14 March 2026</div>
                  <h3 className="font-montserrat font-black text-navy text-2xl mb-3">Scaling the Vision</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">The 2nd Business Exposition was held at the Assembly Hall of MUT. The event welcomed 120 attendees and featured five business leaders. It included a student pitch showcase and was livestreamed — creating opportunities for students to present their ideas, learn from experienced entrepreneurs, and build valuable connections.</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[{ icon: 'fa-users', value: '120+', label: 'Attendees' }, { icon: 'fa-microphone', value: '5', label: 'Speakers' }, { icon: 'fa-video', value: 'Live', label: 'Streamed' }].map((s, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <i className={`fas ${s.icon} text-orange text-base`} />
                        <div className="font-montserrat font-black text-navy text-lg">{s.value}</div>
                        <div className="text-gray-400 text-xs font-montserrat font-semibold uppercase tracking-wide">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs font-montserrat font-bold uppercase tracking-wider mb-2">Featured Speakers</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EDITION2_SPEAKERS.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18` }}>
                          <i className={`fas ${s.icon} text-xs`} style={{ color: s.color }} />
                        </div>
                        <div><div className="text-navy text-xs font-montserrat font-bold leading-tight">{s.name}</div><div className="text-gray-400 text-xs">{s.company}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 lg:order-2 order-1">
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50">
                      {EDITION2_PHOTOS.slice(0, 6).map((p, i) => <img key={i} src={p.src} alt={p.alt} className="w-full h-28 sm:h-32 object-cover rounded-lg" loading="lazy" onError={e => { e.target.style.display = 'none' }} />)}
                    </div>
                    <div className="px-4 py-3 bg-navy"><p className="text-white/60 text-xs font-montserrat font-semibold">14 March 2026 · Assembly Hall, MUT · Livestreamed</p></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4"><div className="flex-1 h-px bg-gray-100" /><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-montserrat font-black flex-shrink-0" style={{ background: '#FF9700' }}>↓</div><div className="flex-1 h-px bg-gray-100" /></div>
              {/* Edition 3 */}
              <div className="text-center py-6">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FF9700', boxShadow: '0 0 40px rgba(255,151,0,0.35)' }}>
                    <span className="font-montserrat font-black text-white text-xl">3</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-orange text-sm font-montserrat font-bold" style={{ background: 'rgba(255,151,0,0.1)', border: '1px solid rgba(255,151,0,0.3)' }}>
                    <i className="fas fa-star animate-pulse" /> 3rd Edition · 13 March 2027 · Register Now
                  </div>
                  <p className="text-gray-500 text-sm font-montserrat max-w-xs">Each edition builds on the previous one. The journey continues — and you can be part of it.</p>
                  <button onClick={() => scrollTo('register')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5" style={{ background: '#FF9700' }}>
                    Join the 3rd Edition <i className="fas fa-arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 6. SPEAKERS SHOWCASE ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionBadge text="Speakers & Panels" icon="fa-microphone" />
              <h2 className="font-montserrat font-black text-white text-3xl sm:text-4xl mb-4">Voices That Inspire</h2>
              <p className="text-white/60 text-base max-w-xl mx-auto">Every edition brings experienced entrepreneurs and business leaders to share real insights with our students.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,151,0,0.2)', aspectRatio: '4/3' }}>
                  {SPEAKER_PHOTOS.map((p, i) => (
                    <img key={i} src={p.src} alt={p.caption} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" style={{ opacity: i === activeSpeakerPhoto ? 1 : 0 }} loading="lazy" onError={e => { e.target.style.display = 'none' }} />
                  ))}
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(4,0,61,0.9) 0%, transparent 100%)' }}>
                    <p className="text-white font-montserrat font-semibold text-sm">{SPEAKER_PHOTOS[activeSpeakerPhoto]?.caption}</p>
                    <p className="text-white/50 text-xs font-montserrat">MUTCU Business Exposition 2026</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {SPEAKER_PHOTOS.map((_, i) => (
                    <button key={i} onClick={() => setActiveSpeakerPhoto(i)} className="rounded-full transition-all duration-300" style={{ width: i === activeSpeakerPhoto ? '24px' : '8px', height: '8px', background: i === activeSpeakerPhoto ? '#FF9700' : 'rgba(255,255,255,0.2)' }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/40 text-xs font-montserrat font-bold uppercase tracking-widest mb-4">2nd Edition Speakers — 2026</p>
                <div className="space-y-3 mb-8">
                  {EDITION2_SPEAKERS.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:bg-white/5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                        <i className={`fas ${s.icon} text-lg`} style={{ color: s.color }} />
                      </div>
                      <div><div className="font-montserrat font-bold text-white text-base">{s.name}</div><div className="text-white/50 text-sm font-montserrat">{s.company}</div></div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,151,0,0.08)', border: '1px solid rgba(255,151,0,0.2)' }}>
                  <div className="flex items-center gap-2 mb-2"><i className="fas fa-star text-orange text-sm" /><span className="font-montserrat font-bold text-white text-sm">Expo 2027 Speakers</span></div>
                  <p className="text-white/60 text-xs leading-relaxed">Speaker announcements for the 3rd Edition are coming soon. Follow <strong className="text-white">@muranga_university_cu</strong> on Instagram for updates.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 7. GALLERY ════════════════════════════════════════════════════ */}
        <section id="gallery" className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <SectionBadge text="Gallery" icon="fa-images" />
              <h2 className="font-montserrat font-black text-navy text-3xl sm:text-4xl mb-3">See What Expo 2026 Looked Like</h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">120 attendees. 5 speakers. 1 unforgettable day of entrepreneurship, learning, and connection.</p>
            </div>
            <PhotoGrid photos={EDITION2_PHOTOS} initialVisible={12} />
          </div>
        </section>

        {/* ═══ 8. REGISTRATION FORM ══════════════════════════════════════════ */}
        <section id="register" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="lg:sticky lg:top-28">
                <SectionBadge text="Register Now" icon="fa-user-plus" />
                <h2 className="font-montserrat font-black text-navy text-3xl sm:text-4xl leading-tight mb-4">
                  Secure Your Spot at<br /><span style={{ color: '#FF9700' }}>Expo 2027</span>
                </h2>
                <div className="h-1 w-12 rounded-full mb-6" style={{ background: '#FF9700' }} />
                <p className="text-gray-600 text-base leading-relaxed mb-6">Whether you're coming to learn, network, or pitch your business — register now to secure your place at the 3rd MUTCU Business Exposition.</p>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: 'fa-users', title: 'Attend the Expo', desc: 'Free entry. Full day of keynotes, workshops, panels, and networking.', badge: 'Free' },
                    { icon: 'fa-fire', title: "Founder's Arena", desc: "Apply to pitch your business idea and compete for a share of KSh 100,000.", badge: 'KSh 100K Prize' },
                  ].map((opt, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-orange/30 transition-all">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.1)' }}>
                        <i className={`fas ${opt.icon} text-orange`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-montserrat font-bold text-navy text-sm">{opt.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-montserrat font-bold text-orange" style={{ background: 'rgba(255,151,0,0.1)' }}>{opt.badge}</span>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">{opt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'rgba(4,0,61,0.04)', border: '1px solid rgba(4,0,61,0.08)' }}>
                  <p className="font-montserrat font-bold text-navy text-xs uppercase tracking-wider mb-3">Event Details</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    {[{ icon: 'fa-calendar-alt', text: 'Saturday, 13 March 2027' }, { icon: 'fa-clock', text: '8:00 AM – 4:00 PM' }, { icon: 'fa-map-marker-alt', text: "Murang'a University of Technology" }, { icon: 'fa-envelope', text: 'mutcunion@gmail.com' }, { icon: 'fa-phone', text: '+254 757 930723' }].map((d, i) => (
                      <div key={i} className="flex items-center gap-2"><i className={`fas ${d.icon} text-orange w-4 text-xs`} /><span>{d.text}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
                <div className="mb-6">
                  <h3 className="font-montserrat font-black text-navy text-xl mb-1">Register for Expo 2027</h3>
                  <p className="text-gray-500 text-sm">Fill in your details below. Takes less than 2 minutes.</p>
                </div>
                <RegistrationForm />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 9. PARTNERS ═══════════════════════════════════════════════════ */}
        <section id="partners" className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionBadge text="Partners & Sponsors" icon="fa-handshake" />
              <h2 className="font-montserrat font-black text-navy text-3xl sm:text-4xl mb-4">Help Us Equip the Next Generation</h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">We welcome partnerships with organisations and individuals who share our commitment to equipping the next generation of business leaders.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="p-5 rounded-2xl border border-gray-100 mb-6">
                  <p className="text-gray-400 text-xs font-montserrat font-bold uppercase tracking-wider mb-3">Past Partner</p>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.1)' }}><i className="fas fa-building text-orange text-xl" /></div>
                    <div><div className="font-montserrat font-bold text-navy text-base">AMICA</div><div className="text-gray-500 text-xs">Capital Acquisition Partner — 1st Edition 2025</div></div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-xs font-montserrat font-bold uppercase tracking-wider mb-4">Ways to Support</p>
                  <div className="space-y-3">
                    {[{ icon: 'fa-coins', title: 'Financial Sponsorship', desc: 'Fund the event, prize pool, or specific sessions.' }, { icon: 'fa-user-tie', title: 'Mentorship & Expertise', desc: 'Speak, mentor, or judge the pitch competition.' }, { icon: 'fa-box-open', title: 'Goods & Services', desc: 'Provide materials, catering, or equipment.' }, { icon: 'fa-network-wired', title: 'Business Networking', desc: 'Connect students with your industry network.' }].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,151,0,0.1)' }}><i className={`fas ${item.icon} text-orange text-sm`} /></div>
                        <div><div className="font-montserrat font-bold text-navy text-sm">{item.title}</div><div className="text-gray-500 text-xs">{item.desc}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-3xl p-6 sm:p-8 text-white" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)', border: '1px solid rgba(255,151,0,0.15)' }}>
                <h3 className="font-montserrat font-black text-white text-xl mb-2">Why Partner with MUTCU Expo?</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">Your contribution creates real opportunities for the next generation of business leaders.</p>
                <div className="space-y-3 mb-8">
                  {[{ icon: 'fa-users', title: '120+ Students', desc: 'Direct access to motivated, entrepreneurial university students.' }, { icon: 'fa-bullhorn', title: 'Brand Visibility', desc: 'Logo placement, speaking slots, and booth space at the event.' }, { icon: 'fa-video', title: 'Livestream Exposure', desc: 'Reach audiences beyond the physical venue.' }, { icon: 'fa-heart', title: 'Kingdom Impact', desc: 'Invest in faith-driven entrepreneurship that transforms communities.' }, { icon: 'fa-trophy', title: 'Prize Sponsorship', desc: 'Associate your brand with the KSh 100,000 pitch competition.' }].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.15)' }}><i className={`fas ${item.icon} text-orange text-sm`} /></div>
                      <div><div className="font-montserrat font-bold text-white text-sm">{item.title}</div><div className="text-white/50 text-xs mt-0.5">{item.desc}</div></div>
                    </div>
                  ))}
                </div>
                <p className="font-montserrat font-bold text-white text-sm mb-3">Interested in Partnering?</p>
                <div className="space-y-2 mb-5">
                  <a href="mailto:mutcunion@gmail.com?subject=Business Expo 2027 Partnership" className="flex items-center gap-2 text-sm text-white/70 hover:text-orange transition-colors"><i className="fas fa-envelope text-orange w-4" />mutcunion@gmail.com</a>
                  <a href="tel:+254757930723" className="flex items-center gap-2 text-sm text-white/70 hover:text-orange transition-colors"><i className="fas fa-phone text-orange w-4" />+254 757 930723</a>
                </div>
                <a href="mailto:mutcunion@gmail.com?subject=Business Expo 2027 Partnership" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5" style={{ background: '#FF9700' }}>
                  Discuss a Partnership <i className="fas fa-arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 10. ABOUT ═════════════════════════════════════════════════════ */}
        <section id="about" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionBadge text="About the Expo" icon="fa-info-circle" />
                <h2 className="font-montserrat font-black text-navy text-3xl sm:text-4xl leading-tight mb-4">What Is the MUTCU<br />Business Exposition?</h2>
                <div className="h-1 w-12 rounded-full mb-6" style={{ background: '#FF9700' }} />
                <p className="text-gray-600 text-base leading-relaxed mb-4">The MUTCU Business Exposition is an annual entrepreneurship event organised by the Murang'a University of Technology Christian Union (MUTCU). The Expo brings together students, entrepreneurs, business leaders, and mentors to share practical business knowledge, build networks, and explore opportunities in entrepreneurship.</p>
                <p className="text-gray-600 text-base leading-relaxed mb-6">We believe that <strong className="text-navy">faith and professional excellence go hand in hand.</strong> Through the Expo, we encourage students to build businesses with integrity, innovation, purpose, and a commitment to serving others.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {[{ icon: 'fa-lightbulb', title: 'Ideas to Action', text: 'Turn your business idea into a real venture with structured guidance.' }, { icon: 'fa-network-wired', title: 'Build Networks', text: 'Connect with entrepreneurs, mentors, and business leaders.' }, { icon: 'fa-crown', title: 'Faith & Business', text: 'Integrate Christian values with entrepreneurial excellence.' }, { icon: 'fa-chart-line', title: 'Grow Your Venture', text: 'Gain skills and insights to scale your existing business.' }].map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.1)' }}><i className={`fas ${item.icon} text-orange text-sm`} /></div>
                      <div><div className="font-montserrat font-bold text-navy text-xs mb-0.5">{item.title}</div><div className="text-gray-500 text-xs leading-relaxed">{item.text}</div></div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(4,0,61,0.04)', border: '1px solid rgba(4,0,61,0.08)' }}>
                  <img src="/assets/images/FOCUS-Kenya-logo.webp" alt="FOCUS Kenya" className="h-8" onError={e => { e.target.style.display = 'none' }} />
                  <p className="text-gray-500 text-xs leading-relaxed">Organised by <strong className="text-navy">MUTCU</strong> — a Christ-centred student fellowship at MUT, affiliated with <strong className="text-navy">FOCUS Kenya</strong>.</p>
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  {[photos.about_1, photos.about_2, photos.about_3, photos.about_4].map((src, i) => (
                    <img key={i} src={src} alt="Expo moment" className="rounded-2xl w-full object-cover shadow-lg" style={{ height: 'clamp(160px, 20vw, 220px)', marginTop: i === 1 ? '24px' : i === 2 ? '-24px' : '0' }} loading="lazy" onError={e => { e.target.style.display = 'none' }} />
                  ))}
                </div>
                <div className="absolute -bottom-3 -left-3 rounded-2xl px-4 py-2.5 shadow-xl" style={{ background: '#FF9700' }}>
                  <div className="font-montserrat font-black text-white text-lg">3rd</div>
                  <div className="text-white/80 text-xs font-montserrat font-semibold">Edition · 2027</div>
                </div>
                <div className="absolute -top-3 -right-3 rounded-2xl px-4 py-2.5 shadow-xl" style={{ background: '#04003D' }}>
                  <div className="font-montserrat font-black text-orange text-lg">KSh 100K</div>
                  <div className="text-white/60 text-xs font-montserrat font-semibold">Prize Pool</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 11. FOOTER CTA ════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-24" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-orange font-montserrat font-black text-xs uppercase tracking-widest mb-3">MUTCU Business Exposition · 3rd Edition</div>
            <h2 className="font-montserrat font-black text-white text-3xl sm:text-5xl mb-3 leading-tight">Beyond Ideas:<br />Blueprint of a CEO</h2>
            <p className="text-white/50 font-montserrat font-semibold text-base mb-8">13 March 2027 · Murang'a University of Technology</p>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <button onClick={() => scrollTo('register')} className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1" style={{ background: '#FF9700', boxShadow: '0 4px 24px rgba(255,151,0,0.3)' }}>
                Register Free <i className="fas fa-arrow-right" />
              </button>
              <button onClick={() => scrollTo('founders-arena')} className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1" style={{ border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' }}>
                Apply to Pitch <i className="fas fa-fire" />
              </button>
              <a href="mailto:mutcunion@gmail.com?subject=Business Expo 2027 Partnership" className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1" style={{ border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' }}>
                Partner With Us <i className="fas fa-handshake" />
              </a>
            </div>
            <div className="flex justify-center gap-3 mb-8">
              {[{ icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/', label: 'Facebook' }, { icon: 'fab fa-instagram', url: 'https://www.instagram.com/muranga_university_cu/', label: 'Instagram' }, { icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@mutcu001', label: 'TikTok' }, { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@murangauniversityCU', label: 'YouTube' }].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 text-sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs font-montserrat">
              <span>© 2027 Murang'a University of Technology Christian Union. All rights reserved.</span>
              <Link to="/" className="hover:text-orange transition-colors flex items-center gap-1"><i className="fas fa-arrow-left text-xs" /> Back to MUTCU Website</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}