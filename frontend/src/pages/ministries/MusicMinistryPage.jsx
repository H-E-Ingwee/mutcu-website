import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'
import toast from 'react-hot-toast'

// ─── Exact from Leadership Manual 2025, Part 3.3 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'Music Coordinator (Chairperson)',
  'Secretary/Treasurer',
  'Sub-Ministry Coordinators',
]

const SUB_MINISTRIES = [
  {
    icon: 'fa-microphone-alt',
    title: 'Praise and Worship Ministry',
    color: 'border-orange',
    roles: [
      {
        title: 'Praise and Worship Coordinator',
        duties: [
          'Leads the team spiritually and musically, selects theologically sound songs, schedules and leads effective rehearsals, and mentors upcoming worship leaders.',
          'Shall be the link between the Praise and Worship Ministry and the Music Committee.',
        ],
      },
      {
        title: 'Assistant Praise and Worship Coordinator',
        duties: [
          'Assists the leader in all duties, oversees administrative needs, and leads in the coordinator\'s absence.',
          'Shall be the custodian of all the Praise and Worship ministry records.',
        ],
      },
    ],
    meeting: 'Tuesday, 7:00 PM – 9:00 PM (Tuition Block).',
  },
  {
    icon: 'fa-users',
    title: 'Choir Ministry',
    color: 'border-teal',
    roles: [
      {
        title: 'Choir Coordinator',
        duties: [
          'Directs the choir, selects and arranges music, and focuses on the vocal and spiritual development of choir members.',
          'Shall preside over its practice sessions.',
          'Shall be the link between the Choir Ministry and the Music Committee.',
        ],
      },
      {
        title: 'Assistant Choir Coordinator',
        duties: [
          'Assists the leader, manages choir assets and leads rehearsals.',
          'Shall be the custodian of all the Choir Ministry records.',
        ],
      },
    ],
    meeting: 'Saturdays, 2:00 PM – 4:00 PM (Room 7) — Other times confirmed weekly.',
  },
  {
    icon: 'fa-drum',
    title: 'Band Ministry',
    color: 'border-orange',
    roles: [
      {
        title: 'Band Coordinator',
        duties: [
          'Shall be responsible for coordinating the Band Ministry and preside over its practice sessions.',
          'Shall be the link between the Band Ministry and the Music Committee.',
          'Shall be responsible of all the musical instruments.',
        ],
      },
      {
        title: 'Assistant Band Coordinator',
        duties: [
          'He or she shall be the principal assistant to the Band Ministry Coordinator.',
          'He or she shall be the custodian of all the Band Ministry records.',
        ],
      },
    ],
    meeting: 'Wednesday, 7:00 PM – 9:00 PM (Confirmed weekly).',
  },
  {
    icon: 'fa-broadcast-tower',
    title: 'Outreach and Production Ministry',
    color: 'border-teal',
    roles: [
      {
        title: 'Music Outreach and Production Coordinator',
        duties: [
          'Shall supervise music-related responsibilities outside the main music ministry.',
          'Shall collaborate with the Technical and Media Ministry for the recording and production of music content.',
          'Shall be in charge of conducting singing auditions to nurture and train talents for the ministry.',
        ],
      },
      {
        title: 'Assistant Music Outreach and Production Coordinator',
        duties: [
          'He or she shall be the principal assistant to the Music Outreach and Production Coordinator.',
          'He or she shall be the custodian of all the Music Outreach and Production Ministry records.',
        ],
      },
    ],
    meeting: 'As scheduled with Technical & Media Ministry.',
  },
]

const FEATURED_EVENTS = [
  { icon: 'fa-star', title: 'Praise Fest', desc: 'A special service dedicated to high-energy praise and worship, featuring ministrations from all Music Ministry teams.', when: 'Friday services' },
  { icon: 'fa-holly-berry', title: 'Christmas Cantata', desc: 'A collaborative worship experience with the Creative Arts Ministry, celebrating the birth of Jesus through a blend of music and drama.', when: 'December' },
  { icon: 'fa-hand-holding-heart', title: 'Worship Experience', desc: 'Special worship services held throughout the semester, providing opportunities for deep spiritual worship.', when: 'Weekly (Friday Services)' },
  { icon: 'fa-music', title: 'MULEWO', desc: 'An all-night worship experience that draws the entire Union together in extended praise, prayer, and musical ministry.', when: 'Semester highlight' },
]

export default function MusicMinistryPage() {
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.interest) return toast.error('Please fill in all required fields')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setSubmitting(false)
    toast.success('Thank you for your interest! We will be in touch soon.')
  }

  return (
    <>
      <SEO
        title="Music Ministry | MUTCU"
        description="MUTCU Music Ministry — Praise & Worship, Choir, Band, and Outreach & Production leading authentic biblical worship at Murang'a University of Technology Christian Union."
        url="/ministries/music-ministry"
        keywords="MUTCU music ministry, MUTCU choir, MUTCU praise worship, MUTCU band, Murang'a University Christian Union music, MULEWO"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/music2.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.3
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Music Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Leading Worship and Glorifying God Through Songs</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.3</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Music Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To lead the congregation in authentic, biblical, and excellent worship through music."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMMITTEE_COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['i', 'ii', 'iii'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Chairperson (Music Coordinator) Roles</h5>
                  <ul className="space-y-2">
                    {['Provides spiritual and artistic direction for the entire music ministry.', 'Chairs all Music Committee meetings and coordinates the overall music schedule for CU services.', 'Organizes joint training and spiritual development sessions for all music teams.'].map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-montserrat font-bold text-navy mb-2">Secretary/Treasurer Roles</h5>
                  <ul className="space-y-2">
                    {['Handles all administrative tasks, including minutes, communication, and maintaining a database of ministry members.', 'Coordinates schedules and logistics for rehearsals and ministrations.', 'Manages the committee\'s budget, handling requests for equipment maintenance or purchase.', 'Keeps accurate financial records for the committee.'].map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/committees/music" className="btn-primary mt-6 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Music Coordinator
                </Link>
              </div>
              <div data-aos="fade-left">
                <img src="/assets/images/music2.jpg" alt="Music Ministry" className="rounded-2xl shadow-2xl w-full h-72 object-cover mb-4"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                <img src="/assets/images/band1.jpg" alt="Band Ministry" className="rounded-2xl shadow-xl w-full h-48 object-cover"
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Ministries */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Sub-Ministries & Leadership Roles" subtitle="The Music Ministry comprises four sub-committees, each dedicated to a specific aspect of worship and musical excellence. — Leadership Manual 2025, Part 3.3.4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SUB_MINISTRIES.map((sub, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${sub.color} overflow-hidden hover:shadow-lg transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${sub.icon} text-orange`} />
                      </div>
                      <h3 className="font-montserrat font-bold text-navy text-lg">{sub.title}</h3>
                    </div>
                    <div className="space-y-4">
                      {sub.roles.map((role, j) => (
                        <div key={j} className="bg-gray-50 rounded-xl p-4">
                          <h5 className="font-montserrat font-bold text-navy text-sm mb-2 flex items-center gap-2">
                            <i className="fas fa-user text-orange text-xs" />{role.title}
                          </h5>
                          <ul className="space-y-1.5">
                            {role.duties.map((d, k) => (
                              <li key={k} className="flex items-start gap-2 text-gray-600 text-xs leading-relaxed">
                                <i className="fas fa-chevron-right text-orange text-xs mt-0.5 flex-shrink-0" />{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-navy/5 rounded-xl p-3 mt-4">
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
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{ev.desc}</p>
                  <div className="text-orange text-xs font-semibold flex items-center gap-1">
                    <i className="fas fa-calendar-alt" />{ev.when}
                  </div>
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
                    <option value="" className="text-navy">Select a sub-ministry...</option>
                    <option value="praise-worship" className="text-navy">Praise and Worship Ministry</option>
                    <option value="choir" className="text-navy">Choir Ministry</option>
                    <option value="band" className="text-navy">Band Ministry</option>
                    <option value="outreach-production" className="text-navy">Outreach and Production Ministry</option>
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
    </>
  )
}