import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.4 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'Prayer Coordinator (Chairperson)',
  'Secretary/Treasurer',
  'Prayer Coordinators for each year of study',
  'Two Members',
]

const CHAIRPERSON_ROLES = [
  'Shall provide overall spiritual leadership for the prayer ministry.',
  'Shall plan and coordinate all corporate prayer meetings, prayer weeks, and fasting programs.',
  'Shall identify and communicate key prayer points for the CU.',
]

const SECRETARY_ROLES = [
  'Shall take minutes and handle all communications for the committee.',
  'Shall be responsible for compiling and distributing prayer requests and praise reports.',
  'Shall manage any financial resources allocated for prayer events, such as retreats or special materials.',
]

const YEAR_COORDINATORS = [
  {
    name: 'Anza FYT',
    label: 'First Years',
    icon: 'fa-seedling',
    color: 'border-orange',
    desc: 'Prayer champion and mobilizer for first-year students.',
  },
  {
    name: 'Endelea one',
    label: 'Second Years',
    icon: 'fa-leaf',
    color: 'border-teal',
    desc: 'Prayer champion and mobilizer for second-year students.',
  },
  {
    name: 'Endelea Two',
    label: 'Third Years',
    icon: 'fa-tree',
    color: 'border-orange',
    desc: 'Prayer champion and mobilizer for third-year students.',
  },
  {
    name: 'VUKA FiT',
    label: 'Finalists',
    icon: 'fa-graduation-cap',
    color: 'border-teal',
    desc: 'Prayer champion and mobilizer for finalist students.',
  },
]

const YEAR_COORDINATOR_ROLES = [
  'Shall be the prayer champions and mobilizers within their respective year groups.',
  'Shall organize and lead prayer sessions during their year\'s fellowship meetings.',
  'Shall gather prayer requests from their peers and forward them to the committee secretary.',
]

const PRAYER_ACTIVITIES = [
  { icon: 'fa-praying-hands', title: 'Weekly Prayer Meetings', desc: 'Regular corporate prayer sessions where members gather to intercede for the Union, campus, and nation.' },
  { icon: 'fa-moon', title: 'Prayer Kesha (All-Night Prayer)', desc: 'Powerful all-night prayer sessions that seek God\'s face and invite His presence and revival.' },
  { icon: 'fa-mountain', title: 'Prayer Retreats', desc: 'Dedicated retreats for extended prayer, fasting, and seeking God\'s direction for the Union.' },
  { icon: 'fa-link', title: 'Prayer Weeks & Fasting Programs', desc: 'Organized prayer weeks and fasting programs for the entire Union.' },
  { icon: 'fa-fire', title: 'Revival Programs', desc: 'Organizing and participating in revival meetings and spiritual awakening programs.' },
  { icon: 'fa-heart', title: 'Prayer Requests & Praise Reports', desc: 'Compiling and distributing prayer requests and praise reports across the Union.' },
]

export default function PrayerMinistryPage() {
  return (
    <>
      <SEO
        title="Prayer Ministry | MUTCU"
        description="MUTCU Prayer Ministry — leading the Union in consistent, fervent prayer through weekly meetings, keshas, prayer retreats, and year-based prayer coordinators."
        url="/ministries/prayer-ministry"
        keywords="MUTCU prayer ministry, MUTCU kesha, Murang'a University Christian Union prayer, MUTCU prayer retreat, Anza FYT, VUKA FiT"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/prayer1.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.4
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Prayer Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Fostering a Culture of Intercession and Prayer Life Maturity</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.4</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Prayer Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To mobilize and lead the Christian Union in consistent, fervent, and effective prayer."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMMITTEE_COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['i', 'ii', 'iii', 'iv'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Chairperson (Prayer Coordinator)</h5>
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
                <Link to="/committees/prayer" className="btn-primary mt-6 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Prayer Coordinator
                </Link>
              </div>
              <div data-aos="fade-left">
                <img src="/assets/images/prayer1.jpg" alt="Prayer Ministry" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Year's Fellowship Prayer Coordinators */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Year's Fellowship Prayer Coordinators" subtitle="The Prayer Committee includes dedicated Prayer Coordinators for each year of study — mobilizing prayer across the entire Union. — Leadership Manual 2025, Part 3.4.3(C)" />

            {/* Roles */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 max-w-3xl mx-auto">
              <h5 className="font-montserrat font-bold text-navy mb-3">Roles of Year's Fellowship Prayer Coordinators</h5>
              <ul className="space-y-2">
                {YEAR_COORDINATOR_ROLES.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                    <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Year groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {YEAR_COORDINATORS.map((yc, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${yc.color} p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1`}
                  data-aos="zoom-in" data-aos-delay={i * 80}>
                  <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4">
                    <i className={`fas ${yc.icon} text-orange text-2xl`} />
                  </div>
                  <h4 className="font-montserrat font-black text-navy text-xl mb-1">{yc.name}</h4>
                  <p className="text-orange text-xs font-bold uppercase tracking-wider mb-3">{yc.label}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{yc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prayer Activities */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Prayer Activities & Programs" subtitle="The Prayer Ministry leads the Union through a variety of prayer programs throughout the semester." center light />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRAYER_ACTIVITIES.map((act, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                  data-aos="fade-up" data-aos-delay={i * 60}>
                  <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center mb-4">
                    <i className={`fas ${act.icon} text-orange text-xl`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white mb-2">{act.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Prayer Ministry</h3>
            <p className="text-white/60 mb-6">Be a prayer champion for MUTCU — intercede for the Union, the campus, and the nation.</p>
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