import { useState } from 'react'
import { Link } from 'react-router-dom'
import MinistryPage from '../../components/MinistryPage'
import SectionTitle from '../../components/SectionTitle'
import toast from 'react-hot-toast'

const SUB_MINISTRIES = [
  {
    icon: 'fa-users',
    title: 'Choir',
    image: '/assets/images/music2.jpg',
    description: 'The MUTCU Choir leads congregational singing and presents special hymns and contemporary worship songs. They are dedicated to vocal excellence and harmonious praise, enhancing our services.',
    activities: [
      'Weekly rehearsals for Sunday services and special events.',
      'Learning new songs and arrangements.',
      'Performing during weekly fellowships and major Union events.',
    ],
    meeting: 'Saturdays, 2:00 PM – 4:00 PM (Room 7) — Other times confirmed weekly.',
  },
  {
    icon: 'fa-microphone-alt',
    title: 'Praise & Worship',
    image: '/assets/images/music2.jpg',
    description: 'The team leads the congregation in contemporary worship songs, cultivating an energetic and intimate atmosphere of praise.',
    activities: [
      'Vocal practice and harmony training sessions.',
      'Leading praise and worship during weekly fellowships and Sunday services.',
      'Preparing worship sets for special events like MULEWO and Praise Fests.',
    ],
    meeting: 'Tuesday, 7:00 PM – 9:00 PM (Tuition Block).',
  },
  {
    icon: 'fa-drum',
    title: 'Band',
    image: '/assets/images/band1.jpg',
    description: 'The Band forms the core instrumental support, providing the primary rhythm and melodic foundation for corporate worship.',
    activities: [
      'Regular practice sessions for band members.',
      'Providing instrumental backing for the Praise and Worship team.',
      'Performing during weekly fellowships and special events.',
    ],
    meeting: 'Wednesday, 7:00 PM – 9:00 PM (Confirmed weekly).',
  },
  {
    icon: 'fa-broadcast-tower',
    title: 'Outreach & Production',
    image: '/assets/images/music2.jpg',
    description: 'This ministry supervises music-related responsibilities outside the main music ministry, handles recording and production of music content, and nurtures emerging musical talents through auditions and mentorship.',
    activities: [
      'Conducting singing auditions to identify and train talent.',
      'Recording and producing music content in collaboration with Technical & Media Ministry.',
      'Mentoring aspiring musicians in the Union.',
      'Managing music-related outreach activities.',
    ],
    meeting: 'As scheduled with Technical & Media Ministry.',
  },
]

const FEATURED_EVENTS = [
  { icon: 'fa-star', title: 'Praise Fest', description: 'A special service dedicated to high-energy praise and worship, featuring ministrations from all Music Ministry teams.', when: 'Friday services' },
  { icon: 'fa-holly-berry', title: 'Christmas Cantata', description: 'A collaborative worship experience with the Creative Arts Ministry, celebrating the birth of Jesus through a blend of music and drama.', when: 'December' },
  { icon: 'fa-hand-holding-heart', title: 'Worship Experiences', description: 'Special worship services held throughout the semester, providing opportunities for deep spiritual worship.', when: 'Weekly (Friday Services)' },
  { icon: 'fa-music', title: 'MULEWO', description: 'An all-night worship experience that draws the entire Union together in extended praise, prayer, and musical ministry.', when: 'Semester highlight' },
]

const KEY_RESPONSIBILITIES = [
  { icon: 'fa-cross', title: 'Spiritual Direction', desc: 'Providing spiritual and artistic leadership for the entire music ministry.' },
  { icon: 'fa-check-circle', title: 'Quality Assurance', desc: 'Ensuring overall quality, theological depth, and doctrinal soundness of worship.' },
  { icon: 'fa-users', title: 'Team Mentoring', desc: 'Mentoring and supporting music team leaders for effective ministry.' },
  { icon: 'fa-calendar-check', title: 'Coordination', desc: 'Coordinating the overall music schedule and serving as the link to Executive Council.' },
]

export default function MusicMinistryPage() {
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.interest) return toast.error('Please fill in all required fields')
    setSubmitting(true)
    // Simulate submission (connect to backend if needed)
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setSubmitting(false)
    toast.success('Thank you for your interest! We will be in touch soon.')
  }

  return (
    <div>
      {/* Hero */}
      <section className="page-hero" style={{ backgroundImage: "url('/assets/images/music2.jpg')" }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
            MUTCU Ministry
          </div>
          <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">MUTCU Music Ministry</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">Leading Worship and Glorifying God Through Songs</p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                <i className="fas fa-music" /> About the Ministry
              </div>
              <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Music Ministry</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-6" />

              <div className="mb-5">
                <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                <p className="text-gray-600 leading-relaxed">To lead the congregation in authentic, biblical, and excellent worship through music.</p>
              </div>
              <div className="mb-5">
                <h5 className="font-montserrat font-bold text-navy mb-2">Our Mission</h5>
                <p className="text-gray-600 leading-relaxed">The Music Ministry of MUTCU is dedicated to leading the Union in vibrant and spiritually uplifting worship experiences. Through multiple music teams including the choir, band, praise and worship leaders, and instrumentalists, we create an atmosphere where members can connect with God and express their faith through song.</p>
              </div>
              <div>
                <h5 className="font-montserrat font-bold text-navy mb-2">Our Commitment</h5>
                <ul className="space-y-2">
                  {['Ensuring theological depth and doctrinal soundness in all worship', 'Maintaining excellence in musical quality and presentation', 'Using music as a powerful tool for worship, evangelism, and edification', 'Developing musicians and worship leaders for ministry impact'].map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{c}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/committees/music" className="btn-primary mt-6 inline-flex">
                <i className="fas fa-user-tie" /> Meet the Coordinator
              </Link>
            </div>
            <div data-aos="fade-left">
              <img src="/assets/images/music2.jpg" alt="Music Ministry" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Ministries */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Music Sub-Ministries" subtitle="The Music Ministry comprises four sub-committees, each dedicated to a specific aspect of worship and musical excellence." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SUB_MINISTRIES.map((sub, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                data-aos="fade-up" data-aos-delay={i * 80}>
                <img src={sub.image} alt={sub.title} className="w-full h-44 object-cover"
                  onError={e => { e.target.src = '/assets/images/music2.jpg' }} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${sub.icon} text-orange`} />
                    </div>
                    <h3 className="font-montserrat font-bold text-navy text-lg">{sub.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{sub.description}</p>
                  <h6 className="font-montserrat font-bold text-navy text-sm mb-2">Activities:</h6>
                  <ul className="space-y-1 mb-4">
                    {sub.activities.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-500 text-sm">
                        <i className="fas fa-chevron-right text-orange text-xs mt-1 flex-shrink-0" />{a}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                    <i className="fas fa-clock text-orange flex-shrink-0" />
                    <span><strong>Meeting Times:</strong> {sub.meeting}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Featured Events" subtitle="The Music Ministry plays a vital role in some of MUTCU's most anticipated events." center light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_EVENTS.map((ev, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                data-aos="zoom-in" data-aos-delay={i * 80}>
                <i className={`fas ${ev.icon} text-orange text-3xl mb-4 block`} />
                <h4 className="font-montserrat font-bold text-white text-lg mb-2">{ev.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed mb-3">{ev.description}</p>
                <div className="text-orange text-xs font-semibold flex items-center gap-1">
                  <i className="fas fa-calendar-alt" />{ev.when}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Responsibilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Key Responsibilities" subtitle="The Music Coordinator provides executive oversight and spiritual direction for all music ministry activities." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {KEY_RESPONSIBILITIES.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all"
                data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center mb-3">
                  <i className={`fas ${r.icon} text-orange`} />
                </div>
                <h5 className="font-montserrat font-bold text-navy mb-2">{r.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-montserrat font-black text-white text-3xl mb-3">Join Our Music Ministry!</h2>
            <p className="text-white/60 text-lg">If you have a passion for worship through music and want to lead others in encountering God, we invite you to join one of our music sub-ministries.</p>
          </div>
          {submitted ? (
            <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-10">
              <i className="fas fa-check-circle text-teal text-5xl mb-4 block" />
              <p className="text-white text-lg font-montserrat font-bold mb-2">Thank you for your interest!</p>
              <p className="text-white/60">We've received your submission and will get in touch with you soon.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline-white btn-sm mt-5">Submit Another Response</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-white/80">Full Name <span className="text-orange">*</span></label>
                  <input className="form-input bg-white/10 border-white/20 text-white placeholder-white/40" placeholder="Your full name"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label text-white/80">Email <span className="text-orange">*</span></label>
                  <input type="email" className="form-input bg-white/10 border-white/20 text-white placeholder-white/40" placeholder="Your university email"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="form-label text-white/80">Sub-Ministry of Interest <span className="text-orange">*</span></label>
                <select className="form-select bg-white/10 border-white/20 text-white" value={form.interest}
                  onChange={e => setForm(f => ({ ...f, interest: e.target.value }))} required>
                  <option value="" className="text-navy">Select an area...</option>
                  <option value="choir" className="text-navy">Choir Ministry</option>
                  <option value="praise-worship" className="text-navy">Praise & Worship Ministry</option>
                  <option value="band" className="text-navy">Band Ministry</option>
                  <option value="outreach" className="text-navy">Outreach & Production Ministry</option>
                  <option value="general" className="text-navy">General Interest</option>
                </select>
              </div>
              <div>
                <label className="form-label text-white/80">Tell us about your musical experience or passion (Optional)</label>
                <textarea className="form-textarea bg-white/10 border-white/20 text-white placeholder-white/40" rows={3}
                  placeholder="Share your musical background and why you're interested..."
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                {submitting ? <><i className="fas fa-spinner fa-spin" /> Submitting...</> : <><i className="fas fa-paper-plane" /> Submit Interest</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}