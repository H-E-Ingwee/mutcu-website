import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ministriesAPI } from '../lib/api'
import PageHero from './PageHero'
import SectionTitle from './SectionTitle'

export default function MinistryPage({ slug, heroImage, title, subtitle, icon, description, activities, coordinator, coordinatorSlug, additionalSections }) {
  const [ministry, setMinistry] = useState(null)

  useEffect(() => {
    ministriesAPI.getBySlug(slug)
      .then(data => setMinistry(data.ministry))
      .catch(() => {})
  }, [slug])

  const displayTitle = ministry?.name || title
  const displayDesc = ministry?.long_description || ministry?.description || description?.[0]

  return (
    <div>
      <PageHero
        title={displayTitle}
        subtitle={subtitle}
        image={ministry?.image_url || heroImage}
        badge="MUTCU Ministry"
      />

      {/* Ministry Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                <i className={`fas ${ministry?.icon || icon}`} /> Ministry Overview
              </div>
              <h2 className="font-montserrat font-black text-navy text-3xl mb-4">{displayTitle}</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-5" />
              {description?.map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
              ))}
              {coordinatorSlug && (
                <Link to={`/committees/${coordinatorSlug}`} className="btn-primary mt-2">
                  <i className="fas fa-user-tie" /> Meet the Coordinator
                </Link>
              )}
            </div>
            <div data-aos="fade-left">
              <img
                src={ministry?.image_url || heroImage}
                alt={displayTitle}
                className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                onError={e => { e.target.src = 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      {activities && activities.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="What We Do" subtitle={`Key activities and programs of the ${displayTitle}.`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((act, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
                  data-aos="fade-up" data-aos-delay={i * 80}>
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                    <i className={`fas ${act.icon || 'fa-star'} text-orange`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-navy mb-2">{act.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {additionalSections}

      {/* Join CTA */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange/20 flex items-center justify-center mx-auto mb-4">
            <i className={`fas ${ministry?.icon || icon} text-orange text-2xl`} />
          </div>
          <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the {displayTitle}</h3>
          <p className="text-white/60 mb-6">Discover your gift and serve God through this ministry.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary">Join MUTCU</Link>
            <Link to="/ministries" className="btn-outline-white">All Ministries</Link>
          </div>
        </div>
      </section>
    </div>
  )
}