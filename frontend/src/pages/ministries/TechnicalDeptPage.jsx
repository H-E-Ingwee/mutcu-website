import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.7 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'Technical & Media Ministry Coordinator (Chairperson)',
  'Secretary/Treasurer',
  'Sub-ministry Leaders',
]

const CHAIRPERSON_ROLES = [
  'Oversees all technical and media operations, ensuring a high standard of quality.',
  'Ensures all equipment is well-maintained and that all technical operators are well-trained.',
  'Develops the long-term technical strategy for the CU.',
]

const SECRETARY_ROLES = [
  'Handles committee administration, including creating volunteer schedules, managing equipment inventory, and taking minutes.',
  'Manages the budget for equipment purchases, repairs, software subscriptions, and publicity materials.',
  'Shall be the principal assistant of the chairperson.',
]

const SUB_MINISTRIES = [
  {
    icon: 'fa-volume-up',
    title: 'Sound Ministry',
    color: 'border-orange',
    roles: [
      {
        title: 'Sound Ministry Coordinator',
        duties: [
          'Responsible for all aspects of sound reinforcement, including equipment setup, sound engineering during services, recording of sermons, and training of sound technicians.',
        ],
      },
      {
        title: 'Assistant Sound Ministry Coordinator',
        duties: [
          'Shall be the principal assistant of the sound coordinator and manage all asset inventory.',
        ],
      },
    ],
  },
  {
    icon: 'fa-hands-helping',
    title: 'Ushering Ministry',
    color: 'border-teal',
    roles: [
      {
        title: 'Ushering Ministry Coordinator',
        duties: [
          'Leads the ushering team, responsible for creating a welcoming atmosphere and ensuring orderly seating.',
          'Overseeing the collecting the offering, and managing the smooth flow of services.',
        ],
      },
      {
        title: 'Assistant Ushering Ministry Coordinator',
        duties: [
          'Shall be the principal assistant of the coordinator.',
          'Shall be the custodian of all the asset belonging to the ushering ministry.',
        ],
      },
    ],
  },
  {
    icon: 'fa-bullhorn',
    title: 'Publicity (MBBC) Ministry',
    color: 'border-orange',
    roles: [
      {
        title: 'Publicity Ministry Coordinator',
        duties: [
          'Shall publicize all the events of The CU in accordance with all the recommendations of the committee.',
          'Shall be the custodian of all publicity materials and equipment of The Union.',
          'Shall convene and chair the Publicity ministry meetings.',
          'Shall be the link between the Publicity ministry and the Technical Committee.',
          'Shall plan, coordinate and oversee all the Publicity ministry activities and events.',
          'Shall coordinate the nomination of all the Publicity ministry departmental leaders.',
        ],
      },
      {
        title: 'Assistant Publicity Ministry Coordinator',
        duties: [
          'Shall be the principal assistant to the coordinator.',
          'Shall be the custodian of all publicity materials and equipment of The Union.',
          'Shall keep records of members attendance and responsibilities.',
        ],
      },
    ],
  },
  {
    icon: 'fa-laptop',
    title: 'Digital Ministry',
    color: 'border-teal',
    roles: [
      {
        title: 'Digital Ministry Coordinator',
        duties: [
          "Shall manage the CU's website, all social media platforms, livestreaming operations, and the creation of digital content (videos, graphics).",
          'Shall oversee the training of members in the relevant skills for the ministry.',
          'Shall ensure the Digital Ministry policies are upheld as per the policy framework.',
        ],
      },
      {
        title: 'Assistant Digital Ministry Coordinator',
        duties: [
          'Shall be the principal assistant to the coordinator.',
          'Shall be the custodian of all Digital ministry asset of The Union.',
          'Shall keep records of members attendance and responsibilities.',
        ],
      },
    ],
  },
]

export default function TechnicalDeptPage() {
  return (
    <>
      <SEO
        title="Technical & Media Department | MUTCU"
        description="MUTCU Technical & Media Ministry — Sound, Ushering, Publicity (MBBC), and Digital Ministry at Murang'a University of Technology Christian Union."
        url="/ministries/technical-department"
        keywords="MUTCU technical ministry, MUTCU media, MBBC MUTCU, Murang'a University Christian Union technical, MUTCU sound ministry, MUTCU digital ministry"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/technicalDpt.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.7
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Technical & Media Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Supporting Worship Through Technology and Service</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.7</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Technical & Media Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To provide excellent and seamless technical and media support for all CU activities and to manage the Union's digital presence effectively."</p>
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
                  <h5 className="font-montserrat font-bold text-navy mb-2">Chairperson (Technical & Media Ministry Coordinator)</h5>
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
            <SectionTitle title="Sub-Ministries & Leadership Roles" subtitle="The Technical & Media Ministry comprises four specialized sub-committees. — Leadership Manual 2025, Part 3.7.4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SUB_MINISTRIES.map((sub, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${sub.color} p-6 hover:shadow-lg transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${sub.icon} text-orange`} />
                    </div>
                    <h3 className="font-montserrat font-bold text-navy text-lg">{sub.title}</h3>
                  </div>
                  <div className="space-y-3">
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
              ))}
            </div>
          </div>
        </section>

        {/* Social Media */}
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
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Technical & Media Ministry</h3>
            <p className="text-white/60 mb-6">If you have skills or interest in sound, ushering, publicity, or digital media — we want you on the team.</p>
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