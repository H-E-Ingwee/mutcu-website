import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { leadershipAPI } from '../lib/api'
import PageHero from './PageHero'
import SectionTitle from './SectionTitle'
import LoadingSpinner from './LoadingSpinner'

export default function CommitteePage({ roleSlug, fallback, heroImage, officeTitle, officeSubtitle, responsibilities, description, additionalSections }) {
  const [leader, setLeader] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leadershipAPI.getByRole(roleSlug)
      .then(data => setLeader(data.leader))
      .catch(() => setLeader(fallback || null))
      .finally(() => setLoading(false))
  }, [roleSlug])

  const person = leader || fallback

  return (
    <div>
      <PageHero
        title={officeTitle}
        subtitle={officeSubtitle}
        image={person?.photo_url || heroImage}
        badge="Executive Committee"
      />

      {/* Leader Profile */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <LoadingSpinner text="Loading..." /> : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Photo Card */}
              <div className="text-center" data-aos="zoom-in">
                <div className="relative inline-block">
                  <img
                    src={person?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person?.name || 'Leader')}&background=04003D&color=FF9700&size=400&bold=true`}
                    alt={person?.name}
                    className="w-56 h-56 rounded-2xl object-cover shadow-2xl border-4 border-orange mx-auto"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person?.name || 'Leader')}&background=04003D&color=FF9700&size=400&bold=true` }}
                  />
                  <div className="absolute -bottom-3 -right-3 bg-orange rounded-xl px-3 py-1.5 shadow-lg">
                    <span className="text-white text-xs font-montserrat font-bold">EC {new Date().getFullYear()}</span>
                  </div>
                </div>
                <h3 className="font-montserrat font-black text-navy text-xl mt-6 mb-1">{person?.name || 'To be announced'}</h3>
                <p className="text-orange font-bold text-sm uppercase tracking-wider mb-4">{person?.role || officeTitle}</p>
                {person?.email && (
                  <a href={`mailto:${person.email}`} className="text-teal text-sm hover:underline flex items-center justify-center gap-2">
                    <i className="fas fa-envelope" />{person.email}
                  </a>
                )}
                <div className="mt-6 flex flex-col gap-2">
                  <Link to="/about" className="btn-outline btn-sm justify-center">← Back to About</Link>
                  <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm justify-center">
                    <i className="fas fa-user-circle" /> Member Portal
                  </a>
                </div>
              </div>

              {/* Bio & Personal Message */}
              <div className="lg:col-span-2" data-aos="fade-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                  <i className="fas fa-user-tie" /> About the Office
                </div>
                <h2 className="font-montserrat font-black text-navy text-2xl md:text-3xl mb-4">{officeTitle}</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />

                {description && description.map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
                ))}

                {/* Personal message from leader */}
                {person?.personal_message && (
                  <div className="bg-navy/5 border-l-4 border-orange rounded-r-2xl p-5 mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="fas fa-quote-left text-orange" />
                      <span className="font-montserrat font-bold text-navy text-sm">A Word from {person.name?.split(' ')[0]}</span>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">{person.personal_message}</p>
                  </div>
                )}

                {/* Bio */}
                {person?.bio && (
                  <div className="mt-5 bg-gray-50 rounded-2xl p-5">
                    <h4 className="font-montserrat font-bold text-navy mb-3 flex items-center gap-2">
                      <i className="fas fa-id-card text-teal" /> Biography
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{person.bio}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Responsibilities */}
      {responsibilities && responsibilities.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Key Roles & Responsibilities" subtitle={`The ${officeTitle} is central to MUTCU's governance and spiritual guidance.`} />
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {responsibilities.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  data-aos="fade-up" data-aos-delay={i * 60}>
                  <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {additionalSections}

      {/* CTA */}
      <section className="py-16 bg-navy text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="font-montserrat font-black text-white text-2xl mb-3">Be Part of the MUTCU Family</h3>
          <p className="text-white/60 mb-6">Join us in fellowship, ministry, and service.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary">Join MUTCU</Link>
            <Link to="/ministries" className="btn-outline-white">Explore Ministries</Link>
          </div>
        </div>
      </section>
    </div>
  )
}