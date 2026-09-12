import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.5 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'Missions and Evangelism Coordinator (Chairperson)',
  'Secretary/Treasurer',
  'Sub-Ministry Coordinators',
]

const CHAIRPERSON_ROLES = [
  'Provides overarching strategic leadership for all CU outreach activities, ensuring they are aligned with the Union\'s vision.',
  'Oversees the planning and execution of the annual mission and major evangelistic events in collaboration with the sub-committees.',
  'Ensures all outreach teams are doctrinally sound, well-trained in evangelism, and mission work.',
  'Mentors the leaders of the Evangelism, Hope, and Integral Ministry sub-committees.',
]

const SECRETARY_ROLES = [
  'Handles all high-level correspondence for the committee, including writing official letters for mission ground requests, partnerships, and visit permissions.',
  'Maintains a central record of all outreach activities, including statistics on new converts for consolidated follow-up strategies.',
  'Manages the overall finances for all missions and evangelism activities, including central fundraising, budget allocation to sub-committees, and ensuring accountability for all disbursed funds.',
]

const SUB_COMMITTEES = [
  {
    icon: 'fa-bullhorn',
    title: 'Evangelism Sub-Committee',
    color: 'border-orange',
    mandate: 'To spearhead all on-campus and off-campus evangelistic efforts, creating a pervasive culture of sharing the gospel within the university community and beyond.',
    composition: [
      'Evangelism Ministry Leader',
      'Assistant Evangelism Ministry Leader',
      'Anza FYT Evangelism Leader',
      'Endelea one Evangelism Leader',
      'Endelea two Evangelism Leader',
      'Vuka FiT Evangelism Leader',
    ],
    roles: [
      { title: 'Evangelism Ministry Leader', duty: 'Leads the sub-committee, plans campus-wide evangelistic activities, events and trains members in various methods of personal and corporate evangelism.' },
      { title: 'Assistant Evangelism Ministry Leader', duty: 'Supports the leader in all duties and may oversee specific projects or teams.' },
      { title: 'Anza FYT Evangelism Leader', duty: 'Focuses specifically on evangelism and outreach to first-year students, organizing targeted events and mobilizing first years to share their faith.' },
      { title: 'Endelea Evangelism Leader', duty: 'Focuses on continuing the evangelistic momentum among second and third-year students.' },
      { title: 'Vuka FiT Evangelism Leader', duty: 'Dedicated to evangelism among the finalists, addressing relevant topics and mobilizing them for campus outreach.' },
    ],
  },
  {
    icon: 'fa-heart',
    title: 'Hope Ministry Sub-Committee',
    color: 'border-teal',
    mandate: 'To demonstrate the compassion of Christ by ministering to marginalized and vulnerable groups in the surrounding community.',
    composition: [
      'Hope Ministry Leader',
      'Assistant Hope Ministry Leader',
      'Three Members (At least one representative from the Anza FYT committee)',
    ],
    roles: [
      { title: 'Hope Ministry Leader', duty: 'Plans, coordinates, and leads regular outreach visits to hospitals, prisons, children\'s homes, and rescue centres, focusing on sharing the hope of the gospel.' },
      { title: 'Assistant Hope Ministry Leader', duty: 'Assists the leader with logistics, communication with institutions, and pre-visit preparations.' },
      { title: 'Members', duty: 'Actively participate in planning and mobilizing members for visits playing a key role in engaging their peers in compassionate outreach.' },
    ],
  },
  {
    icon: 'fa-globe-africa',
    title: 'Integral Ministry',
    color: 'border-orange',
    mandate: 'To extend the mission of the CU to specific strategic groups, such as high schools and children, integrating faith with practical action.',
    composition: [
      'Integral Ministry Leader',
      'Assistant Integral Ministry Leader',
    ],
    roles: [
      { title: 'Integral Ministry Leader', duty: 'Leads mission-focused outreach to local high school Christian Unions and partners with local churches to support their Sunday school programs. Also coordinates CSR as a form of street evangelism with societal transformation.' },
      { title: 'Assistant Integral Ministry Leader', duty: 'Supports the leader in all activities, often taking charge of either the high school or children\'s ministry.' },
    ],
  },
]

export default function MissionsPage() {
  return (
    <>
      <SEO
        title="Missions & Evangelism Ministry | MUTCU"
        description="MUTCU Missions & Evangelism Ministry — Evangelism Sub-Committee, Hope Ministry, and Integral Ministry proclaiming the Gospel at Murang'a University of Technology."
        url="/ministries/missions-evangelism"
        keywords="MUTCU missions, MUTCU evangelism, Hope Ministry MUTCU, Integral Ministry MUTCU, Murang'a University Christian Union outreach"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/mission1.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.5
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Missions & Evangelism Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Spreading the Gospel and Serving Communities</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.5</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Missions & Evangelism Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To equip and mobilize the CU to faithfully proclaim the gospel in word and deed, both on campus and beyond, ensuring that every member is engaged in the Great Commission."</p>
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
                  <h5 className="font-montserrat font-bold text-navy mb-2">Chairperson (Missions & Evangelism Coordinator)</h5>
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
                <Link to="/committees/missions" className="btn-primary mt-6 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Coordinator
                </Link>
              </div>
              <div data-aos="fade-left" className="space-y-4">
                <img src="/assets/images/mission1.jpg" alt="Missions Ministry" className="rounded-2xl shadow-2xl w-full h-56 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                <div className="grid grid-cols-2 gap-3">
                  <img src="/assets/images/crusade.jpg" alt="Crusade" className="rounded-xl shadow-lg w-full h-32 object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                  <img src="/assets/images/Outreach 1.jpg" alt="Outreach" className="rounded-xl shadow-lg w-full h-32 object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Committees */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Sub-Committees & Leadership Roles" subtitle="The Missions & Evangelism Ministry operates through three specialized sub-committees. — Leadership Manual 2025, Part 3.5.3" />
            <div className="space-y-8">
              {SUB_COMMITTEES.map((sub, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${sub.color} overflow-hidden`}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${sub.icon} text-orange`} />
                      </div>
                      <h3 className="font-montserrat font-bold text-navy text-xl">{sub.title}</h3>
                    </div>
                    <div className="bg-orange/5 border border-orange/20 rounded-xl p-3 mb-4">
                      <p className="text-navy text-sm font-medium italic"><strong>Mandate:</strong> {sub.mandate}</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div>
                        <h5 className="font-montserrat font-bold text-navy text-sm mb-2">Composition</h5>
                        <ul className="space-y-1.5">
                          {sub.composition.map((c, j) => (
                            <li key={j} className="flex items-center gap-2 text-gray-600 text-sm">
                              <span className="w-4 h-4 rounded-full bg-teal/20 text-teal text-xs flex items-center justify-center font-bold flex-shrink-0">{String.fromCharCode(97 + j)}</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-montserrat font-bold text-navy text-sm mb-2">Leadership Roles</h5>
                        <div className="space-y-2">
                          {sub.roles.map((role, j) => (
                            <div key={j} className="bg-gray-50 rounded-xl p-3">
                              <div className="font-montserrat font-bold text-navy text-xs mb-1">{role.title}</div>
                              <p className="text-gray-600 text-xs leading-relaxed">{role.duty}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Missions & Evangelism Ministry</h3>
            <p className="text-white/60 mb-6">Be part of the Great Commission — share the Gospel on campus and beyond.</p>
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