import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// Exact from Art. 13.4 MUTCU Constitution 2025
const ROLES = [
  'Shall provide spiritual guidance and wisdom to the Executive Council on matters of governance and ministry.',
  'Shall advise on constitutional matters and ensure the Union operates within its constitutional framework.',
  'Shall serve as the disciplinary committee in conjunction with the Executive Council (Art. 12.2.xiii).',
  'Shall be consulted by the Executive Council before taking disciplinary action against any member.',
  'Shall be appointed by the Executive Council not more than three weeks after taking office (Art. 12.2.xii).',
  'Shall be available to the Executive Council for consultation on urgent matters.',
  'Shall support the spiritual direction and vision of the Union.',
  'Shall facilitate connections with external partners, FOCUS Kenya, and other stakeholders.',
  'Associate members are free to participate in any General meeting and be members of the Advisory Board (Art. 8.3.III).',
]

export default function AdvisoryBoardPage() {
  return (
    <>
      <SEO
        title="Advisory Board | MUTCU Special Committees"
        description="Learn about the MUTCU Advisory Board — providing spiritual guidance, wisdom, and oversight to the Executive Council as per Article 13.4 of the MUTCU Constitution 2025."
        url="/special-committees/advisory-board"
        keywords="MUTCU Advisory Board, MUTCU special committees, Murang'a University Christian Union governance"
      />
      <PageHero
        title="Advisory Board"
        subtitle="Providing spiritual guidance, wisdom, and oversight to the Executive Council and the Union."
        image="/assets/images/church2.jpg"
        badge="Special Committee · Article 13.4"
      />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div data-aos="fade-right">
              <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Article 13.4</div>
              <SectionTitle title="About the Advisory Board" center={false} />
              <p className="text-gray-600 leading-relaxed mb-4">The Advisory Board provides strategic guidance, wisdom, and oversight to the MUTCU Executive Council. Composed of experienced Christian leaders, the Board supports the Union's leadership in navigating complex decisions and maintaining alignment with the Union's mission and values.</p>
              <p className="text-gray-600 leading-relaxed mb-4">The Advisory Board operates in an advisory capacity, offering counsel and support without direct executive authority, ensuring that the Union benefits from the wisdom of experienced leaders while maintaining student-led governance.</p>
              <p className="text-gray-600 leading-relaxed">As per Article 12.2(xii) of the MUTCU Constitution 2025, the Executive Council shall appoint the Advisory Board not more than three weeks after taking office. The Advisory Board also serves as part of the disciplinary committee in conjunction with the Executive Council (Art. 12.2.xiii).</p>
              <div className="mt-5 bg-orange/5 border border-orange/20 rounded-xl p-4">
                <p className="text-navy text-sm font-medium italic">"The Executive Council in consultation with the advisory board shall take disciplinary action against any member whom by belief or practice departs from the aims, objectives and the doctrinal basis of The Christian Union." — Article 8.5, MUTCU Constitution 2025</p>
              </div>
            </div>
            <div data-aos="fade-left">
              <SectionTitle title="Key Roles & Responsibilities" center={false} />
              <div className="space-y-3">
                {ROLES.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-all"
                    data-aos="fade-up" data-aos-delay={i * 40}>
                    <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-navy text-center">
        <div className="max-w-xl mx-auto px-4 flex flex-wrap justify-center gap-3">
          <Link to="/special-committees" className="btn-outline-white">← Special Committees</Link>
          <Link to="/about" className="btn-primary">About MUTCU</Link>
        </div>
      </section>
    </>
  )
}