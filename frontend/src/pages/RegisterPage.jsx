import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'

export default function RegisterPage() {
  return (
    <div>
      <PageHero
        title="Join MUTCU"
        subtitle="Become part of a Christ-centred family committed to discipleship, fellowship, and service."
        image="/assets/images/church2.jpg"
        badge="Membership Registration"
      />

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Info */}
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-montserrat font-bold uppercase tracking-wider mb-4">
                <i className="fas fa-user-plus" /> New Members Welcome
              </div>
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">
                Register on the MUTCU Member Portal
              </h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-6" />
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                MUTCU membership is now managed through our Digital Management System (DMS) at{' '}
                <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="text-orange font-bold hover:underline">
                  portal.mutcu.org
                </a>. Register there to become an official MUTCU member.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: 'fa-user-circle', title: 'Create Your Account', text: 'Visit portal.mutcu.org and complete the registration form with your personal and academic details.' },
                  { icon: 'fa-cross', title: 'Faith Declaration', text: 'Affirm your personal faith in Jesus Christ as required by the MUTCU Constitution (Art. 8.2).' },
                  { icon: 'fa-check-circle', title: 'Secretary Approval', text: 'Your registration will be reviewed and approved by the CU Secretary.' },
                  { icon: 'fa-id-card', title: 'Get Your MUTCU Number', text: 'Once approved, you\'ll receive your unique MUTCU membership number and digital member card.' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${step.icon} text-orange`} />
                    </div>
                    <div>
                      <h5 className="font-montserrat font-bold text-navy text-sm mb-1">{step.title}</h5>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="https://portal.mutcu.org/register" target="_blank" rel="noopener noreferrer"
                className="btn-primary btn-lg">
                <i className="fas fa-user-plus" /> Register on Member Portal
              </a>
            </div>

            {/* Portal Preview Card */}
            <div data-aos="fade-left">
              <div className="bg-navy rounded-3xl p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-orange/20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-laptop text-orange text-3xl" />
                </div>
                <h3 className="font-montserrat font-black text-white text-2xl mb-3">MUTCU Member Portal</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  The official MUTCU Digital Management System — your gateway to membership, nominations, ministry, and more.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left space-y-3">
                  {[
                    'Digital membership card with QR code',
                    'Ministry registration and management',
                    'Nomination and election participation',
                    'Spiritual calendar and announcements',
                    'Secure member directory',
                  ].map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-white/70 text-sm">
                      <i className="fas fa-check-circle text-teal flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full justify-center">
                  <i className="fas fa-external-link-alt" /> Visit portal.mutcu.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Membership Requirements" subtitle="As per the MUTCU Constitution 2025 (Article 8)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { icon: 'fa-university', title: 'MUT Student', text: 'You must be a registered student at Murang\'a University of Technology.' },
              { icon: 'fa-cross', title: 'Personal Faith', text: 'You must have a personal faith in Jesus Christ and affirm the MUTCU doctrinal basis.' },
              { icon: 'fa-calendar', title: 'Academic Year', text: 'You must have completed at least one academic year (first-years are associate members).' },
              { icon: 'fa-file-signature', title: 'Faith Declaration', text: 'You must sign the faith declaration as required by the Constitution (Art. 8.2).' },
              { icon: 'fa-user-check', title: 'Secretary Approval', text: 'Your membership must be approved by the CU Secretary.' },
              { icon: 'fa-heart', title: 'Commitment', text: 'A commitment to participate in fellowship, ministry, and the life of the Union.' },
            ].map((req, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                data-aos="fade-up" data-aos-delay={i * 60}>
                <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center mb-3">
                  <i className={`fas ${req.icon} text-orange`} />
                </div>
                <h5 className="font-montserrat font-bold text-navy mb-2">{req.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{req.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions CTA */}
      <section className="py-16 bg-orange text-center">
        <div className="max-w-2xl mx-auto px-4" data-aos="zoom-in">
          <h3 className="font-montserrat font-black text-white text-3xl mb-3">Have Questions?</h3>
          <p className="text-white/90 text-lg mb-6">Our team is happy to help you with the registration process.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn-navy btn-lg">Contact Us</Link>
            <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-outline-white btn-lg">
              Visit Portal
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}