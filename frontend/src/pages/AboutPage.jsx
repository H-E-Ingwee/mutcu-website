import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { leadershipAPI } from '../lib/api'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const ROLE_SLUG_MAP = {
  'Chairman': 'chairman', 'Chairperson': 'chairman', 'Chairperson of Union': 'chairman',
  '1st Vice Chair': 'vice-chair1', '1st Vice Chairperson': 'vice-chair1',
  '2nd Vice Chair': 'vice-chair2', '2nd Vice Chairperson': 'vice-chair2',
  'Secretary': 'secretary', 'CU Secretary': 'secretary',
  'Vice Secretary': 'vice-secretary',
  'Treasurer': 'treasurer', 'CU Treasurer': 'treasurer',
  'Bible Study & Training / Discipleship Chair': 'bible-study',
  'Prayer Ministry Coordinator': 'prayer',
  'Missions & Evangelism Coordinator': 'missions',
  'Music Ministry Coordinator': 'music',
  'Technical and Media Ministry Coordinator': 'technical',
  'Creative Arts Ministry Coordinator': 'creative',
}

function getRoleSlug(role) {
  if (!role) return null
  for (const [key, slug] of Object.entries(ROLE_SLUG_MAP)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return slug
  }
  return role.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

const CORE_VALUES = [
  { icon: 'fa-cross', title: 'Faith', description: "Rooted in the teachings of the Bible and a personal relationship with Jesus Christ expressed through prayer, worship, and in-depth Bible study." },
  { icon: 'fa-heart', title: 'Love', description: "Demonstrating God's unconditional love through genuine fellowship and a welcoming heart for all." },
  { icon: 'fa-lightbulb', title: 'Hope', description: "Being a source of hope through positive words, encouraging actions, and unwavering faith in uncertain times." },
  { icon: 'fa-church', title: 'Godliness', description: "Striving for lives that honour and glorify God in all we do—personally and collectively." },
  { icon: 'fa-user-check', title: 'Accountability', description: "Fostering welfare, unity, and mutual responsibility—being answerable to one another in actions and decisions." },
  { icon: 'fa-hand-holding-heart', title: 'Service', description: "Putting faith into action by serving practical needs within the university and the wider community." },
]

const AIMS = [
  { icon: 'fa-book-open', title: 'Discipleship', description: 'To deepen and strengthen the spiritual life of members through study of the Bible, prayer, and Christian fellowship.' },
  { icon: 'fa-bullhorn', title: 'Evangelism', description: 'To faithfully proclaim the Gospel of Jesus Christ in word and deed—leading individuals into personal faith and transformed lives as disciples.' },
  { icon: 'fa-globe-africa', title: 'Mission Work', description: 'To share in witnessing Christ by encouraging members toward practical involvement according to their calling, gifting, and training.' },
  { icon: 'fa-chess-king', title: 'Leadership Development & Mentorship', description: 'To equip members through modelling and mentorship, fostering responsibility and stewardship—growing leaders with positive influence.' },
]

const DOCTRINAL_POINTS = [
  'The unity of the Father, Son and Holy Spirit in the Godhead.',
  'The sovereignty of God in creation, redemption and final judgment.',
  'The divine inspiration and entire trustworthiness of Holy Scripture and its supreme authority in faith and conduct.',
  "The universal sinfulness and guilt of all men since the fall, rendering them subjects to God's wrath and condemnation.",
  'Redemption solely through the sacrificial death of the Lord Jesus Christ, the incarnate Son of God.',
  'The bodily resurrection of the Lord Jesus Christ from the dead and His ascension to the right hand of God the Father.',
  'The presence and work of the Holy Spirit in regeneration.',
  'Justification of the sinner by the grace of God through faith alone.',
  'The indwelling and work of the Holy Spirit in every believer.',
  'The one holy universal church which is the body of Christ and to which all believers belong.',
  'The expectation of the personal return of the Lord Jesus Christ.',
  'The unity of all believers in Christ.',
]

const ACCENT_COLORS = ['#FF9700', '#04003D', '#FF9700', '#30D5C8', '#FF9700', '#04003D', '#30D5C8', '#FF9700', '#04003D', '#FF9700', '#30D5C8', '#04003D']

export default function AboutPage() {
  const [leadership, setLeadership] = useState([])
  const [patrons, setPatrons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      leadershipAPI.getAll(),
      leadershipAPI.getPatrons(),
    ]).then(([leadData, patronData]) => {
      setLeadership(leadData.leadership || [])
      setPatrons(patronData.patrons || [])
    }).catch(() => {
      // Use fallback static data if API fails
      setLeadership(FALLBACK_LEADERSHIP)
      setPatrons(FALLBACK_PATRONS)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHero
        title="Our Identity & Faith"
        subtitle="Murang'a University of Technology Christian Union (MUTCU) is a non-denominational, non-political, and non-profit Christian society grounded on the authority of Scripture."
        image="/assets/images/church2.jpg"
        badge="MUTCU · Constitution 2025"
      />

      {/* ─── Who We Are ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-10 flex flex-col justify-center">
              <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Our Foundation</div>
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                MUTCU is a vibrant, student-led Christian Society at Murang'a University of Technology, committed to
                discipleship, evangelism, mission work, and leadership development — anchored in the supremacy of the Holy Bible.
              </p>
              <div className="border-l-4 border-teal bg-gray-50 rounded-r-xl p-4">
                <p className="text-navy text-sm font-medium">
                  Affiliated to{' '}
                  <a href="https://focuskenya.org/" className="text-teal font-bold hover:underline" target="_blank" rel="noreferrer">
                    Fellowship of Christian Unions (FOCUS-KENYA)
                  </a>.
                </p>
              </div>
            </div>
            <div className="bg-navy flex items-center justify-center p-10">
              <img src="/assets/images/best logo.png" alt="MUTCU Logo"
                className="max-h-56 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(48,213,200,0.3))' }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Motto / Vision / Mission ───────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Our Motto', text: 'Inspire Love, Hope and Godliness.', icon: 'fa-quote-left', bg: '#FF9700' },
              { title: 'Our Vision', text: 'To be a model Christian union that cultivates Christ-centeredness among members to positively impact the society.', icon: 'fa-eye', bg: '#30D5C8' },
              { title: 'Our Mission', text: 'Raising a Christ-like family, equipped in all aspects of life, by encouraging unity as one body and reaching out to non-believers within our community and beyond.', icon: 'fa-chess-king', bg: '#04003D' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: item.bg }}>
                  <i className={`fas ${item.icon} text-white text-xl`} />
                </div>
                <h4 className="font-montserrat font-bold text-navy text-lg mb-3">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Values ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Core Values" subtitle="The values that shape our identity and guide our fellowship." center light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_VALUES.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                data-aos="zoom-in" data-aos-delay={i * 80}>
                <div className="flex items-start gap-4">
                  <i className={`fas ${v.icon} text-teal text-2xl mt-1 flex-shrink-0`} />
                  <div>
                    <h5 className="font-montserrat font-bold text-white mb-2">{v.title}</h5>
                    <p className="text-white/60 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Aims ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Aims" subtitle="What we pursue as MUTCU in obedience to Christ and His Word." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AIMS.map((aim, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                  <i className={`fas ${aim.icon} text-white`} />
                </div>
                <h5 className="font-montserrat font-bold text-navy mb-2">{aim.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{aim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Doctrinal Basis ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2" data-aos="fade-right">
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">Our Doctrinal Basis</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-5" />
              <p className="text-gray-600 text-lg leading-relaxed">
                The fundamental truths of Christianity that unify our belief and guide our conduct.
              </p>
            </div>
            <div className="lg:col-span-3" data-aos="fade-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DOCTRINAL_POINTS.map((point, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 border-l-4 border-orange flex items-start gap-2">
                    <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />
                    <span className="text-navy text-sm font-medium leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Patron's Office ────────────────────────────────────────────────── */}
      {patrons.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionTitle title="Patron's Office" />
            <div className="flex flex-wrap justify-center gap-8">
              {patrons.map((patron, i) => (
                <div key={patron.id || i} className="leader-card" data-aos="zoom-in" data-aos-delay={i * 100}>
                  <img
                    src={patron.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(patron.name)}&background=04003D&color=FF9700&size=200&bold=true`}
                    alt={patron.name} className="leader-img"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patron.name)}&background=04003D&color=FF9700&size=200&bold=true` }}
                  />
                  <h6 className="font-montserrat font-bold text-navy">{patron.name}</h6>
                  <p className="text-orange text-xs font-bold uppercase tracking-wider mt-1">{patron.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Executive Committee ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="The Executive Committee" subtitle="Servant leaders committed to inspiring love, hope, and godliness." />
          {loading ? <LoadingSpinner text="Loading leadership..." /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {leadership.map((member, i) => {
                const slug = member.role_slug || getRoleSlug(member.role)
                const card = (
                  <div className="leader-card">
                    <img
                      src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=04003D&color=FF9700&size=200&bold=true`}
                      alt={member.name} className="leader-img"
                      style={{ borderColor: ACCENT_COLORS[i % ACCENT_COLORS.length] }}
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=04003D&color=FF9700&size=200&bold=true` }}
                    />
                    <h6 className="font-montserrat font-bold text-navy text-sm">{member.name}</h6>
                    <p className="text-teal text-xs font-bold uppercase tracking-wider mt-1">{member.role}</p>
                  </div>
                )
                return (
                  <div key={member.id || i} data-aos="zoom-in" data-aos-delay={i * 50}>
                    {slug ? <Link to={`/committees/${slug}`} className="block text-decoration-none">{card}</Link> : card}
                  </div>
                )
              })}
            </div>
          )}
          {!loading && leadership.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-users text-4xl mb-3 block" />
              <p>Leadership information will be updated soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-teal text-center">
        <div className="max-w-3xl mx-auto px-4" data-aos="fade-up">
          <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">Become a Part of the Family</h2>
          <p className="text-navy/70 text-lg mb-8">Join MUTCU and be part of a Christ-centred community that builds faith, character, and purpose.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-navy btn-lg">Join MUTCU Now</Link>
            <Link to="/ministries" className="btn-outline btn-lg">Explore Ministries</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Fallback static data (used if API is unavailable)
const FALLBACK_LEADERSHIP = [
  { id: '1', name: 'Purdri Kihika', role: 'Chairman', role_slug: 'chairman', photo_url: '/assets/images/PADRI.jpeg' },
  { id: '2', name: 'Purity Njeri', role: '1st Vice Chair', role_slug: 'vice-chair1', photo_url: '/assets/images/PURITY.jpeg' },
  { id: '3', name: 'David Kimani', role: '2nd Vice Chair', role_slug: 'vice-chair2', photo_url: '/assets/images/DAVID.jpeg' },
  { id: '4', name: 'Faith Wavinya', role: 'Secretary', role_slug: 'secretary', photo_url: '/assets/images/FAITH.jpeg' },
  { id: '5', name: 'Natasha Amani', role: 'Vice Secretary', role_slug: 'vice-secretary', photo_url: '/assets/images/AMANI.jpeg' },
  { id: '6', name: 'Mercy Mwaura', role: 'Treasurer', role_slug: 'treasurer', photo_url: '/assets/images/MERCY.jpeg' },
  { id: '7', name: 'Caleb Esere', role: 'Bible Study & Training / Discipleship Chair', role_slug: 'bible-study', photo_url: '/assets/images/CALEB.jpg' },
  { id: '8', name: 'Martha Thuku', role: 'Prayer Ministry Coordinator', role_slug: 'prayer', photo_url: '/assets/images/MARTHA.jpeg' },
  { id: '9', name: 'Mercy Mutuku', role: 'Missions & Evangelism Coordinator', role_slug: 'missions', photo_url: '/assets/images/MUTUKU.jpeg' },
  { id: '10', name: 'Peter Vaati', role: 'Music Ministry Coordinator', role_slug: 'music', photo_url: '/assets/images/PETER.jpg' },
  { id: '11', name: 'John Mwanthi', role: 'Technical and Media Ministry Coordinator', role_slug: 'technical', photo_url: '/assets/images/JOHN.jpeg' },
  { id: '12', name: 'Esther Karimeri', role: 'Creative Arts Ministry Coordinator', role_slug: 'creative', photo_url: '/assets/images/ESTHER.jpeg' },
]

const FALLBACK_PATRONS = [
  { id: 'p1', name: 'Dr. John Ndia', role: 'Patron', photo_url: '/assets/images/Ndia.jpg' },
  { id: 'p2', name: 'Dr. Tabitha Karanja', role: 'Assistant to the Patron', photo_url: '/assets/images/TABITHA.jpg' },
]