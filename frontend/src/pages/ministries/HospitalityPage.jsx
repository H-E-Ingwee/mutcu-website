import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.2 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'First Vice-Chairperson (Female) — Chairperson',
  'Hospitality Leader',
  'Secretary/Treasurer',
  'Two Members',
]

const CHAIRPERSON_ROLES = [
  'Shall provide overall leadership and spiritual oversight to the committee.',
  'Shall oversee the strategic planning and execution of all hospitality functions, including guest reception and new member integration.',
]

const HOSPITALITY_LEADER_ROLES = [
  'Shall be the principal operational assistant to the Chairperson.',
  'Shall coordinate the day-to-day activities of the hospitality team, including visitor care, serving refreshments, and following up with new members.',
  'Shall be responsible for recruiting, training, and scheduling hospitality team volunteers for all services and events.',
]

const SECRETARY_ROLES = [
  'Shall take and maintain minutes for all committee meetings.',
  'Shall manage the hospitality budget, which includes purchasing foodstuffs and maintaining an accurate inventory of office utensils and supplies.',
  'Shall keep all financial and administrative records for the committee.',
]

const MEMBERS_ROLES = [
  'Shall undertake and support in any responsibilities as deemed necessary by the committee.',
]

const ACTIVITIES = [
  { icon: 'fa-door-open', title: 'Guest Welcoming', desc: 'Warmly welcoming visitors and new members to all MUTCU services and events, creating a welcoming atmosphere.' },
  { icon: 'fa-chair', title: 'Seating & Ushering', desc: 'Coordinating seating arrangements and ushering for all Union gatherings, ensuring orderly seating.' },
  { icon: 'fa-mug-hot', title: 'Refreshments', desc: 'Organizing and serving refreshments at fellowship events and special occasions, managing foodstuffs and supplies.' },
  { icon: 'fa-user-plus', title: 'New Member Integration', desc: 'Following up with new members and visitors to ensure they are welcomed and integrated into the CU community.' },
  { icon: 'fa-calendar-check', title: 'Event Logistics', desc: 'Supporting the logistics and coordination of Union events and programs.' },
  { icon: 'fa-heart', title: 'CU Office Management', desc: 'Managing the CU office resources, including maintaining an accurate inventory of office utensils and supplies.' },
]

export default function HospitalityPage() {
  return (
    <>
      <SEO
        title="Hospitality Ministry | MUTCU"
        description="MUTCU Hospitality Ministry — modelling the love of Christ by creating a welcoming environment, caring for guests and members at Murang'a University of Technology Christian Union."
        url="/ministries/hospitality-ministry"
        keywords="MUTCU hospitality, Murang'a University Christian Union hospitality, MUTCU welcoming, MUTCU ushering"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/guest-welcome.jfif')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.2
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Hospitality Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Modelling the Love of Christ by Creating a Welcoming Environment</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.2</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Hospitality Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To model the love of Christ by creating a welcoming environment, caring for guests and members, and managing the CU office resources."</p>
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
                <div className="bg-orange/5 border border-orange/20 rounded-xl p-4 mt-4">
                  <p className="text-navy text-sm font-medium italic">"The Hospitality Committee is chaired by the First Vice-Chairperson (Female) as per the MUTCU Leadership Manual 2025, Part 3.2."</p>
                </div>
                <Link to="/committees/vice-chair1" className="btn-primary mt-5 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Chairperson (1st Vice Chair)
                </Link>
              </div>
              <div data-aos="fade-left">
                <img src="/assets/images/guest-welcome.jfif" alt="Hospitality Ministry" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Office Bearer Roles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Committee Office Bearers & Roles" subtitle="Each office bearer in the Hospitality Committee has specific responsibilities. — Leadership Manual 2025, Part 3.2.3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                { title: 'Chairperson (First Vice-Chairperson)', icon: 'fa-user-tie', color: 'border-orange', duties: CHAIRPERSON_ROLES },
                { title: 'Hospitality Leader', icon: 'fa-hands-helping', color: 'border-teal', duties: HOSPITALITY_LEADER_ROLES },
                { title: 'Secretary/Treasurer', icon: 'fa-file-alt', color: 'border-orange', duties: SECRETARY_ROLES },
                { title: 'Members', icon: 'fa-users', color: 'border-teal', duties: MEMBERS_ROLES },
              ].map((role, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${role.color} p-5 hover:shadow-md transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${role.icon} text-orange text-sm`} />
                    </div>
                    <h4 className="font-montserrat font-bold text-navy text-sm">{role.title}</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {role.duties.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-600 text-xs leading-relaxed">
                        <i className="fas fa-chevron-right text-orange text-xs mt-0.5 flex-shrink-0" />{d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Hospitality Activities" subtitle="The Hospitality Ministry ensures every person who walks through our doors feels genuinely welcomed." center light />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ACTIVITIES.map((act, i) => (
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
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Hospitality Ministry</h3>
            <p className="text-white/60 mb-6">Help us create a welcoming environment where every person feels the love of Christ.</p>
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