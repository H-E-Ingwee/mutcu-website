import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

const COMMITTEES = [
  { title: 'Advisory Board', slug: 'advisory-board', icon: 'fa-users-cog', description: 'Providing strategic guidance, wisdom, and oversight to the Executive Council and the Union.', link: '/special-committees/advisory-board' },
  { title: 'Auditing Committee', slug: 'auditing', icon: 'fa-balance-scale', description: 'Ensuring financial accountability, transparency, and proper stewardship of Union resources.', link: '/special-committees/auditing' },
  { title: 'Associates Committee', slug: 'associates', icon: 'fa-user-graduate', description: 'Connecting MUTCU alumni and associate members to the ongoing life and mission of the Union.', link: '/special-committees/associates' },
  { title: 'Interim Executive Council', slug: 'interim-exco', icon: 'fa-clock', description: 'Providing continuity of leadership during the transition period between academic years.', link: '/special-committees/interim-exco' },
  { title: 'Resource Mobilization Committee', slug: 'rmc', icon: 'fa-donate', description: 'Mobilizing financial and material resources to support the Union\'s ministry and programs.', link: '/special-committees/rmc' },
]

export default function SpecialCommitteesPage() {
  return (
    <div>
      <PageHero
        subtitle="MUTCU's special committees provide oversight, accountability, continuity, and resource mobilization for the Union."
        image="/assets/images/church2.jpg"
        badge="Special Committees"
      />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Special Committees" subtitle="Each committee serves a unique and vital role in the governance and sustainability of MUTCU." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITTEES.map((c, i) => (
              <Link key={c.slug} to={c.link}
                className="card group" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="card-body text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4 group-hover:bg-orange transition-colors">
                    <i className={`fas ${c.icon} text-orange text-2xl group-hover:text-white transition-colors`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-navy text-lg mb-3">{c.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{c.description}</p>
                  <div className="flex items-center justify-center gap-1 text-orange text-sm font-semibold">
                    Learn More <i className="fas fa-arrow-right text-xs" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}