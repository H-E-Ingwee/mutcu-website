import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import { Link } from 'react-router-dom'

export default function InterimECPage() {
  return (
    <div>
      <PageHero title="Interim Executive Council" subtitle="Providing continuity of leadership during the transition period between academic years." image="/assets/images/church2.jpg" badge="Special Committee" />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="About the Interim Executive Council" />
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>The Interim Executive Council (Interim EC) provides continuity of leadership during the transition period between the end of one academic year and the commissioning of the new Executive Council. This ensures that the Union's activities and programs continue without interruption during this critical period.</p>
            <p>The Interim EC typically serves from the end of the academic year (around May) until the new EC is commissioned following the Annual General Meeting (AGM) in October. During this period, the Interim EC maintains the Union's operations, coordinates with FOCUS Kenya, and prepares for the transition to the new leadership.</p>
            <div className="bg-orange/5 border border-orange/20 rounded-2xl p-6 mt-6">
              <h4 className="font-montserrat font-bold text-navy mb-3 flex items-center gap-2">
                <i className="fas fa-info-circle text-orange" /> Interim Period (May – October)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Maintaining Union operations during transition', 'Coordinating with FOCUS Kenya and the Patron', 'Preparing for the new academic year', 'Supporting the nomination and election process', 'Ensuring continuity of ministry programs', 'Handover to the newly commissioned EC'].map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                    {r}
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