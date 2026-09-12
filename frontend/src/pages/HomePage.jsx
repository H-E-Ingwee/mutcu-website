import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { eventsAPI, newsletterAPI } from '../lib/api'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'
import AIPrayerForm from '../components/AIPrayerForm'
import AIDailyDevotional from '../components/AIDailyDevotional'
import AIMinistryMatcher from '../components/AIMinistryMatcher'
import toast from 'react-hot-toast'

const HERO_SLIDES = [
  {
    image: '/assets/images/exec.jpg',
    title: 'Raising a Christ-like Family',
    subtitle: 'Equipped in all aspects of life — united as one body, and reaching out to non-believers within our community and beyond.',
    cta1: { label: 'Our Mission', to: '/about', icon: 'fa-bullseye' },
    cta2: { label: 'View Programs', to: '/events', icon: 'fa-calendar-alt' },
  },
  {
    image: '/assets/images/Lumii_20241023_192938507.jpg',
    title: 'Inspire Love, Hope & Godliness',
    subtitle: "Murang'a University of Technology Christian Union — a Christ-centred family for discipleship, evangelism, mission work, and leadership development.",
    cta1: { label: 'Join Us', to: '/register', icon: 'fa-hand-point-right' },
    cta2: { label: 'Watch / Listen', to: '/resources', icon: 'fa-play-circle' },
  },
  {
    image: '/assets/images/church2.jpg',
    title: 'Growing in the Word & Prayer',
    subtitle: 'Join us for Bible study, prayer meetings, worship services, fellowships, and trainings that build a grounded and fruitful walk with Christ.',
    cta1: { label: 'Resources', to: '/resources', icon: 'fa-book' },
    cta2: { label: 'Serve With Us', to: '/ministries', icon: 'fa-hands-helping' },
  },
  {
    image: '/assets/images/church3.jpg',
    title: 'A Model Christian Union',
    subtitle: 'Cultivating Christ-centeredness among members to positively impact the society.',
    cta1: { label: 'Our Vision', to: '/about', icon: 'fa-eye' },
    cta2: { label: 'View Gallery', to: '/gallery', icon: 'fa-images' },
  },
]

const CORE_VALUES = [
  { title: 'Faith', icon: 'fas fa-cross', text: "Rooted in the Bible and a personal relationship with Jesus Christ, expressed through prayer, worship, and in-depth Bible study." },
  { title: 'Love', icon: 'fas fa-heart', text: "Demonstrating God's unconditional love through genuine fellowship and a welcoming heart for all." },
  { title: 'Hope', icon: 'fas fa-lightbulb', text: "Being a source of hope through positive words, encouraging actions, and unwavering faith in uncertain times." },
  { title: 'Godliness', icon: 'fas fa-church', text: "Striving for lives that honour and glorify God in all we do—personally and together as a Union." },
  { title: 'Accountability', icon: 'fas fa-user-check', text: "Walking together in fellowship, support, and solidarity—being answerable to one another in our actions and decisions." },
  { title: 'Service', icon: 'fas fa-hand-holding-heart', text: "Putting our faith into action by serving practical and spiritual needs within the university and beyond." },
]

const MINISTRIES_PREVIEW = [
  { title: 'Prayer Ministry', icon: 'fas fa-praying-hands', image: '/assets/images/prayer1.jpg', description: 'Leading the Union into a deep culture of prayer—personal devotion, corporate intercession, and spiritual revival.', link: '/ministries/prayer-ministry' },
  { title: 'Music Ministry', icon: 'fas fa-music', image: '/assets/images/music2.jpg', description: 'Ministering worship with excellence through Praise & Worship, Choir, Instrumentalists and the Band.', link: '/ministries/music-ministry' },
  { title: 'Missions & Evangelism', icon: 'fas fa-globe', image: '/assets/images/mission1.jpg', description: 'Mobilizing members to proclaim the Gospel in word and deed—on campus and beyond—through evangelism and outreach.', link: '/ministries/missions-evangelism' },
  { title: 'Bible Study & Training', icon: 'fas fa-book-open', image: '/assets/images/bs1.jpg', description: 'Deepening spiritual growth through Bible study, doctrine, trainings, and equipping programs for all members.', link: '/ministries/bible-study' },
  { title: 'Creative Arts (CREAM)', icon: 'fas fa-theater-masks', image: '/assets/images/dance3.jpg', description: 'Communicating the Gospel creatively through drama, dance, spoken word, and other Christ-centred expressions.', link: '/ministries/creative-arts' },
  { title: 'Technical & Media', icon: 'fas fa-photo-video', image: '/assets/images/technicalDpt.jpg', description: 'Supporting worship and communication through sound, visuals, coverage, design, and digital publicity platforms.', link: '/ministries/technical-department' },
]

const GALLERY_PREVIEW = [
  { image: '/assets/images/music2.jpg', label: 'Worship', icon: 'fas fa-music' },
  { image: '/assets/images/mission1.jpg', label: 'Outreach', icon: 'fas fa-globe' },
  { image: '/assets/images/dance3.jpg', label: 'Creative Arts', icon: 'fas fa-theater-masks' },
  { image: '/assets/images/bs1.jpg', label: 'Bible Study', icon: 'fas fa-book-open' },
  { image: '/assets/images/cream1.JPG', label: 'CREAM', icon: 'fas fa-theater-masks' },
  { image: '/assets/images/Outreach 1.jpg', label: 'Missions', icon: 'fas fa-globe' },
  { image: '/assets/images/band1.jpg', label: 'Music', icon: 'fas fa-music' },
  { image: '/assets/images/drama2.JPG', label: 'Drama', icon: 'fas fa-masks-theater' },
]

const TESTIMONIALS = [
  { quote: 'MUTCU has been my family away from home. The fellowship and discipleship have deepened my faith and helped me navigate university life.', author: 'MUTCU Member' },
  { quote: 'Serving in ministry helped me grow in discipline, accountability, and boldness for Christ.', author: 'MUTCU Member' },
  { quote: 'The Word, prayer meetings, and mentorship shaped me spiritually and gave me purpose in campus.', author: 'MUTCU Member' },
]



export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  // Prayer form now handled by AIPrayerForm component
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false)

  // Hero slideshow
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(i => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 7000)
    return () => clearInterval(timer)
  }, [])

  // Fetch upcoming events
  useEffect(() => {
    eventsAPI.getFeatured()
      .then(data => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false))
  }, [])

  

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    setNewsletterSubmitting(true)
    try {
      const res = await newsletterAPI.subscribe(newsletterEmail.trim())
      toast.success(res.message || 'Subscribed successfully!')
      setNewsletterEmail('')
    } catch (err) { toast.error(err.message || 'Subscription failed') }
    finally { setNewsletterSubmitting(false) }
  }

  const slide = HERO_SLIDES[currentSlide]

  return (
    <>
    <SEO
      title="MUTCU — Inspire Love, Hope & Godliness"
      description="Murang'a University of Technology Christian Union — a Christ-centred student fellowship at MUT. Join us for discipleship, evangelism, worship, and fellowship."
      url="/"
      keywords="MUTCU, Murang'a University Christian Union, MUT Christian Union, FOCUS Kenya, Christian fellowship Kenya, university Christian union"
    />
    <div>
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ marginTop: '-80px' }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className="hero-slide" style={{
            backgroundImage: `url(${s.image})`,
            opacity: i === currentSlide ? 1 : 0,
            zIndex: i === currentSlide ? 1 : 0,
          }} />
        ))}
        <div className="hero-overlay" style={{ zIndex: 2 }} />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10 border-2 border-orange" style={{ zIndex: 2 }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10 border-2 border-teal" style={{ zIndex: 2 }} />

        <div className="relative text-center text-white px-4 max-w-4xl mx-auto" style={{ zIndex: 3 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-6"
            data-aos="fade-down">
            <i className="fas fa-cross" /> Murang'a University of Technology Christian Union
          </div>
          <h1 className="font-montserrat font-black text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight" data-aos="fade-up">
            {slide.title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
            <Link to={slide.cta1.to} className="btn-primary btn-lg">
              {slide.cta1.label} <i className={`fas ${slide.cta1.icon}`} />
            </Link>
            <Link to={slide.cta2.to} className="btn-outline-white btn-lg">
              {slide.cta2.label} <i className={`fas ${slide.cta2.icon}`} />
            </Link>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 3 }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-orange' : 'w-2 bg-white/40'}`} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 text-white/40 text-xs font-montserrat flex flex-col items-center gap-1" style={{ zIndex: 3 }}>
          <span>Scroll</span>
          <i className="fas fa-chevron-down animate-bounce" />
        </div>
      </section>

      {/* ─── Join CTA Banner ──────────────────────────────────────────────────── */}
      <section className="bg-orange py-10">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="zoom-in">
          <i className="fas fa-user-plus text-white text-5xl mb-4 block" />
          <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-3">Ready to Join Us?</h2>
          <p className="text-white/90 text-lg mb-6">Become part of the MUTCU family and experience discipleship, fellowship, and spiritual growth.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-navy btn-lg">
              Register Now <i className="fas fa-arrow-right" />
            </Link>
            <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-outline-white btn-lg">
              Member Portal <i className="fas fa-external-link-alt" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── About Section ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                <i className="fas fa-cross" /> About MUTCU
              </div>
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4 leading-tight">
                Who We Are
              </h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-6" />
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Murang'a University of Technology Christian Union (MUTCU) is a Christ-centred, student-led fellowship at MUT,
                affiliated with FOCUS Kenya. We exist to inspire love, hope, and godliness through discipleship, evangelism,
                mission work, and leadership development.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: 'fa-chess-king', title: 'Our Mission', text: 'Raising a Christ-like family, equipped in all aspects of life, by encouraging unity as one body and reaching out to non-believers.' },
                  { icon: 'fa-eye', title: 'Our Vision', text: 'To be a model Christian union that cultivates Christ-centeredness among members to positively impact the society.' },
                ].map(item => (
                  <div key={item.title} className="bg-gray-50 rounded-xl p-4 border-l-4 border-orange">
                    <div className="flex items-center gap-2 mb-2">
                      <i className={`fas ${item.icon} text-orange`} />
                      <h4 className="font-montserrat font-bold text-navy text-sm">{item.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary">
                Learn More About Us <i className="fas fa-arrow-right" />
              </Link>
            </div>
            <div data-aos="fade-left" className="relative">
              <img src="/assets/images/prayer1.jpg" alt="MUTCU Community"
                className="rounded-2xl shadow-2xl w-full object-cover h-96"
                onError={e => { e.target.src = 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=800' }} />
              <div className="absolute -bottom-6 -left-6 bg-orange rounded-2xl p-4 shadow-xl">
                <div className="font-montserrat font-black text-white text-2xl">FOCUS</div>
                <div className="text-white/80 text-xs">Kenya Affiliated</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-navy rounded-2xl p-4 shadow-xl">
                <div className="font-montserrat font-black text-orange text-2xl">MUT</div>
                <div className="text-white/80 text-xs">Christian Union</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Values ──────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Core Values" subtitle="The values that shape our culture, our leadership, and how we serve in MUT and beyond." center light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_VALUES.map((v, i) => (
              <div key={v.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                data-aos="zoom-in" data-aos-delay={i * 80}>
                <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center mb-4">
                  <i className={`${v.icon} text-orange text-xl`} />
                </div>
                <h4 className="font-montserrat font-bold text-white text-lg mb-2">{v.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ministries Preview ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Ministries" subtitle="Find your place to grow and to serve — each ministry exists to build believers and reach others." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {MINISTRIES_PREVIEW.map((m, i) => (
              <Link key={m.title} to={m.link}
                className="ministry-card group block"
                data-aos="zoom-in" data-aos-delay={i * 80}>
                <img src={m.image} alt={m.title}
                  onError={e => { e.target.src = 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=600' }} />
                <div className="ministry-card-overlay">
                  <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center mb-3">
                    <i className={`${m.icon} text-orange`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white text-lg mb-1">{m.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{m.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-orange text-sm font-semibold">
                    Learn More <i className="fas fa-arrow-right text-xs" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/ministries" className="btn-navy btn-lg">
              View All Ministries <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Upcoming Events ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Upcoming Service Highlights" subtitle="From our Sunday services and Friday fellowships — plan ahead and invite a friend." />
          {eventsLoading ? <LoadingSpinner text="Loading events..." /> : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {events.slice(0, 6).map((ev, i) => (
                <div key={ev.id} className="card" data-aos="fade-up" data-aos-delay={i * 80}>
                  {ev.image_url && (
                    <img src={ev.image_url} alt={ev.title} className="w-full h-44 object-cover"
                      onError={e => { e.target.style.display = 'none' }} />
                  )}
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-orange text-xs">{ev.service_type || 'EVENT'}</span>
                      {ev.date && <span className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    </div>
                    <h4 className="font-montserrat font-bold text-navy text-base mb-2">{ev.title}</h4>
                    {ev.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{ev.description}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {ev.time && <span><i className="fas fa-clock mr-1" />{ev.time}</span>}
                      {ev.location && <span><i className="fas fa-map-marker-alt mr-1" />{ev.location}</span>}
                      {ev.speaker && <span><i className="fas fa-microphone mr-1" />{ev.speaker}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-calendar-alt text-4xl mb-3 block" />
              <p>No upcoming events at this time. Check back soon!</p>
            </div>
          )}
          <div className="text-center">
            <Link to="/events" className="btn-primary btn-lg">
              View Full Program <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Prayer Request — AI Enhanced ────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/20 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                <i className="fas fa-praying-hands" /> Prayer Ministry
              </div>
              <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-4">Need Prayers?</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-6" />
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Our Prayer Ministry is here to support you in faith and intercession. Submit your request confidentially —
                our team will pray for you.
              </p>
              <div className="space-y-3 mb-6">
                {['Your request is kept confidential', 'Our Prayer Ministry intercedes for you', 'You may submit anonymously', 'Receive an AI-generated scripture encouragement instantly'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <i className="fas fa-check-circle text-teal" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-robot text-orange text-sm" />
                  <span className="font-montserrat font-bold text-white text-sm">AI-Powered Encouragement</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">After submitting your prayer request, our AI generates a personalized scripture-based word of encouragement just for you — powered by Google Gemini.</p>
              </div>
            </div>
            <div data-aos="fade-left">
              <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
                <AIPrayerForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionTitle title="What Our Members Say" subtitle="Hear from our members about their MUTCU experience." />
          <div className="relative bg-white rounded-2xl shadow-lg p-8 md:p-12" data-aos="fade-up">
            <i className="fas fa-quote-left text-orange text-4xl mb-6 block" />
            <p className="text-gray-700 text-xl leading-relaxed mb-6 italic">
              "{TESTIMONIALS[testimonialIdx].quote}"
            </p>
            <p className="font-montserrat font-bold text-navy">— {TESTIMONIALS[testimonialIdx].author}</p>
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'w-8 bg-orange' : 'w-2 bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gallery Preview ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Gallery" subtitle="Moments from our fellowship, services, events, and outreach activities." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {GALLERY_PREVIEW.map((g, i) => (
              <Link key={g.label} to="/gallery" className="gallery-item" data-aos="zoom-in" data-aos-delay={i * 80}>
                <img src={g.image} alt={g.label}
                  onError={e => { e.target.src = 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=600' }} />
                <div className="gallery-overlay">
                  <div className="text-white text-center">
                    <i className={`${g.icon} text-2xl mb-2 block`} />
                    <span className="font-montserrat font-bold text-sm">{g.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/gallery" className="btn-navy btn-lg">
              View Full Gallery <i className="fas fa-images" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ───────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center" data-aos="fade-up">
          <i className="fas fa-envelope-open-text text-white text-5xl mb-4 block" />
          <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-3">Stay Connected</h2>
          <p className="text-white/90 text-lg mb-8">Subscribe for updates on services, programs, devotionals, and ministry opportunities.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="your.email@example.com" required
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white transition-colors" />
            <button type="submit" disabled={newsletterSubmitting}
              className="px-6 py-3 bg-navy hover:bg-navy-light text-white font-montserrat font-bold rounded-xl transition-colors disabled:opacity-60">
              {newsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
    </>
  )
}