import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.8 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'Welfare Coordinator (Chairperson)',
  'First Vice-Chairperson (Female)',
  'Second Vice-Chairperson (Male)',
  'The CU Treasurer',
  'Secretary/Treasurer',
  'Guidance & Counselling Coordinators',
  'Ladies\' Sub-committee',
  'Gents\' Sub-committee',
  'Anza FyT Chairperson',
]

const CHAIRPERSON_ROLES = [
  'Provides overall leadership to the committee and confidentially oversees all welfare cases.',
  'Convenes meetings to review requests for support and make decisions based on established policies.',
]

const SECRETARY_ROLES = [
  'Confidentially handles and documents all welfare cases, ensuring privacy and proper record-keeping.',
  'Manages all committee records and communications.',
  'Manages the welfare fund, tracks donations, and disburses support as approved by the committee.',
  'Coordinates fundraising efforts specifically for members in need.',
]

const SUB_COMMITTEE_ROLES = [
  {
    icon: 'fa-balance-scale',
    title: 'Christian Union Treasurer',
    color: 'border-orange',
    desc: 'Shall advise the Welfare Committee on the financial position of The Union relative to the welfare account.',
  },
  {
    icon: 'fa-hands-helping',
    title: 'Guidance & Counselling Coordinators',
    color: 'border-teal',
    desc: 'Leads the counselling team, provides confidential pastoral care and biblical guidance, and refers complex cases to the university Guidance & Counselling department.',
  },
  {
    icon: 'fa-female',
    title: 'Ladies\' Sub-committee Lead (First Vice-Chairperson)',
    color: 'border-orange',
    desc: 'Leads a team of female leaders in planning and executing programs (talks, mentorship, events) that cater specifically to the spiritual and social needs of ladies.',
  },
  {
    icon: 'fa-male',
    title: 'Gents\' Sub-committee Lead (Second Vice-Chairperson)',
    color: 'border-teal',
    desc: 'Leads a team of male leaders in planning and executing programs (fellowships, gents forums) that build up men in their faith, character, and leadership.',
  },
]

const WELFARE_ACTIVITIES = [
  { icon: 'fa-heart', title: 'Member Care', desc: 'Checking on members\' wellbeing and providing confidential support during difficult times.' },
  { icon: 'fa-hand-holding-heart', title: 'Practical Support', desc: 'Organizing practical assistance for members facing financial or material challenges, as approved by the committee.' },
  { icon: 'fa-birthday-cake', title: 'Celebrations', desc: 'Celebrating members\' milestones including birthdays, graduations, and achievements.' },
  { icon: 'fa-hospital', title: 'Sick Visits', desc: 'Visiting and supporting members who are unwell or going through difficult circumstances.' },
  { icon: 'fa-users', title: 'Ladies\' & Gents\' Programs', desc: 'Dedicated programs for ladies and gents — talks, mentorship, fellowships, and forums.' },
  { icon: 'fa-pray', title: 'Pastoral Care & Counselling', desc: 'Confidential pastoral care and biblical guidance through the Guidance & Counselling Coordinators.' },
]

export default function WelfarePage() {
  return (
    <>
      <SEO
        title="Welfare Committee | MUTCU"
        description="MUTCU Welfare Committee — demonstrating Christ's love through practical, emotional, and spiritual support to members in need at Murang'a University of Technology Christian Union."
        url="/ministries/welfare-committee"
        keywords="MUTCU welfare, MUTCU welfare committee, Murang'a University Christian Union welfare, MUTCU member care, MUTCU counselling"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/welfare11.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.8
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Welfare Committee</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Demonstrating Christ's Love Through Practical, Emotional, and Spiritual Support</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.8</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Welfare Committee</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To demonstrate Christ's love by providing practical, emotional, and spiritual support to members in need."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMMITTEE_COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Chairperson (Welfare Coordinator)</h5>
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
              </div>
              <div data-aos="fade-left">
                <img src="/assets/images/welfare11.jpg" alt="Welfare Committee" className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                <div className="mt-4 bg-orange/5 border border-orange/20 rounded-2xl p-4">
                  <p className="text-navy text-sm font-medium italic">"The Welfare Committee is chaired by the 2nd Vice-Chairperson (Male) as per the MUTCU Leadership Manual 2025."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Committee Roles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Sub-Committee Leadership Roles" subtitle="Each member of the Welfare Committee has a specific role in caring for the Union. — Leadership Manual 2025, Part 3.8.4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SUB_COMMITTEE_ROLES.map((role, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${role.color} p-6 hover:shadow-lg transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${role.icon} text-orange text-xl`} />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-bold text-navy mb-2">{role.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{role.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Welfare Activities" subtitle="The Welfare Committee demonstrates Christ's love through practical care and community." center light />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WELFARE_ACTIVITIES.map((act, i) => (
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
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Welfare Committee</h3>
            <p className="text-white/60 mb-6">Help us demonstrate Christ's love by caring for members in need.</p>
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