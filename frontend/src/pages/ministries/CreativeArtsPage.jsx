import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'
import toast from 'react-hot-toast'

// ─── Exact from Leadership Manual 2025, Part 3.6 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'Creative Arts Ministry Coordinator (Chairperson)',
  'Secretary/Treasurer',
  'Sub-Ministry Coordinators',
]

const CHAIRPERSON_ROLES = [
  'Serves as the overall artistic and spiritual director for the creative arts ministry.',
  'Coordinates major creative events like Creative Night and ensures all presentations are excellent and biblically sound.',
  'Mentors and provides guidance to the leaders of the creative sub-ministries.',
  'Shall coordinate and oversee Transformation and Advocacy campaigns in the Christian Union.',
]

const SECRETARY_ROLES = [
  'Handles all administrative tasks, including minutes, communication, and maintaining a database of ministry members.',
  'She is responsible of asset management in the ministry.',
  'Manages the committee\'s budget, including funds for costumes, props, and production expenses.',
]

const SUB_MINISTRIES = [
  {
    icon: 'fa-theater-masks',
    title: 'Drama Ministry',
    color: 'border-orange',
    image: '/assets/images/drama2.JPG',
    roles: [
      {
        title: 'Drama Ministry Coordinator',
        duties: [
          'Leads the drama team, directs plays, oversees scriptwriting, and develops the acting skills of members.',
          'Shall coordinate the drama team\'s activities and trainings.',
          'Shall be the link between the drama ministry and the Creative Arts Ministry Committee.',
        ],
      },
      {
        title: 'Assistant Drama Ministry Coordinator',
        duties: [
          'He or she shall be the principal assistant to the Drama Ministry Leader.',
          'He or she shall be in charge of all drama ministry records and assets.',
        ],
      },
    ],
  },
  {
    icon: 'fa-running',
    title: 'Dance Ministry',
    color: 'border-teal',
    image: '/assets/images/dance3.jpg',
    roles: [
      {
        title: 'Dance Ministry Coordinator',
        duties: [
          'Leads and choreographs for the dance team ensuring all music and movements are appropriate for worship and minister to the congregation.',
          'Shall be the link between the dance ministry and the Creative Arts Ministry Committee.',
        ],
      },
      {
        title: 'Assistant Dance Ministry Coordinator',
        duties: [
          'Shall be the principal assistant to the dance ministry coordinator.',
          'Shall be responsible for keeping of all the ministerial records.',
        ],
      },
    ],
  },
  {
    icon: 'fa-microphone-alt',
    title: 'SPARCS Ministry',
    subtitle: '(Spoken Word, Poetry, Arts & Creative Skits)',
    color: 'border-orange',
    image: '/assets/images/cream1.JPG',
    roles: [
      {
        title: 'SPARCS Ministry Coordinator',
        duties: [
          'Coordinates all spoken word, poetry, and fine arts presentations.',
          'Mentors members in creative writing and ministrations.',
          'Shall be the link between the SPARCS ministry and the Creative Arts Ministry Committee.',
        ],
      },
      {
        title: 'Assistant SPARCS Ministry Coordinator',
        duties: [
          'Shall be the principal assistant to the SPARCS ministry coordinator.',
          'Shall be responsible for keeping of all the ministerial records.',
        ],
      },
    ],
  },
  {
    icon: 'fa-tshirt',
    title: 'Models Ministry',
    color: 'border-teal',
    image: '/assets/images/MODELS.jpg',
    roles: [
      {
        title: 'Mr. & Miss MUTCU',
        duties: [
          'Shall serve as the official leaders and coordinators of the Models Ministry.',
          'They act as ambassadors for the CU, promoting Christian character and values through fashion and creative ministrations.',
          'Shall spearhead and organize for Social Action and Transformation campaigns and activities within and beyond the institution in partnership with FOCUS.',
        ],
      },
    ],
  },
]

const FEATURED_EVENTS = [
  { icon: 'fa-film', title: 'Film Premiere', desc: "MUTCU's annual film premiere showcasing original productions that communicate the Gospel through cinematic storytelling.", when: 'Semester highlight' },
  { icon: 'fa-theater-masks', title: 'Mega Play', desc: 'A full-scale theatrical production featuring drama, dance, spoken word, and music — one of the most anticipated events of the semester.', when: 'Semester highlight' },
  { icon: 'fa-holly-berry', title: 'Christmas Cantata', desc: 'A collaborative worship experience with the Music Ministry, celebrating the birth of Jesus through a blend of music, drama, and creative arts.', when: 'December' },
  { icon: 'fa-star', title: 'Creative Night / Experience', desc: 'A dedicated Friday fellowship where the Creative Arts Ministry leads the Union in a night of artistic worship and expression.', when: 'Friday services' },
]

export default function CreativeArtsPage() {
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
    toast.success('Thank you for your interest in CREAM! We will be in touch soon.')
  }

  return (
    <>
      <SEO
        title="Creative Arts Ministry (CREAM) | MUTCU"
        description="MUTCU Creative Arts Ministry (CREAM) — Drama, Dance, SPARCS (Spoken Word, Poetry, Arts & Creative Skits), and Models Ministry at Murang'a University of Technology Christian Union."
        url="/ministries/creative-arts"
        keywords="MUTCU CREAM, MUTCU creative arts, MUTCU drama, MUTCU dance, SPARCS MUTCU, Murang'a University Christian Union arts"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/dance3.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.6
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Creative Arts Ministry (CREAM)</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Inspiring Love, Hope & Godliness Through Artistic Expression</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.6</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Creative Arts Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To use diverse artistic gifts to glorify God, edify the church, and communicate the gospel in a compelling way."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMMITTEE_COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['a', 'b', 'c'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Chairperson (Creative Arts Ministry Coordinator)</h5>
                  <ul className="space-y-2">
                    {CHAIRPERSON_ROLES.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-montserrat font-bold text-navy mb-2">Secretary/Treasurer</h5>
                  <ul className="space-y-2">
                    {SECRETARY_ROLES.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/committees/creative" className="btn-primary mt-6 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Coordinator
                </Link>
              </div>
              <div data-aos="fade-left" className="space-y-4">
                <img src="/assets/images/dance3.jpg" alt="Creative Arts Ministry" className="rounded-2xl shadow-2xl w-full h-56 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                <div className="grid grid-cols-2 gap-3">
                  <img src="/assets/images/drama2.JPG" alt="Drama Ministry" className="rounded-xl shadow-lg w-full h-32 object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                  <img src="/assets/images/MODELS.jpg" alt="Models Ministry" className="rounded-xl shadow-lg w-full h-32 object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Ministries */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Sub-Ministries & Leadership Roles" subtitle="The Creative Arts Ministry comprises four sub-committees, each dedicated to a unique form of artistic expression and worship. — Leadership Manual 2025, Part 3.6.4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SUB_MINISTRIES.map((sub, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${sub.color} overflow-hidden hover:shadow-lg transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <img src={sub.image} alt={sub.title} className="w-full h-40 object-cover"
                    onError={e => { e.target.src = '/assets/images/dance3.jpg' }} />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${sub.icon} text-orange`} />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-bold text-navy text-lg leading-tight">{sub.title}</h3>
                        {sub.subtitle && <p className="text-orange text-xs font-semibold">{sub.subtitle}</p>}
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Featured Events" subtitle="The Creative Arts Ministry leads some of MUTCU's most powerful and memorable events." center light />
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
              <h2 className="font-montserrat font-black text-white text-3xl mb-3">Join CREAM!</h2>
              <p className="text-white/60 text-lg">If you have a passion for creative expression and want to use your gifts for God's glory, we invite you to join the Creative Arts Ministry.</p>
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
                    <option value="drama" className="text-navy">Drama Ministry</option>
                    <option value="dance" className="text-navy">Dance Ministry</option>
                    <option value="sparcs" className="text-navy">SPARCS Ministry (Spoken Word, Poetry, Arts & Creative Skits)</option>
                    <option value="models" className="text-navy">Models Ministry</option>
                    <option value="general" className="text-navy">General Interest</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-white/80">Tell us about your creative experience or passion (Optional)</label>
                  <textarea className="form-textarea bg-white/10 border-white/20 text-white placeholder-white/40" rows={3}
                    placeholder="Share your creative background and why you're interested..."
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