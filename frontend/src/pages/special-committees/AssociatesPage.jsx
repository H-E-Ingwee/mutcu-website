import PageHero from '../../components/PageHero'
import SectionTitle from '../../components/SectionTitle'
import { Link } from 'react-router-dom'

export default function AssociatesPage() {
  return (
    <div>
      <PageHero title="Associates Committee" subtitle="Connecting MUTCU alumni and associate members to the ongoing life and mission of the Union." image="/assets/images/church2.jpg" badge="Special Committee" />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="About the Associates Committee" />
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>The Associates Committee connects MUTCU alumni and associate members — including graduates and former students — to the ongoing life and mission of the Union. Associates are a vital part of the MUTCU family, bringing experience, mentorship, and continued support to the student community.</p>
            <p>Associate members may include graduates of MUT who were active MUTCU members, as well as other individuals who support the Union's mission. While they do not hold voting rights in the Union, they contribute significantly through mentorship, prayer, and practical support.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {['Connecting alumni to the Union community', 'Facilitating mentorship between alumni and current members', 'Supporting the Union through prayer and practical assistance', 'Organizing alumni fellowship and networking events', 'Preserving and sharing the history and legacy of MUTCU', 'Encouraging continued spiritual growth among alumni'].map((r, i) => (
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