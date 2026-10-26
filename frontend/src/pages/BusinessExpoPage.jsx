import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

// ─── Photo pools ────────────────────────────────────────────────────────────
const HERO_BG = '/assets/images/expo/IMG_0630.jpg'

const EDITION2_PHOTOS = [
  { src: '/assets/images/expo/IMG_0616.jpg', alt: 'Business Expo 2026 — Audience' },
  { src: '/assets/images/expo/IMG_0628.jpg', alt: 'Business Expo 2026 — Speaker session' },
  { src: '/assets/images/expo/IMG_0777.jpg', alt: 'Business Expo 2026 — Panel discussion' },
  { src: '/assets/images/expo/IMG_0834.jpg', alt: 'Business Expo 2026 — Networking' },
  { src: '/assets/images/expo/IMG_0715.jpg', alt: 'Business Expo 2026 — Pitch showcase' },
  { src: '/assets/images/expo/IMG_0751.jpg', alt: 'Business Expo 2026 — Attendees' },
  { src: '/assets/images/expo/IMG_0760.jpg', alt: 'Business Expo 2026 — Entrepreneurs' },
  { src: '/assets/images/expo/IMG_0761.jpg', alt: 'Business Expo 2026 — Presentations' },
  { src: '/assets/images/expo/IMG_0764.jpg', alt: 'Business Expo 2026 — Workshop' },
  { src: '/assets/images/expo/IMG_0802.jpg', alt: 'Business Expo 2026 — Engagement' },
  { src: '/assets/images/expo/IMG_0818.jpg', alt: 'Business Expo 2026 — Speakers' },
  { src: '/assets/images/expo/IMG_0909.jpg', alt: 'Business Expo 2026 — Pitching' },
  { src: '/assets/images/expo/IMG_0910.jpg', alt: 'Business Expo 2026 — Crowd' },
  { src: '/assets/images/expo/IMG_0912.jpg', alt: 'Business Expo 2026 — Interaction' },
  { src: '/assets/images/expo/IMG_0916.jpg', alt: 'Business Expo 2026 — Mentors' },
  { src: '/assets/images/expo/IMG_0917.jpg', alt: 'Business Expo 2026 — Stage' },
  { src: '/assets/images/expo/IMG_0918.jpg', alt: 'Business Expo 2026 — Participants' },
  { src: '/assets/images/expo/IMG_0922.jpg', alt: 'Business Expo 2026 — Networking' },
  { src: '/assets/images/expo/IMG_0924.jpg', alt: 'Business Expo 2026 — Celebration' },
  { src: '/assets/images/expo/IMG_0925.jpg', alt: 'Business Expo 2026 — Closing' },
  { src: '/assets/images/expo/IMG_0578.jpg', alt: 'Business Expo 2026 — Moments' },
  { src: '/assets/images/expo/IMG_0579.jpg', alt: 'Business Expo 2026 — Highlights' },
  { src: '/assets/images/expo/IMG_0703.jpg', alt: 'Business Expo 2026 — Community' },
  { src: '/assets/images/expo/IMG_0783 (1).jpg', alt: 'Business Expo 2026 — Founders' },
]

// ─── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])
  return timeLeft
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-montserrat font-black text-white"
        style={{ background: 'rgba(255,151,0,0.15)', border: '1px solid rgba(255,151,0,0.4)' }}>
        {String(value ?? 0).padStart(2, '0')}
      </div>
      <span className="text-white/50 text-xs font-montserrat font-bold uppercase tracking-widest mt-2">{label}</span>
    </div>
  )
}

function StatPill({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <i className={`fas ${icon} text-orange text-xl mb-1`} />
      <div className="font-montserrat font-black text-white text-2xl">{value}</div>
      <div className="text-white/50 text-xs font-montserrat font-semibold uppercase tracking-wider text-center">{label}</div>
    </div>
  )
}

function SectionBadge({ text, icon }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4"
      style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.25)' }}>
      {icon && <i className={`fas ${icon}`} />}
      {text}
    </div>
  )
}

// ─── Gallery lightbox ────────────────────────────────────────────────────────
function GalleryGrid({ photos }) {
  const [lightbox, setLightbox] = useState(null)
  const [visible, setVisible] = useState(12)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.slice(0, visible).map((p, i) => (
          <button key={i} onClick={() => setLightbox(i)}
            className="relative overflow-hidden rounded-xl group aspect-square focus:outline-none">
            <img src={p.src} alt={p.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={e => { e.target.style.display = 'none' }} />
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-center justify-center">
              <i className="fas fa-expand text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>
      {visible < photos.length && (
        <div className="text-center mt-6">
          <button onClick={() => setVisible(photos.length)}
            className="btn-outline-expo">
            View All {photos.length} Photos <i className="fas fa-images ml-2" />
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
            onClick={() => setLightbox(null)}>
            <i className="fas fa-times" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-2xl z-10"
            onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + photos.length) % photos.length) }}>
            <i className="fas fa-chevron-left" />
          </button>
          <img src={photos[lightbox].src} alt={photos[lightbox].alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-2xl z-10"
            onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % photos.length) }}>
            <i className="fas fa-chevron-right" />
          </button>
          <div className="absolute bottom-4 text-white/40 text-sm font-montserrat">
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BusinessExpoPage() {
  const countdown = useCountdown('2027-03-13T08:00:00')
  const [activeStage, setActiveStage] = useState(0)
  const [navScrolled, setNavScrolled] = useState(false)
  const sectionsRef = useRef({})

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const STAGES = [
    {
      num: '01', label: 'The Call', icon: 'fa-bullhorn',
      tagline: 'Every journey starts with an idea.',
      desc: 'Have a business idea or an existing venture? Step forward, fill the application form, identify the problem you want to solve, share your vision, and begin your journey towards the pitch stage. This is your opportunity to put your entrepreneurial ambitions into motion.',
      action: 'Apply Now',
    },
    {
      num: '02', label: 'The Den', icon: 'fa-fire',
      tagline: 'Challenge your thinking. Refine your idea.',
      desc: 'A good idea must stand up to questions. The Den is where participants are challenged to think critically about their business ideas, test their assumptions, and identify gaps. Through questions, feedback, and constructive critique, you will strengthen your idea and develop a clearer understanding of your business.',
      action: 'Learn More',
    },
    {
      num: '03', label: 'Top 10 Blueprint Training', icon: 'fa-graduation-cap',
      tagline: 'Prepare to build and lead.',
      desc: 'Selected participants advance to focused training designed to strengthen their business models and sharpen their entrepreneurial skills. The training helps participants develop their understanding of their markets, communicate their value, and prepare to present their ventures effectively.',
      action: 'Learn More',
    },
    {
      num: '04', label: 'The Pitch Showcase', icon: 'fa-trophy',
      tagline: 'Present your vision. Make your case.',
      desc: 'Bring everything together and present your business idea or existing venture before a panel of judges and business leaders. Explain the problem you are solving, the value your business offers, and the potential of your idea. Compete for recognition and a share of the KSh 100,000 total prize pool.',
      action: 'Register to Pitch',
    },
  ]

  const WHAT_TO_EXPECT = [
    { icon: 'fa-microphone-alt', title: 'Keynote Sessions', desc: 'Learn about leadership, the CEO mindset, and excellence in the marketplace from experienced business leaders.' },
    { icon: 'fa-tools', title: 'Practical Workshops', desc: 'Develop business skills and gain insights you can apply directly to your own venture.' },
    { icon: 'fa-fire-alt', title: "Founder's Arena", desc: 'A structured journey to challenge your thinking, strengthen your business idea, and prepare to pitch.' },
    { icon: 'fa-comments', title: 'Business Panel Discussions', desc: 'Learn from experienced entrepreneurs about the challenges and opportunities of building a business.' },
    { icon: 'fa-handshake', title: 'Networking Opportunities', desc: 'Connect with entrepreneurs, mentors, speakers, and fellow students who share your passion for business.' },
    { icon: 'fa-trophy', title: 'Pitch Competition', desc: 'Present your venture before judges and compete for recognition and a share of the KSh 100,000 prize pool.' },
  ]

  const EDITION1_SPEAKERS = [
    { name: 'Daphne Mukami', topic: 'Networking in Business', icon: 'fa-network-wired' },
    { name: 'Steve Mbogo & Panel', topic: 'Kingdom Entrepreneurship', icon: 'fa-crown' },
    { name: 'AMICA', topic: 'Capital Acquisition', icon: 'fa-coins' },
  ]

  const EDITION2_SPEAKERS = [
    { name: 'Lionel Tinega', company: 'DigiAfrica', icon: 'fa-laptop-code' },
    { name: 'Lennox Omondi', company: 'EcoBana', icon: 'fa-leaf' },
    { name: 'Elizabeth Nungari', company: 'Bagged & Beyond', icon: 'fa-shopping-bag' },
    { name: 'Dennis Waweru', company: 'GYEF', icon: 'fa-rocket' },
  ]

  return (
    <>
      <SEO
        title="MUTCU Business Exposition 2027 — Beyond Ideas: Blueprint of a CEO"
        description="The 3rd MUTCU Business Exposition. Saturday, 13 March 2027 at Murang'a University of Technology. Keynotes, workshops, Founder's Arena, pitch competition with KSh 100,000 prize pool."
        url="/business-expo"
        keywords="MUTCU Business Expo, MUTCU Business Exposition, MUT entrepreneurship, student pitch competition, Founder's Arena, Beyond Ideas Blueprint of a CEO"
      />

      {/* ─── Sticky Expo Nav ─────────────────────────────────────────────── */}
      <div className={`fixed top-[80px] left-0 right-0 z-40 transition-all duration-300 ${navScrolled ? 'shadow-lg' : ''}`}
        style={{ background: navScrolled ? 'rgba(4,0,61,0.97)' : 'transparent', backdropFilter: navScrolled ? 'blur(12px)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-4 hidden md:flex items-center gap-1 py-2 overflow-x-auto">
          {[
            { id: 'about', label: 'About' },
            { id: 'journey', label: 'Our Journey' },
            { id: 'expo2027', label: 'Expo 2027' },
            { id: 'founders-arena', label: "Founder's Arena" },
            { id: 'partners', label: 'Partners' },
            { id: 'contact', label: 'Contact' },
          ].map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-montserrat font-semibold text-white/70 hover:text-orange hover:bg-white/10 transition-all whitespace-nowrap">
              {item.label}
            </button>
          ))}
          <div className="ml-auto">
            <a href="https://forms.gle/mutcu-expo-register" target="_blank" rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-lg text-xs font-montserrat font-bold text-white transition-all"
              style={{ background: '#FF9700' }}>
              Register Now
            </a>
          </div>
        </div>
      </div>

      <div className="overflow-x-hidden">

        {/* ═══════════════════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ marginTop: '-80px' }}>
          {/* Background */}
          <div className="absolute inset-0">
            <img src={HERO_BG} alt="MUTCU Business Expo"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.background = '#04003D' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.93) 0%, rgba(4,0,61,0.75) 60%, rgba(10,0,96,0.85) 100%)' }} />
          </div>

          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 border border-orange pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.03] border border-orange pointer-events-none" />

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24 pb-16">
            {/* Edition badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-6"
              style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.3)' }}>
              <i className="fas fa-star" /> 3rd Edition · 13 March 2027
            </div>

            {/* Org name */}
            <p className="text-white/50 text-sm font-montserrat font-semibold uppercase tracking-[0.3em] mb-3">
              Murang'a University of Technology Christian Union
            </p>

            {/* Main title */}
            <h1 className="font-montserrat font-black text-white leading-none mb-2" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              MUTCU BUSINESS
            </h1>
            <h1 className="font-montserrat font-black leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', color: '#FF9700' }}>
              EXPOSITION
            </h1>

            {/* Theme */}
            <div className="inline-block mb-4">
              <div className="h-px w-16 bg-orange/40 mx-auto mb-4" />
              <p className="text-white/90 font-montserrat font-bold text-xl md:text-2xl tracking-wide">
                BEYOND IDEAS: BLUEPRINT OF A CEO
              </p>
              <div className="h-px w-16 bg-orange/40 mx-auto mt-4" />
            </div>

            <p className="text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Ideas are a beginning. It's time to build. Join students, entrepreneurs, business leaders, and mentors for a day of learning, pitching, networking, and growth.
            </p>

            {/* Event details strip */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm">
              {[
                { icon: 'fa-calendar-alt', text: 'Saturday, 13 March 2027' },
                { icon: 'fa-clock', text: '8:00 AM – 4:00 PM' },
                { icon: 'fa-map-marker-alt', text: "Murang'a University of Technology" },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-white/70 font-montserrat font-semibold">
                  <i className={`fas ${d.icon} text-orange`} />
                  {d.text}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-14">
              <a href="#expo2027" onClick={e => { e.preventDefault(); scrollTo('expo2027') }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: '#FF9700', boxShadow: '0 4px 24px rgba(255,151,0,0.35)' }}>
                Register to Attend <i className="fas fa-arrow-right" />
              </a>
              <a href="#founders-arena" onClick={e => { e.preventDefault(); scrollTo('founders-arena') }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1"
                style={{ border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)' }}>
                Pitch Your Business <i className="fas fa-microphone" />
              </a>
            </div>

            {/* Countdown */}
            <div>
              <p className="text-white/40 text-xs font-montserrat font-bold uppercase tracking-widest mb-4">Countdown to Expo Day</p>
              <div className="flex justify-center gap-4">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Mins" />
                <CountdownUnit value={countdown.seconds} label="Secs" />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-xs font-montserrat">
            <span>Scroll</span>
            <i className="fas fa-chevron-down animate-bounce" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PRIZE POOL BANNER
        ═══════════════════════════════════════════════════════════════════ */}
        <section style={{ background: '#FF9700' }}>
          <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <i className="fas fa-trophy text-white text-3xl" />
              <div>
                <div className="font-montserrat font-black text-white text-2xl">KSh 100,000</div>
                <div className="text-white/80 text-sm font-montserrat font-semibold">Total Prize Pool — Student Pitch Competition</div>
              </div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-white/30" />
            <p className="text-white/90 text-sm font-montserrat font-semibold max-w-xs">
              Compete, pitch your idea, and win a share of the biggest prize pool in MUTCU Expo history.
            </p>
            <a href="#founders-arena" onClick={e => { e.preventDefault(); scrollTo('founders-arena') }}
              className="px-6 py-2.5 rounded-xl font-montserrat font-bold text-orange text-sm bg-white hover:bg-white/90 transition-all whitespace-nowrap">
              Apply to Pitch →
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            ABOUT THE EXPO
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <div data-aos="fade-right">
                <SectionBadge text="About the Expo" icon="fa-info-circle" />
                <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl leading-tight mb-4">
                  What Is the MUTCU<br />Business Exposition?
                </h2>
                <div className="h-1 w-12 rounded-full mb-6" style={{ background: '#FF9700' }} />
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  The MUTCU Business Exposition is an annual entrepreneurship event organised by the Murang'a University of Technology Christian Union (MUTCU). The Expo brings together students, entrepreneurs, business leaders, and mentors to share practical business knowledge, build networks, and explore opportunities in entrepreneurship.
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  We believe that <strong className="text-navy">faith and professional excellence go hand in hand.</strong> Through the Expo, we encourage students to build businesses with integrity, innovation, purpose, and a commitment to serving others.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: 'fa-lightbulb', title: 'Ideas to Action', text: 'Turn your business idea into a real venture with structured guidance.' },
                    { icon: 'fa-network-wired', title: 'Build Networks', text: 'Connect with entrepreneurs, mentors, and business leaders.' },
                    { icon: 'fa-crown', title: 'Faith & Business', text: 'Integrate Christian values with entrepreneurial excellence.' },
                    { icon: 'fa-chart-line', title: 'Grow Your Venture', text: 'Gain skills and insights to scale your existing business.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,151,0,0.12)' }}>
                        <i className={`fas ${item.icon} text-orange text-sm`} />
                      </div>
                      <div>
                        <div className="font-montserrat font-bold text-navy text-sm mb-0.5">{item.title}</div>
                        <div className="text-gray-500 text-xs leading-relaxed">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(4,0,61,0.04)', border: '1px solid rgba(4,0,61,0.08)' }}>
                  <img src="/assets/images/FOCUS-Kenya-logo.webp" alt="FOCUS Kenya" className="h-8"
                    onError={e => { e.target.style.display = 'none' }} />
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Organised by <strong className="text-navy">MUTCU</strong> — a Christ-centred student fellowship at MUT, affiliated with <strong className="text-navy">FOCUS Kenya</strong>.
                  </p>
                </div>
              </div>

              {/* Image collage */}
              <div data-aos="fade-left" className="relative">
                <div className="grid grid-cols-2 gap-3">
                  <img src="/assets/images/expo/IMG_0917.jpg" alt="Expo moment"
                    className="rounded-2xl w-full h-52 object-cover shadow-lg"
                    onError={e => { e.target.style.display = 'none' }} />
                  <img src="/assets/images/expo/IMG_0910.jpg" alt="Expo moment"
                    className="rounded-2xl w-full h-52 object-cover shadow-lg mt-6"
                    onError={e => { e.target.style.display = 'none' }} />
                  <img src="/assets/images/expo/IMG_0777.jpg" alt="Expo moment"
                    className="rounded-2xl w-full h-52 object-cover shadow-lg -mt-6"
                    onError={e => { e.target.style.display = 'none' }} />
                  <img src="/assets/images/expo/IMG_0834.jpg" alt="Expo moment"
                    className="rounded-2xl w-full h-52 object-cover shadow-lg"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-3 shadow-xl"
                  style={{ background: '#FF9700' }}>
                  <div className="font-montserrat font-black text-white text-xl">3rd</div>
                  <div className="text-white/80 text-xs font-montserrat font-semibold">Edition · 2027</div>
                </div>
                <div className="absolute -top-4 -right-4 rounded-2xl px-5 py-3 shadow-xl"
                  style={{ background: '#04003D' }}>
                  <div className="font-montserrat font-black text-orange text-xl">KSh 100K</div>
                  <div className="text-white/60 text-xs font-montserrat font-semibold">Prize Pool</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            OUR JOURNEY — TIMELINE
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="journey" className="py-24" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <SectionBadge text="Our Journey" icon="fa-road" />
              <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-4">Growing Beyond Ideas</h2>
              <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
                Three editions. Three chapters of a story about faith, entrepreneurship, and the next generation of business leaders.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
                style={{ background: 'rgba(255,151,0,0.2)' }} />

              {/* Edition 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20" data-aos="fade-up">
                <div className="lg:text-right order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-3"
                    style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.2)' }}>
                    1st Edition · 9 March 2025
                  </div>
                  <h3 className="font-montserrat font-black text-white text-2xl mb-3">Laying the Foundation</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    The inaugural Business Exposition established a platform for bringing faith and entrepreneurship together. Held at Ecop Hall, it introduced students to foundational business topics — networking, funding, and the basics of entrepreneurship — challenging the traditional mindset that the church's role is limited to spiritual activities.
                  </p>
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    {[
                      { icon: 'fa-users', label: 'High Turnout' },
                      { icon: 'fa-microphone', label: '3 Speakers' },
                      { icon: 'fa-store', label: 'Student Booths' },
                      { icon: 'fa-briefcase', label: 'Job Secured' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-montserrat font-semibold text-white/70"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <i className={`fas ${s.icon} text-orange text-xs`} />
                        {s.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-white/40 text-xs font-montserrat font-semibold uppercase tracking-wider mb-2">Featured Speakers</p>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {EDITION1_SPEAKERS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <i className={`fas ${s.icon} text-orange text-xs`} />
                          <div>
                            <div className="text-white text-xs font-montserrat font-bold">{s.name}</div>
                            <div className="text-white/40 text-xs">{s.topic}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center z-10"
                  style={{ background: '#FF9700', top: '2rem' }}>
                  <span className="font-montserrat font-black text-white text-sm">1</span>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl"
                    style={{ border: '1px solid rgba(255,151,0,0.2)' }}>
                    <img src="/assets/images/expo/IMG_0703.jpg" alt="1st Edition"
                      className="w-full h-64 object-cover"
                      onError={e => { e.target.style.background = '#0a0060'; e.target.style.height = '256px' }} />
                    <div className="p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-white/50 text-xs font-montserrat font-semibold">
                        Theme: <span className="text-orange">"Networking and Businesses"</span> · Ecop Hall, MUT
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edition 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-20" data-aos="fade-up">
                <div className="order-1">
                  <div className="rounded-2xl overflow-hidden shadow-2xl"
                    style={{ border: '1px solid rgba(255,151,0,0.2)' }}>
                    {/* Photo grid */}
                    <div className="grid grid-cols-3 gap-1 p-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {[
                        '/assets/images/expo/IMG_0616.jpg',
                        '/assets/images/expo/IMG_0628.jpg',
                        '/assets/images/expo/IMG_0777.jpg',
                        '/assets/images/expo/IMG_0834.jpg',
                        '/assets/images/expo/IMG_0715.jpg',
                        '/assets/images/expo/IMG_0751.jpg',
                      ].map((src, i) => (
                        <img key={i} src={src} alt={`2nd Edition moment ${i + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={e => { e.target.style.display = 'none' }} />
                      ))}
                    </div>
                    <div className="p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-white/50 text-xs font-montserrat font-semibold">
                        14 March 2026 · Assembly Hall, MUT · Livestreamed
                      </p>
                    </div>
                  </div>
                </div>
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center z-10"
                  style={{ background: '#FF9700', top: '50%' }}>
                  <span className="font-montserrat font-black text-white text-sm">2</span>
                </div>
                <div className="order-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-3"
                    style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.2)' }}>
                    2nd Edition · 14 March 2026
                  </div>
                  <h3 className="font-montserrat font-black text-white text-2xl mb-3">Scaling the Vision</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    The 2nd Business Exposition was held at the Assembly Hall of Murang'a University of Technology. The event welcomed 120 attendees and featured four business leaders who shared their experiences and insights. It also included a student pitch showcase and was livestreamed — creating opportunities for students to present their ideas, learn from experienced entrepreneurs, and build valuable connections.
                  </p>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <StatPill icon="fa-users" value="120+" label="Attendees" />
                    <StatPill icon="fa-microphone" value="4" label="Speakers" />
                    <StatPill icon="fa-video" value="Live" label="Streamed" />
                  </div>
                  <div className="mt-4">
                    <p className="text-white/40 text-xs font-montserrat font-semibold uppercase tracking-wider mb-2">Featured Speakers</p>
                    <div className="grid grid-cols-2 gap-2">
                      {EDITION2_SPEAKERS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(255,151,0,0.15)' }}>
                            <i className={`fas ${s.icon} text-orange text-xs`} />
                          </div>
                          <div>
                            <div className="text-white text-xs font-montserrat font-bold leading-tight">{s.name}</div>
                            <div className="text-white/40 text-xs">{s.company}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edition 3 — Coming */}
              <div className="text-center" data-aos="fade-up">
                <div className="inline-block">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: '#FF9700', boxShadow: '0 0 40px rgba(255,151,0,0.4)' }}>
                    <span className="font-montserrat font-black text-white text-xl">3</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-orange text-sm font-montserrat font-bold"
                    style={{ background: 'rgba(255,151,0,0.12)', border: '1px solid rgba(255,151,0,0.3)' }}>
                    <i className="fas fa-star animate-pulse" />
                    3rd Edition · 13 March 2027 · Coming Soon
                  </div>
                  <p className="text-white/50 text-sm mt-3 font-montserrat">
                    Each edition builds on the previous one. The journey continues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PHOTO GALLERY — 2nd Edition
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <SectionBadge text="2nd Edition Gallery" icon="fa-images" />
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-3">Moments from Expo 2026</h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                120 attendees. 4 speakers. 1 unforgettable day of entrepreneurship, learning, and connection.
              </p>
            </div>
            <GalleryGrid photos={EDITION2_PHOTOS} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            EXPO 2027 — WHAT TO EXPECT
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="expo2027" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <SectionBadge text="Business Expo 2027" icon="fa-rocket" />
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">
                Beyond Ideas: Blueprint of a CEO
              </h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
                The 3rd MUTCU Business Exposition is designed to help students move from having ideas to building businesses. Under the theme <strong className="text-navy">Beyond Ideas: Blueprint of a CEO</strong>, we will explore what it takes to think like a leader, develop practical business skills, make sound decisions, and create meaningful impact.
              </p>
            </div>

            {/* Event details card */}
            <div className="rounded-3xl p-8 md:p-12 mb-16 text-white"
              style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)', border: '1px solid rgba(255,151,0,0.15)' }}
              data-aos="fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: 'fa-calendar-alt', label: 'Date', value: 'Saturday, 13 March 2027' },
                  { icon: 'fa-clock', label: 'Time', value: '8:00 AM – 4:00 PM' },
                  { icon: 'fa-map-marker-alt', label: 'Venue', value: "Murang'a University of Technology" },
                  { icon: 'fa-users', label: 'Organiser', value: 'MUTCU Resource Mobilization Committee' },
                  { icon: 'fa-lightbulb', label: 'Theme', value: 'Beyond Ideas: Blueprint of a CEO' },
                  { icon: 'fa-trophy', label: 'Prize Pool', value: 'KSh 100,000 (Pitch Competition)' },
                ].map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,151,0,0.15)' }}>
                      <i className={`fas ${d.icon} text-orange text-sm`} />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs font-montserrat font-bold uppercase tracking-wider">{d.label}</div>
                      <div className="text-white font-montserrat font-semibold text-sm mt-0.5">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="https://forms.gle/mutcu-expo-register" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: '#FF9700' }}>
                  Register to Attend <i className="fas fa-arrow-right" />
                </a>
                <a href="#founders-arena" onClick={e => { e.preventDefault(); scrollTo('founders-arena') }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                  style={{ border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' }}>
                  Begin Founder's Arena <i className="fas fa-fire" />
                </a>
              </div>
            </div>

            {/* What to expect grid */}
            <div className="text-center mb-10" data-aos="fade-up">
              <h3 className="font-montserrat font-black text-navy text-2xl mb-2">What to Expect</h3>
              <p className="text-gray-500 text-sm">A full day packed with sessions designed to equip, inspire, and connect.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHAT_TO_EXPECT.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-orange/30 hover:shadow-lg transition-all duration-300 group"
                  data-aos="zoom-in" data-aos-delay={i * 60}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(255,151,0,0.1)' }}>
                    <i className={`fas ${item.icon} text-orange text-xl`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-navy text-base mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FOUNDER'S ARENA
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="founders-arena" className="py-24" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-up">
              <SectionBadge text="Founder's Arena" icon="fa-fire-alt" />
              <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-4">From Idea to the Pitch Stage</h2>
              <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
                Every business starts with an idea. But turning that idea into a business takes more than inspiration — it takes research, critical thinking, preparation, and the ability to communicate your vision. Founder's Arena is the structured journey every student who wishes to pitch must go through.
              </p>
            </div>

            {/* Stage selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {STAGES.map((s, i) => (
                <button key={i} onClick={() => setActiveStage(i)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-montserrat font-bold text-sm transition-all duration-300"
                  style={{
                    background: activeStage === i ? '#FF9700' : 'rgba(255,255,255,0.06)',
                    border: activeStage === i ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: activeStage === i ? 'white' : 'rgba(255,255,255,0.6)',
                  }}>
                  <span className="font-black">{s.num}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Active stage detail */}
            <div className="max-w-3xl mx-auto mb-16" data-aos="fade-up">
              <div className="rounded-3xl p-8 md:p-10"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,151,0,0.2)' }}>
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,151,0,0.15)', border: '1px solid rgba(255,151,0,0.3)' }}>
                    <i className={`fas ${STAGES[activeStage].icon} text-orange text-2xl`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-montserrat font-black text-orange text-sm">Stage {STAGES[activeStage].num}</span>
                      <div className="h-px flex-1" style={{ background: 'rgba(255,151,0,0.2)' }} />
                    </div>
                    <h3 className="font-montserrat font-black text-white text-2xl mb-1">{STAGES[activeStage].label}</h3>
                    <p className="text-orange font-montserrat font-semibold text-sm mb-4 italic">{STAGES[activeStage].tagline}</p>
                    <p className="text-white/65 text-sm leading-relaxed mb-6">{STAGES[activeStage].desc}</p>
                    <a href="https://forms.gle/mutcu-founders-arena" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                      style={{ background: '#FF9700' }}>
                      {STAGES[activeStage].action} <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap visual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STAGES.map((s, i) => (
                <div key={i}
                  className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300"
                  style={{
                    background: activeStage === i ? 'rgba(255,151,0,0.12)' : 'rgba(255,255,255,0.04)',
                    border: activeStage === i ? '1px solid rgba(255,151,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                  onClick={() => setActiveStage(i)}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  {/* Connector arrow */}
                  {i < STAGES.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <i className="fas fa-chevron-right text-orange/40 text-xs" />
                    </div>
                  )}
                  <div className="font-montserrat font-black text-orange/40 text-4xl mb-3">{s.num}</div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: activeStage === i ? 'rgba(255,151,0,0.2)' : 'rgba(255,255,255,0.06)' }}>
                    <i className={`fas ${s.icon} text-orange text-sm`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white text-sm mb-1">{s.label}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{s.tagline}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-14" data-aos="fade-up">
              <p className="text-white/50 text-sm font-montserrat mb-2">
                You do not have to have everything figured out to begin.
              </p>
              <p className="text-white font-montserrat font-bold text-lg mb-6">
                Your Idea. Your Journey. Your Next Step.
              </p>
              <a href="https://forms.gle/mutcu-founders-arena" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: '#FF9700', boxShadow: '0 4px 24px rgba(255,151,0,0.3)' }}>
                Apply to Founder's Arena <i className="fas fa-fire" />
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PARTNERS & SPONSORS
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="partners" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div data-aos="fade-right">
                <SectionBadge text="Partners & Sponsors" icon="fa-handshake" />
                <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl leading-tight mb-4">
                  Partner With Us
                </h2>
                <div className="h-1 w-12 rounded-full mb-6" style={{ background: '#FF9700' }} />
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  The MUTCU Business Exposition brings together students, entrepreneurs, and business leaders to support the growth of student entrepreneurship. We welcome partnerships with organisations and individuals who share our commitment to equipping the next generation of business leaders.
                </p>
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  Together, we can help students move beyond ideas and build businesses with purpose.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: 'fa-coins', text: 'Financial sponsorship' },
                    { icon: 'fa-user-tie', text: 'Mentorship and professional expertise' },
                    { icon: 'fa-box-open', text: 'Goods and services' },
                    { icon: 'fa-network-wired', text: 'Business networking and industry connections' },
                    { icon: 'fa-handshake', text: 'Other relevant partnerships that support student entrepreneurship' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,151,0,0.1)' }}>
                        <i className={`fas ${item.icon} text-orange text-sm`} />
                      </div>
                      <span className="text-gray-600 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="p-5 rounded-2xl" style={{ background: 'rgba(4,0,61,0.04)', border: '1px solid rgba(4,0,61,0.08)' }}>
                  <p className="font-montserrat font-bold text-navy text-sm mb-3">Interested in Partnering With Us?</p>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-envelope text-orange w-4" />
                      <a href="mailto:mutcunion@gmail.com" className="hover:text-orange transition-colors">mutcunion@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-phone text-orange w-4" />
                      <a href="tel:+254757930723" className="hover:text-orange transition-colors">+254 757 930723</a>
                    </div>
                  </div>
                  <a href="mailto:mutcunion@gmail.com?subject=Business Expo 2027 Partnership"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                    style={{ background: '#FF9700' }}>
                    Discuss a Partnership <i className="fas fa-arrow-right" />
                  </a>
                </div>
              </div>

              {/* Why partner */}
              <div data-aos="fade-left">
                <div className="rounded-3xl p-8 text-white"
                  style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)', border: '1px solid rgba(255,151,0,0.15)' }}>
                  <h3 className="font-montserrat font-black text-white text-xl mb-2">Why Partner with MUTCU Expo?</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Your contribution creates real opportunities for the next generation of business leaders.
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: 'fa-users', title: 'Reach 120+ Students', desc: 'Direct access to motivated, entrepreneurial university students.' },
                      { icon: 'fa-bullhorn', title: 'Brand Visibility', desc: 'Logo placement, speaking slots, and booth space at the event.' },
                      { icon: 'fa-video', title: 'Livestream Exposure', desc: 'Reach audiences beyond the physical venue through our livestream.' },
                      { icon: 'fa-heart', title: 'Kingdom Impact', desc: 'Invest in faith-driven entrepreneurship that transforms communities.' },
                      { icon: 'fa-trophy', title: 'Prize Sponsorship', desc: 'Associate your brand with the KSh 100,000 pitch competition.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(255,151,0,0.15)' }}>
                          <i className={`fas ${item.icon} text-orange text-sm`} />
                        </div>
                        <div>
                          <div className="font-montserrat font-bold text-white text-sm">{item.title}</div>
                          <div className="text-white/50 text-xs mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTACT
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
            <SectionBadge text="Get in Touch" icon="fa-envelope" />
            <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">Have a Question?</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Interested in attending, pitching, speaking, sponsoring, or partnering with us? We would love to hear from you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: 'fa-envelope', label: 'Email', value: 'mutcunion@gmail.com', href: 'mailto:mutcunion@gmail.com' },
                { icon: 'fa-phone', label: 'Phone', value: '+254 757 930723', href: 'tel:+254757930723' },
                { icon: 'fa-globe', label: 'Website', value: 'mutcu.org', href: 'https://mutcu.org' },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:border-orange/30 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,151,0,0.1)' }}>
                    <i className={`fas ${c.icon} text-orange`} />
                  </div>
                  <div className="font-montserrat font-bold text-navy text-xs uppercase tracking-wider">{c.label}</div>
                  <div className="text-gray-500 text-sm group-hover:text-orange transition-colors">{c.value}</div>
                </a>
              ))}
            </div>
            {/* Social links */}
            <div className="flex justify-center gap-3">
              {[
                { icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/', label: 'Facebook' },
                { icon: 'fab fa-instagram', url: 'https://www.instagram.com/muranga_university_cu/', label: 'Instagram' },
                { icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@mutcu001', label: 'TikTok' },
                { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@murangauniversityCU', label: 'YouTube' },
              ].map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 text-sm"
                  style={{ background: '#04003D' }}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            EXPO FOOTER CTA
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
            <div className="text-orange font-montserrat font-black text-sm uppercase tracking-widest mb-3">
              MUTCU Business Exposition · 3rd Edition
            </div>
            <h2 className="font-montserrat font-black text-white text-3xl md:text-5xl mb-3 leading-tight">
              Beyond Ideas:<br />Blueprint of a CEO
            </h2>
            <p className="text-white/50 font-montserrat font-semibold text-base mb-8">
              13 March 2027 · Murang'a University of Technology
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://forms.gle/mutcu-expo-register" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1"
                style={{ background: '#FF9700', boxShadow: '0 4px 24px rgba(255,151,0,0.3)' }}>
                Register to Attend <i className="fas fa-arrow-right" />
              </a>
              <a href="https://forms.gle/mutcu-founders-arena" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1"
                style={{ border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' }}>
                Pitch Your Business <i className="fas fa-fire" />
              </a>
              <a href="mailto:mutcunion@gmail.com?subject=Business Expo 2027 Partnership"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all hover:-translate-y-1"
                style={{ border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)' }}>
                Partner With Us <i className="fas fa-handshake" />
              </a>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs font-montserrat">
              <span>© 2027 Murang'a University of Technology Christian Union. All rights reserved.</span>
              <Link to="/" className="hover:text-orange transition-colors flex items-center gap-1">
                <i className="fas fa-arrow-left text-xs" /> Back to MUTCU Website
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* Inline styles for expo-specific classes */}
      <style>{`
        .btn-outline-expo {
          display: inline-flex;
          align-items: center;
          padding: 0.625rem 1.5rem;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          border: 2px solid #04003D;
          color: #04003D;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          background: transparent;
        }
        .btn-outline-expo:hover {
          background: #04003D;
          color: white;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  )
}