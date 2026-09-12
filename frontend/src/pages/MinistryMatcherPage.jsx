import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import SEO from '../components/SEO'
import AIMinistryMatcher from '../components/AIMinistryMatcher'

export default function MinistryMatcherPage() {
  return (
    <>
      <SEO
        title="Find Your Ministry | MUTCU"
        description="Take our AI-powered quiz to discover which MUTCU ministry best matches your gifts, passion, and personality. Powered by Google Gemini."
        url="/find-your-ministry"
        keywords="MUTCU ministry quiz, find your ministry MUTCU, MUTCU ministry match, Murang'a University Christian Union ministry"
      />

      <PageHero
        title="Find Your Ministry"
        subtitle="Answer 5 quick questions and our AI will recommend the MUTCU ministry that best matches your gifts, passion, and personality."
        image="/assets/images/church2.jpg"
        badge="AI-Powered · Gemini"
      />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Info sidebar */}
            <div className="lg:col-span-2" data-aos="fade-right">
              <SectionTitle title="How It Works" center={false} />
              <div className="space-y-5">
                {[
                  { step: '1', icon: 'fa-question-circle', title: 'Answer 5 Questions', desc: 'Tell us about your passion, gifts, preferred activities, personality, and available time.' },
                  { step: '2', icon: 'fa-robot', title: 'AI Analyses Your Answers', desc: 'Google Gemini AI processes your responses and matches them against all 10 MUTCU ministries.' },
                  { step: '3', icon: 'fa-star', title: 'Get Your Match', desc: 'Receive a personalized recommendation with an explanation of why this ministry fits you.' },
                  { step: '4', icon: 'fa-church', title: 'Join Your Ministry', desc: 'Visit the ministry page to learn more, then register as a MUTCU member to get involved.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4" data-aos="fade-up" data-aos-delay={i * 80}>
                    <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${item.icon} text-orange`} />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-navy text-sm mb-1">{item.title}</div>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-navy rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-robot text-orange" />
                  <span className="font-montserrat font-bold text-white text-sm">Powered by Google Gemini AI</span>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">Our AI has been trained to understand the unique character, mandate, and activities of each MUTCU ministry as defined in the MUTCU Leadership Manual 2025.</p>
              </div>
            </div>

            {/* Quiz */}
            <div className="lg:col-span-3" data-aos="fade-left">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <AIMinistryMatcher />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Ministries */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="Explore All Ministries" subtitle="Browse all 10 MUTCU ministries and find where God is calling you to serve." />
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Prayer Ministry', link: '/ministries/prayer-ministry', icon: 'fa-praying-hands' },
              { label: 'Music Ministry', link: '/ministries/music-ministry', icon: 'fa-music' },
              { label: 'Missions & Evangelism', link: '/ministries/missions-evangelism', icon: 'fa-globe' },
              { label: 'Bible Study & Training', link: '/ministries/bible-study', icon: 'fa-book-open' },
              { label: 'Discipleship', link: '/ministries/discipleship', icon: 'fa-user-friends' },
              { label: 'Creative Arts (CREAM)', link: '/ministries/creative-arts', icon: 'fa-theater-masks' },
              { label: 'Technical & Media', link: '/ministries/technical-department', icon: 'fa-photo-video' },
              { label: 'Hospitality', link: '/ministries/hospitality-ministry', icon: 'fa-mug-hot' },
              { label: 'Welfare Committee', link: '/ministries/welfare-committee', icon: 'fa-hand-holding-heart' },
              { label: 'RMC', link: '/ministries/rmc', icon: 'fa-donate' },
            ].map((m, i) => (
              <a key={i} href={m.link}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-orange hover:text-white font-montserrat font-semibold text-sm transition-all"
                data-aos="fade-up" data-aos-delay={i * 30}>
                <i className={`fas ${m.icon} text-xs`} />{m.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}