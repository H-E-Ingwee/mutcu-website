import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import { Link } from 'react-router-dom'

const ROLES = [
  'Auditing the Union\'s financial records and accounts.',
  'Ensuring proper financial controls and accountability.',
  'Reviewing and verifying financial reports presented to the Union.',
  'Identifying and reporting financial irregularities or concerns.',
  'Recommending improvements to financial management practices.',
  'Presenting audit reports at the Annual General Meeting (AGM).',
]

export default function AuditingPage() {
  return (
    <div>
      <PageHero title="Auditing Committee" subtitle="Ensuring financial accountability, transparency, and proper stewardship of Union resources." image="/assets/images/church2.jpg" badge="Special Committee" />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div data-aos="fade-right">
              <SectionTitle title="About the Auditing Committee" center={false} />
              <p className="text-gray-600 leading-relaxed mb-4">The Auditing Committee is responsible for ensuring financial accountability and transparency within MUTCU. This committee independently reviews the Union's financial records, verifies the accuracy of financial reports, and ensures that all funds are managed in accordance with the Union's constitution and policies.</p>
              <p className="text-gray-600 leading-relaxed">The Auditing Committee operates independently of the Executive Council to ensure objectivity and impartiality in its oversight role, presenting its findings at the Annual General Meeting.</p>
            </div>
            <div data-aos="fade-left">
              <SectionTitle title="Key Responsibilities" center={false} />
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