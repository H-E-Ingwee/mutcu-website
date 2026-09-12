import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.10 ────────────────────────────
const COMMITTEE_COMPOSITION = [
  'The Discipleship Coordinator (Chairperson)',
  'The Secretary/Treasurer',
  'The Nurturing Coordinator',
  'The Assistant Nurturing Coordinator',
  'The Years Fellowship Coordinator',
  'The Assistant Years Fellowship Coordinator',
  'The Accountability Coordinator',
  'The Assistant Accountability Coordinator',
  'Discipleship Class Coordinator',
  'Assistant Discipleship Coordinator',
]

const OFFICE_BEARER_ROLES = [
  {
    title: 'Chairperson (Discipleship Coordinator)',
    icon: 'fa-user-tie',
    color: 'border-orange',
    duties: ['Performs all duties as outlined in Part 2.11 of the Leadership Manual.'],
  },
  {
    title: 'Secretary/Treasurer',
    icon: 'fa-file-alt',
    color: 'border-teal',
    duties: [
      'He/she takes minutes during the ministry\'s meeting and avails them for reading and confirmation in every meeting.',
      'He/she is the custodian of all committee funds, documents and assets.',
      'He/she is in charge of special activities within the committee.',
      'Shall be the financial advisor to the committee.',
    ],
  },
  {
    title: 'The Nurturing Coordinator',
    icon: 'fa-seedling',
    color: 'border-orange',
    duties: [
      'He/she is in charge of the new believers nurturing class.',
      'He/she chairs the Nurturing sub-committee\'s meeting.',
      'He/she ensures proper follow up of the new believers assigned to various disciple makers.',
      'He/she oversees special activities of the committee i.e baptism.',
    ],
  },
  {
    title: 'The Assistant Nurturing Coordinator',
    icon: 'fa-leaf',
    color: 'border-teal',
    duties: [
      'Shall be the principal assistant to the nurturing coordinator.',
      'Shall be the custodian of all assets and records.',
    ],
  },
  {
    title: 'The Years Fellowship Coordinator',
    icon: 'fa-users',
    color: 'border-orange',
    duties: [
      'Coordinates the year-based fellowship groups (Anza FYT, Endelea, VUKA FiT).',
      'Ensures each year group has active fellowship and discipleship activities.',
    ],
  },
  {
    title: 'The Assistant Years Fellowship Coordinator',
    icon: 'fa-user-friends',
    color: 'border-teal',
    duties: [
      'Shall be the principal assistant to the Years Fellowship Coordinator.',
      'Shall be the custodian of all Years Fellowship records.',
    ],
  },
  {
    title: 'The Accountability Coordinator',
    icon: 'fa-handshake',
    color: 'border-orange',
    duties: [
      'Organizes and oversees accountability groups within the CU.',
      'Ensures members are walking in mutual accountability and spiritual growth.',
    ],
  },
  {
    title: 'The Assistant Accountability Coordinator',
    icon: 'fa-hands-helping',
    color: 'border-teal',
    duties: [
      'Shall be the principal assistant to the Accountability Coordinator.',
      'Shall be the custodian of all Accountability group records.',
    ],
  },
  {
    title: 'Discipleship Class Coordinator',
    icon: 'fa-chalkboard-teacher',
    color: 'border-orange',
    duties: [
      'Coordinates discipleship classes for members at various stages of spiritual growth.',
      'Ensures discipleship content is biblically sound and practically applicable.',
    ],
  },
  {
    title: 'Assistant Discipleship Coordinator',
    icon: 'fa-user-graduate',
    color: 'border-teal',
    duties: [
      'Shall be the principal assistant to the Discipleship Class Coordinator.',
      'Shall be the custodian of all discipleship class records.',
    ],
  },
]

const NURTURING_SUB_COMMITTEE = [
  'In charge of coming up with topics and facilitators of nurturing classes.',
  'Shall allocate new believers to various disciple makers.',
  'Shall follow up on new believers to ensure they are growing in faith.',
]

const PROGRAMS = [
  { icon: 'fa-seedling', title: 'Nurturing Classes', desc: 'Structured classes for new believers — introducing them to the Christian faith, the CU, and connecting them with disciple makers.' },
  { icon: 'fa-users', title: 'Years\' Fellowships', desc: 'Year-based fellowship groups: Anza FYT (1st years), Endelea (2nd & 3rd years), and VUKA FiT (finalists) — building community within each year group.' },
  { icon: 'fa-handshake', title: 'Accountability Groups', desc: 'Small accountability groups where members walk together in mutual encouragement, prayer, and spiritual accountability.' },
  { icon: 'fa-chalkboard-teacher', title: 'Discipleship Classes', desc: 'Structured discipleship classes for members at various stages of their faith journey — from new believers to mature disciples.' },
  { icon: 'fa-water', title: 'Baptism', desc: 'Coordinating baptism for new believers as a public declaration of faith — overseen by the Nurturing Coordinator.' },
  { icon: 'fa-user-friends', title: 'One-on-One Mentorship', desc: 'Intentional mentoring relationships pairing mature believers with newer members for personal spiritual growth.' },
]

export default function DiscipleshipPage() {
  return (
    <>
      <SEO
        title="Discipleship Ministry | MUTCU"
        description="MUTCU Discipleship Ministry — nurturing classes, years' fellowships, accountability groups, and discipleship classes at Murang'a University of Technology Christian Union."
        url="/ministries/discipleship"
        keywords="MUTCU discipleship, MUTCU nurturing, Anza FYT, VUKA FiT, Murang'a University Christian Union discipleship, MUTCU accountability groups"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/BS3.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.10
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Discipleship Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Intentionally Guiding Members at Every Stage of Their Faith Journey</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.10</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Discipleship Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To intentionally guide members at every stage of their faith journey, from their first decision (nurturing) to relational growth (fellowships) and personal discipleship."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMMITTEE_COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-montserrat font-bold text-navy mb-2">Nurturing Sub-Committee Duties</h5>
                  <ul className="space-y-2">
                    {NURTURING_SUB_COMMITTEE.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/committees/bible-study" className="btn-primary mt-6 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Coordinator
                </Link>
              </div>
              <div data-aos="fade-left">
                <img src="/assets/images/BS3.jpg" alt="Discipleship Ministry" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Office Bearer Roles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Committee Office Bearers & Roles" subtitle="Each office bearer in the Discipleship Committee has specific responsibilities. — Leadership Manual 2025, Part 3.10.3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {OFFICE_BEARER_ROLES.map((role, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${role.color} p-5 hover:shadow-md transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 40}>
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

        {/* Programs */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Programs & Activities" subtitle="The Discipleship Ministry runs structured programs to guide members at every stage of their faith journey." center light />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROGRAMS.map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                  data-aos="fade-up" data-aos-delay={i * 60}>
                  <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center mb-4">
                    <i className={`fas ${p.icon} text-orange text-xl`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Discipleship Ministry</h3>
            <p className="text-white/60 mb-6">Walk with others in faith — join a nurturing class, accountability group, or years' fellowship.</p>
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