import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import toast from 'react-hot-toast'

const SUB_MINISTRIES = [
  {
    icon: 'fa-theater-masks',
    title: 'Drama Ministry',
    image: '/assets/images/drama2.JPG',
    description: 'Communicates biblical truths and Christian values through powerful theatrical presentations and character-driven storytelling that moves and transforms audiences.',
    activities: [
      'Scriptwriting and directing original dramas.',
      'Character development and acting skill training.',
      'Performing during services, events, and special occasions.',
    ],
    meeting: 'Thursdays, 7:00 PM – 9:00 PM (Confirmed weekly).',
  },
  {
    icon: 'fa-running',
    title: 'Dance Ministry',
    image: '/assets/images/dance3.jpg',
    description: 'Expresses worship and communicates the Gospel through movement, using various dance styles to glorify God and minister to audiences.',
    activities: [
      'Choreography development and dance training.',
      'Performing during services, events, and outreach programs.',
      'Participating in inter-CU creative events and competitions.',
    ],
    meeting: 'Thursdays, 7:00 PM – 9:00 PM (Confirmed weekly).',
  },
  {
    icon: 'fa-microphone-alt',
    title: 'Spoken Word & Poetry',
    image: '/assets/images/cream1.JPG',
    description: 'Uses the power of spoken word, poetry, and storytelling to communicate faith, hope, and the Gospel in a compelling and relatable way.',
    activities: [
      'Writing and performing original spoken word pieces.',
      'Poetry slams and creative writing workshops.',
      'Ministering at services, events, and outreach programs.',
    ],
    meeting: 'As scheduled with the Creative Arts Coordinator.',
  },
  {
    icon: 'fa-tshirt',
    title: 'Modelling & Fine Arts',
    image: '/assets/images/MODELS.jpg',
    description: 'Promotes dignity, identity in Christ, and creative expression through Christ-centred modelling and fine arts, leading transformation and advocacy campaigns.',
    activities: [
      'Modelling training and runway presentations.',
      'Fine arts exhibitions and creative showcases.',
      'Leading Transformation and Advocacy (TLA) campaigns.',
      'Supporting social action and Christian witness.',
    ],
    meeting: 'As scheduled with the Creative Arts Coordinator.',
  },
]

const FEATURED_EVENTS = [
  { icon: 'fa-film', title: 'Film Premiere', description: "MUTCU's annual film premiere showcasing original productions that communicate the Gospel through cinematic storytelling.", when: 'Semester highlight' },
  { icon: 'fa-theater-masks', title: 'Mega Play', description: 'A full-scale theatrical production featuring drama, dance, spoken word, and music — one of the most anticipated events of the semester.', when: 'Semester highlight' },
  { icon: 'fa-holly-berry', title: 'Christmas Cantata', description: 'A collaborative worship experience with the Music Ministry, celebrating the birth of Jesus through a blend of music, drama, and creative arts.', when: 'December' },
  { icon: 'fa-star', title: 'Creative Night / Experience', description: 'A dedicated Friday fellowship where the Creative Arts Ministry leads the Union in a night of artistic worship and expression.', when: 'Friday services' },
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
      <section className="relative overflow-hidden" style={{ backgroundImage: "url('/assets/images/dance3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
            MUTCU Ministry
          </div>
          <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">MUTCU Creative Arts Ministry</h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">Inspiring Love, Hope & Godliness Through Artistic Expression</p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                <i className="fas fa-theater-masks" /> About the Ministry
              </div>
              <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Creative Arts Ministry</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-6" />
              <div className="mb-5">
                <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                <p className="text-gray-600 leading-relaxed">To use diverse artistic gifts to glorify God, edify the church, and communicate the gospel in a compelling way.</p>
              </div>
              <div className="mb-5">
                <h5 className="font-montserrat font-bold text-navy mb-2">Our Mission</h5>
                <p className="text-gray-600 leading-relaxed">The Creative Arts Ministry uses drama, dance, spoken word, poetry, fine arts, and modeling to express faith and reach our community with the Gospel. We believe that artistic expression is a powerful medium for worship, evangelism, and spiritual growth.</p>
              </div>
              <div>
                <h5 className="font-montserrat font-bold text-navy mb-2">Our Focus</h5>
                <ul className="space-y-2">
                  {['Excellence in all creative presentations', 'Biblical soundness in all messaging and content', 'Developing artists as worshippers and witnesses', 'Leading Transformation and Advocacy campaigns', 'Supporting social action and Christian witness'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                      <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/committees/creative" className="btn-primary mt-6 inline-flex">
                <i className="fas fa-user-tie" /> Meet the Coordinator
              </Link>
            </div>
            <div data-aos="fade-left">
              <img src="/assets/images/dance3.jpg" alt="Creative Arts Ministry" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Ministries */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Creative Arts Sub-Ministries" subtitle="The Creative Arts Ministry comprises four sub-committees, each dedicated to a unique form of artistic expression and worship." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SUB_MINISTRIES.map((sub, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                data-aos="fade-up" data-aos-delay={i * 80}>
                <img src={sub.image} alt={sub.title} className="w-full h-44 object-cover"
                  onError={e => { e.target.src = '/assets/images/dance3.jpg' }} />
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
          <SectionTitle title="Featured Events" subtitle="The Creative Arts Ministry leads some of MUTCU's most powerful and memorable events." center light />
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
                <label className="form-label text-white/80">Area of Interest <span className="text-orange">*</span></label>
                <select className="form-select bg-white/10 border-white/20 text-white" value={form.interest}
                  onChange={e => setForm(f => ({ ...f, interest: e.target.value }))} required>
                  <option value="" className="text-navy">Select an area...</option>
                  <option value="drama" className="text-navy">Drama Ministry</option>
                  <option value="dance" className="text-navy">Dance Ministry</option>
                  <option value="spoken-word" className="text-navy">Spoken Word & Poetry</option>
                  <option value="modelling" className="text-navy">Modelling </option>
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
    </>
  )
}