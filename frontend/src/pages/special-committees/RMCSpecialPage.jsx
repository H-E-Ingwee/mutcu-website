import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import { Link } from 'react-router-dom'

export default function RMCSpecialPage() {
  return (
    <div>
      <PageHero title="Resource Mobilization Committee" subtitle="Mobilizing financial and material resources to support the Union's ministry and programs." image="/assets/images/church2.jpg" badge="Special Committee" />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="About the RMC" />
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>The Resource Mobilization Committee (RMC) is responsible for ensuring that MUTCU has the financial and material resources needed to fulfill its mission. The RMC works alongside the Treasurer to identify funding opportunities, build partnerships, and mobilize resources for the Union's programs and activities.</p>
            <p>The RMC operates with a spirit of faithful stewardship, recognizing that all resources belong to God and are to be managed with integrity, transparency, and accountability. The committee supports the Union's financial sustainability while maintaining the highest standards of financial ethics.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {['Identifying and pursuing funding opportunities', 'Building relationships with donors and sponsors', 'Organizing fundraising events and activities', 'Supporting the Treasurer in financial planning', 'Mobilizing material resources for ministry', 'Promoting a culture of stewardship and generosity'].map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{r}</span>
                </div>
              ))}
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