import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from MUTCU Constitution 2025, Art. 13.6 + Leadership Manual Part 4.3 ──
const COMPOSITION = [
  'The CU Treasurer (Chairperson)',
  'The CU Secretary',
  'Two members of the Executive Council',
  'Two members of the CU (non-executive)',
]

const ROLES_AND_RESPONSIBILITIES = [
  'To mobilize financial and material resources for the CU\'s programs and activities.',
  'To identify and pursue funding opportunities, including grants, donations, and partnerships.',
  'To organize fundraising events and activities in line with the CU\'s values and policies.',
  'To maintain accurate records of all resource mobilization activities and funds raised.',
  'To report to the Executive Council on all resource mobilization activities and outcomes.',
  'To ensure all fundraising activities are conducted with integrity, transparency, and accountability.',
  'To collaborate with the Treasurer in financial planning and budgeting for Union activities.',
  'To promote a culture of faithful stewardship and generosity among all MUTCU members.',
  'To build relationships with donors, sponsors, and partners who support MUTCU\'s mission.',
  'To mobilize material resources (equipment, supplies) needed for ministry programs.',
]

const ACTIVITIES = [
  { icon: 'fa-donate', title: 'Resource Mobilization', desc: 'Identifying and mobilizing financial and material resources to support Union programs and activities.' },
  { icon: 'fa-handshake', title: 'Partnership Development', desc: 'Building relationships with donors, sponsors, and partners who support MUTCU\'s mission and vision.' },
  { icon: 'fa-chart-line', title: 'Financial Planning Support', desc: 'Supporting the Treasurer in financial planning and budgeting for Union activities.' },
  { icon: 'fa-box-open', title: 'Material Resources', desc: 'Mobilizing equipment, materials, and other non-financial resources needed for ministry.' },
  { icon: 'fa-file-invoice', title: 'Fundraising Events', desc: 'Organizing fundraising activities and events in line with the CU\'s values and policies.' },
  { icon: 'fa-balance-scale', title: 'Stewardship & Accountability', desc: 'Promoting a culture of faithful stewardship and ensuring all fundraising is conducted with integrity and transparency.' },
]

export default function RMCPage() {
  return (
    <>
      <SEO
        title="Resource Mobilization Committee (RMC) | MUTCU"
        description="MUTCU Resource Mobilization Committee — stewardship and mobilization of financial and material resources for ministry at Murang'a University of Technology Christian Union."
        url="/ministries/rmc"
        keywords="MUTCU RMC, MUTCU resource mobilization, Murang'a University Christian Union fundraising, MUTCU stewardship"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/prayer1.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              Special Committee · Constitution Art. 13.6 · Leadership Manual Part 4.3
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Resource Mobilization Committee</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Faithful Stewardship and Mobilization of Resources for Ministry</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Constitution Art. 13.6 · Leadership Manual Part 4.3</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Resource Mobilization Committee</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To mobilize financial and material resources for the CU's programs and activities, ensuring the Union has what it needs to fulfill its mission."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['i', 'ii', 'iii', 'iv'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange/5 border border-orange/20 rounded-xl p-4 mt-4">
                  <p className="text-navy text-sm font-medium italic">"The RMC is chaired by the CU Treasurer and operates with a spirit of faithful stewardship, recognizing that all resources belong to God and are to be managed with integrity, transparency, and accountability." — Leadership Manual 2025, Part 4.3</p>
                </div>
              </div>
              <div data-aos="fade-left">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h5 className="font-montserrat font-bold text-navy mb-4">Roles & Responsibilities</h5>
                  <ul className="space-y-3">
                    {ROLES_AND_RESPONSIBILITIES.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Key Activities" subtitle="The Resource Mobilization Committee ensures MUTCU has the resources needed to fulfill its mission." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ACTIVITIES.map((act, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                  data-aos="fade-up" data-aos-delay={i * 60}>
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                    <i className={`fas ${act.icon} text-orange text-xl`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-navy mb-2">{act.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Constitution Reference */}
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-3xl mx-auto px-4 text-center" data-aos="fade-up">
            <i className="fas fa-book text-orange text-4xl mb-4 block" />
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Constitutional Basis</h3>
            <p className="text-white/60 mb-5 leading-relaxed">The Resource Mobilization Committee is established under Article 13.6 of the MUTCU Constitution 2025 and further detailed in Part 4.3 of the MUTCU Leadership Manual 2025.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/special-committees/rmc" className="btn-primary">Special Committees</Link>
              <Link to="/resources" className="btn-outline-white">Download Constitution</Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Support MUTCU's Mission</h3>
            <p className="text-white/60 mb-6">Partner with us in faithful stewardship — every resource mobilized advances the Gospel on campus and beyond.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary">Contact Us</Link>
              <Link to="/register" className="btn-outline-white">Join MUTCU</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}