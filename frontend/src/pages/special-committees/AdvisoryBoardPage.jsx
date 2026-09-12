import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import { Link } from 'react-router-dom'

const ROLES = [
  'Providing strategic guidance and wisdom to the Executive Council.',
  'Advising on constitutional matters and governance issues.',
  'Supporting the spiritual direction and vision of the Union.',
  'Mentoring and supporting the Executive Council members.',
  'Representing the interests of the broader MUTCU community.',
  'Facilitating connections with external partners and stakeholders.',
]

export default function AdvisoryBoardPage() {
  return (
    <div>
      <PageHero title="Advisory Board" subtitle="Providing strategic guidance, wisdom, and oversight to the Executive Council and the Union." image="/assets/images/church2.jpg" badge="Special Committee" />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div data-aos="fade-right">
              <SectionTitle title="About the Advisory Board" center={false} />
              <p className="text-gray-600 leading-relaxed mb-4">The Advisory Board provides strategic guidance, wisdom, and oversight to the MUTCU Executive Council. Composed of experienced Christian leaders, the Board supports the Union's leadership in navigating complex decisions and maintaining alignment with the Union's mission and values.</p>
              <p className="text-gray-600 leading-relaxed">The Advisory Board operates in an advisory capacity, offering counsel and support without direct executive authority, ensuring that the Union benefits from the wisdom of experienced leaders while maintaining student-led governance.</p>
            </div>
            <div data-aos="fade-left">
              <SectionTitle title="Key Roles" center={false} />
              <div className="space-y-3">
                {ROLES.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                    <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-navy text-center">
        <div className="max-w-xl mx-auto px-4">
          <Link to="/special-committees" className="btn-outline-white">← Back to Special Committees</Link>
        </div>
      </section>
    </div>
  )
}