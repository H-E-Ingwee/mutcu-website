import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

const SUB_MINISTRIES = [
  {
    icon: 'fa-volume-up', title: 'Sound Ministry',
    description: 'Manages all audio equipment and sound engineering for services and events, ensuring clear and balanced sound for worship and speaking.',
    activities: ['Setting up and operating sound systems for all services.', 'Mixing audio for live worship, speakers, and special events.', 'Maintaining and troubleshooting audio equipment.', 'Training new sound engineers.'],
    meeting: 'As scheduled — confirmed weekly.',
  },
  {
    icon: 'fa-video', title: 'Livestream & Video',
    description: 'Handles all video recording, livestreaming, and video production for MUTCU services and events, extending our reach to online audiences.',
    activities: ['Livestreaming Sunday services and Friday fellowships.', 'Recording and editing video content for social media.', 'Managing camera operations during services and events.', "Producing video content for the Union's digital platforms."],
    meeting: 'As scheduled — confirmed weekly.',
  },
  {
    icon: 'fa-desktop', title: 'Projection & Visuals',
    description: 'Manages all projection systems, slides, and visual displays, ensuring that lyrics, scriptures, and presentations are displayed clearly during services.',
    activities: ['Preparing and displaying song lyrics and scripture slides.', 'Managing presentation slides for speakers and events.', 'Operating projection systems during all services.', 'Creating visual content for services and events.'],
    meeting: 'As scheduled — confirmed weekly.',
  },
  {
    icon: 'fa-paint-brush', title: 'Publicity & Design',
    description: "Manages MUTCU's digital presence, social media platforms, and creates graphic design content for all Union communications and events.",
    activities: ['Designing posters, banners, and digital content for events.', "Managing MUTCU's social media accounts (Facebook, Instagram, TikTok, YouTube).", 'Creating and distributing digital announcements and newsletters.', 'Maintaining consistent brand identity across all platforms.'],
    meeting: 'As scheduled with the Technical Coordinator.',
  },
]

const KEY_RESPONSIBILITIES = [
  { icon: 'fa-cogs', title: 'Technical Excellence', desc: 'Maintaining high technical quality in all productions and services.' },
  { icon: 'fa-globe', title: 'Digital Presence', desc: "Ensuring consistent and positive brand identity online across all platforms." },
  { icon: 'fa-graduation-cap', title: 'Training & Equipping', desc: 'Training and equipping technical volunteers for effective ministry.' },
  { icon: 'fa-hands-helping', title: 'Ministry Support', desc: 'Supporting worship, events, and evangelism through excellent technical service.' },
]

export default function TechnicalDeptPage() {
  return (
    <>
      <SEO
        title="Technical & Media Department | MUTCU"
        description="MUTCU Technical & Media Ministry — sound, livestream, projection, publicity, and digital presence at Murang'a University of Technology Christian Union."
        url="/ministries/technical-department"
        keywords="MUTCU technical ministry, MUTCU media, Murang'a University Christian Union technical, MUTCU sound ministry"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/technicalDpt.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">MUTCU Technical Department</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Supporting Worship Through Technology and Service</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                  <i className="fas fa-photo-video" /> About the Ministry
                </div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Technical & Media Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-6" />
                <div className="mb-5">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed">To provide excellent and seamless technical and media support for all CU activities and to manage the Union's digital presence effectively.</p>
                </div>
                <div className="mb-5">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Our Mission</h5>
                  <p className="text-gray-600 leading-relaxed">The Technical & Media Ministry ensures that all technical aspects of MUTCU's services and events — including sound, visuals, live streaming, publicity, and digital communication — are executed with excellence, supporting the worship experience and enhancing our outreach impact.</p>
                </div>
                <div>
                  <h5 className="font-montserrat font-bold text-navy mb-2">Our Commitment</h5>
                  <ul className="space-y-2">
                    {['Maintaining high technical quality in all productions', 'Ensuring consistent and positive brand identity online', 'Training and equipping technical volunteers', 'Supporting worship, events, and evangelism through excellent technical service'].map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/committees/technical" className="btn-primary mt-6 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Coordinator
                </Link>
              </div>
              <div data-aos="fade-left">
                <img src="/assets/images/technicalDpt.jpg" alt="Technical Department" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Ministries */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Our Technical Sub-Ministries" subtitle="The ministry comprises four specialized sub-committees, each with distinct technical responsibilities. — Leadership Manual Part 3.7" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SUB_MINISTRIES.map((sub, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                    <i className={`fas ${sub.icon} text-orange text-xl`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-navy mb-2">{sub.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{sub.description}</p>
                  <h6 className="font-montserrat font-bold text-navy text-xs mb-2 uppercase tracking-wider">Activities:</h6>
                  <ul className="space-y-1 mb-4">
                    {sub.activities.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-500 text-xs">
                        <i className="fas fa-chevron-right text-orange text-xs mt-0.5 flex-shrink-0" />{a}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 rounded-xl p-2.5">
                    <i className="fas fa-clock text-orange flex-shrink-0" />
                    <span>{sub.meeting}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Responsibilities */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Key Responsibilities" subtitle="The Technical Coordinator provides oversight and direction for all technical and media activities." center light />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KEY_RESPONSIBILITIES.map((r, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                  data-aos="zoom-in" data-aos-delay={i * 80}>
                  <i className={`fas ${r.icon} text-orange text-3xl mb-4 block`} />
                  <h5 className="font-montserrat font-bold text-white mb-2">{r.title}</h5>
                  <p className="text-white/60 text-sm leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center" data-aos="fade-up">
            <SectionTitle title="Follow MUTCU Online" subtitle="Stay connected with MUTCU's digital platforms managed by the Technical & Media Ministry." />
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: 'fab fa-facebook-f', label: 'Facebook', url: 'https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/', color: 'bg-blue-600' },
                { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://www.instagram.com/muranga_university_cu/', color: 'bg-pink-600' },
                { icon: 'fab fa-tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@mutcu001', color: 'bg-gray-900' },
                { icon: 'fab fa-youtube', label: 'YouTube', url: 'https://www.youtube.com/@murangauniversityCU', color: 'bg-red-600' },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={`${s.color} text-white px-5 py-3 rounded-xl flex items-center gap-2 font-montserrat font-bold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5`}>
                  <i className={s.icon} />{s.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Technical Ministry</h3>
            <p className="text-white/60 mb-6">If you have skills or interest in sound, video, design, or social media — we want you on the team.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary">Join MUTCU</Link>
              <Link to="/contact" className="btn-outline-white">Contact Us</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}