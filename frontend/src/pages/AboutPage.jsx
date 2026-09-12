import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { leadershipAPI } from '../lib/api'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'

// ─── Exact text from MUTCU Constitution 2025, Art. 5.3 ───────────────────────
const CORE_VALUES = [
  {
    icon: 'fa-cross', title: 'Faith',
    text: 'We are rooted in the teachings of the Bible and a personal relationship with Jesus Christ expressed through our commitment to prayer, worship, and in-depth Bible study.',
  },
  {
    icon: 'fa-heart', title: 'Love',
    text: "We strive to demonstrate God's unconditional love through genuine fellowship and a welcoming heart for all.",
  },
  {
    icon: 'fa-lightbulb', title: 'Hope',
    text: 'In a world that is often uncertain, we aim to be a source of hope, inspiring our community through our positive words, encouraging actions, and unwavering faith.',
  },
  {
    icon: 'fa-church', title: 'Godliness',
    text: 'We are committed to striving for lives that honour and glorify God in all that we do, both in our personal conduct and in our collective activities.',
  },
  {
    icon: 'fa-user-check', title: 'Accountability',
    text: 'We shall demonstrate fellowship, support, and solidarity with one another, fostering welfare and unity within the Christian Union, while being accountable and answerable to one another in all our actions and decisions.',
  },
  {
    icon: 'fa-hand-holding-heart', title: 'Service',
    text: 'We believe in putting our faith into action by reaching out to serve the practical needs of others within the university and the wider community.',
  },
]

// ─── Exact text from Art. 6 ───────────────────────────────────────────────────
const AIMS = [
  {
    icon: 'fa-book-open', title: 'Discipleship',
    text: 'To deepen and strengthen the spiritual life of its members by the study of the Bible, prayer and Christian fellowship.',
  },
  {
    icon: 'fa-bullhorn', title: 'Evangelism',
    text: 'To faithfully proclaim the gospel of Jesus Christ in word and deed, with the vision of leading individuals into a personal faith in Him and transformed lives as His disciples.',
  },
  {
    icon: 'fa-globe-africa', title: 'Mission Work',
    text: 'To share in the life of witnessing Christ by encouraging Christian Union members towards practical involvement in the same, according to their calling, gifting and training.',
  },
  {
    icon: 'fa-chess-king', title: 'Leadership Development & Mentorship',
    text: 'To equip The Christian Union members through modelling and mentorship, fostering personal responsibility and communal stewardship, so that they may grow into fruitful leaders with a positive influence.',
  },
]

// ─── Exact text from Art. 7 with Bible references ────────────────────────────
const DOCTRINAL_POINTS = [
  { text: 'The unity of the Father, Son and Holy Spirit in the Godhead.', ref: 'Matthew 28:19; Colossians 2:9' },
  { text: 'The sovereignty of God in creation, redemption and final judgment.', ref: 'John 1:1-5' },
  { text: 'The divine inspiration and entire trustworthiness of Holy Scripture as originally given and its supreme authority in all matters of faith and conduct.', ref: 'Hebrews 4:12; 2 Timothy 3:15-16' },
  { text: 'The universal sinfulness and guilt of all men since the fall, rendering them subjects to God\'s wrath and condemnation.', ref: 'Romans 3:10, 23' },
  { text: 'Redemption from guilt, penalty, dominion and pollution of sin(s), solely through the sacrificial death of the Lord Jesus Christ, the incarnate Son of God.', ref: 'Romans 6:23' },
  { text: 'The bodily resurrection of the Lord Jesus Christ from the dead and His ascension to the right hand of God the Father.', ref: 'Mark 16:19' },
  { text: 'The presence and the work of the Holy Spirit in the work of regeneration.', ref: 'Titus 3:5-6' },
  { text: 'The justification of the sinner by the grace of God through faith alone.', ref: 'Galatians 3:26; Ephesians 2:8' },
  { text: 'The indwelling and the work of the Holy Spirit in every believer.', ref: 'Romans 8' },
  { text: 'The one holy universal church which is the body of Christ and to which all believers belong.', ref: 'Ephesians 2:21' },
  { text: 'The expectation of personal return of the Lord Jesus Christ.', ref: '1 John 2:28' },
  { text: 'The unity of all believers in Christ.', ref: 'Ephesians 4:16' },
]

const ACCENT_COLORS = ['#FF9700', '#04003D', '#FF9700', '#30D5C8', '#FF9700', '#04003D', '#30D5C8', '#FF9700', '#04003D', '#FF9700', '#30D5C8', '#04003D']

const ROLE_SLUG_MAP = {
  'Chairman': 'chairman', 'Chairperson': 'chairman', 'Chairperson of Union': 'chairman',
  '1st Vice Chair': 'vice-chair1', '1st Vice Chairperson': 'vice-chair1', 'First Vice Chairperson': 'vice-chair1',
  '2nd Vice Chair': 'vice-chair2', '2nd Vice Chairperson': 'vice-chair2', 'Second Vice Chairperson': 'vice-chair2',
  'Secretary': 'secretary', 'CU Secretary': 'secretary',
  'Vice Secretary': 'vice-secretary',
  'Treasurer': 'treasurer', 'CU Treasurer': 'treasurer',
  'Bible Study': 'bible-study', 'Discipleship': 'bible-study',
  'Prayer': 'prayer',
  'Missions': 'missions',
  'Music': 'music',
  'Technical': 'technical',
  'Creative': 'creative',
}

function getRoleSlug(role) {
  if (!role) return null
  for (const [key, slug] of Object.entries(ROLE_SLUG_MAP)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return slug
  }
  return null
}

const FALLBACK_LEADERSHIP = [
  { id: '1', name: 'Purdri Kihika', role: 'Chairman', role_slug: 'chairman', photo_url: '/assets/images/PADRI.jpeg' },
  { id: '2', name: 'Purity Njeri', role: '1st Vice Chairperson', role_slug: 'vice-chair1', photo_url: '/assets/images/PURITY.jpeg' },
  { id: '3', name: 'David Kimani', role: '2nd Vice Chairperson', role_slug: 'vice-chair2', photo_url: '/assets/images/DAVID.jpeg' },
  { id: '4', name: 'Faith Wavinya', role: 'CU Secretary', role_slug: 'secretary', photo_url: '/assets/images/FAITH.jpeg' },
  { id: '5', name: 'Natasha Amani', role: 'Vice Secretary', role_slug: 'vice-secretary', photo_url: '/assets/images/AMANI.jpeg' },
  { id: '6', name: 'Mercy Mwaura', role: 'CU Treasurer', role_slug: 'treasurer', photo_url: '/assets/images/MERCY.jpeg' },
  { id: '7', name: 'Caleb Esere', role: 'Bible Study & Training / Discipleship Chair', role_slug: 'bible-study', photo_url: '/assets/images/CALEB.jpg' },
  { id: '8', name: 'Martha Thuku', role: 'Prayer Ministry Coordinator', role_slug: 'prayer', photo_url: '/assets/images/MARTHA.jpeg' },
  { id: '9', name: 'Mercy Mutuku', role: 'Missions & Evangelism Coordinator', role_slug: 'missions', photo_url: '/assets/images/MUTUKU.jpeg' },
  { id: '10', name: 'Peter Vaati', role: 'Music Ministry Coordinator', role_slug: 'music', photo_url: '/assets/images/PETER.jpg' },
  { id: '11', name: 'John Mwanthi', role: 'Technical & Media Ministry Coordinator', role_slug: 'technical', photo_url: '/assets/images/JOHN.jpeg' },
  { id: '12', name: 'Esther Karimeri', role: 'Creative Arts Ministry Coordinator', role_slug: 'creative', photo_url: '/assets/images/ESTHER.jpeg' },
]

const FALLBACK_PATRONS = [
  { id: 'p1', name: 'Dr. John Ndia', role: 'Patron', photo_url: '/assets/images/Ndia.jpg' },
  { id: 'p2', name: 'Dr. Tabitha Karanja', role: 'Assistant to the Patron', photo_url: '/assets/images/TABITHA.jpg' },
]

export default function AboutPage() {
  const [leadership, setLeadership] = useState([])
  const [patrons, setPatrons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPreamble, setShowPreamble] = useState(false)

  useEffect(() => {
    Promise.all([leadershipAPI.getAll(), leadershipAPI.getPatrons()])
      .then(([l, p]) => {
        setLeadership(l.leadership?.length > 0 ? l.leadership : FALLBACK_LEADERSHIP)
        setPatrons(p.patrons?.length > 0 ? p.patrons : FALLBACK_PATRONS)
      })
      .catch(() => { setLeadership(FALLBACK_LEADERSHIP); setPatrons(FALLBACK_PATRONS) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="About MUTCU — Our Identity, Faith & Leadership"
        description="Learn about Murang'a University of Technology Christian Union — our vision, mission, core values, doctrinal basis, and the Executive Council leading the Union."
        url="/about"
        keywords="MUTCU about, MUTCU constitution, MUTCU leadership, Christian Union Murang'a, FOCUS Kenya, MUT Christian Union"
      />

      <PageHero
        title={<>Our <span className="text-teal">Identity</span> & Faith</>}
        subtitle="Murang'a University of Technology Christian Union (MUTCU) is a non-denominational, non-political, and non-profit Christian society grounded on the authority of Scripture."
        image="/assets/images/church2.jpg"
        badge="MUTCU · Constitution 2025"
      />

      {/* ─── Preamble Banner ─────────────────────────────────────────────────── */}
      <section className="bg-navy py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <button onClick={() => setShowPreamble(!showPreamble)}
            className="text-teal text-sm font-montserrat font-bold flex items-center gap-2 mx-auto hover:text-orange transition-colors">
            <i className={`fas fa-chevron-${showPreamble ? 'up' : 'down'}`} />
            {showPreamble ? 'Hide' : 'Read'} the Constitutional Preamble
          </button>
          {showPreamble && (
            <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-6 text-left" data-aos="fade-down">
              <h3 className="font-montserrat font-bold text-orange text-sm uppercase tracking-widest mb-4">Preamble</h3>
              <div className="text-white/80 text-sm leading-relaxed space-y-3">
                <p>We, The Christian Union —</p>
                <p><strong className="text-white">ACKNOWLEDGE</strong> the sovereignty of God in creation, revelation, redemption and final judgement;</p>
                <p><strong className="text-white">COMMITTED</strong> to deepen and strengthen the spiritual life of individuals, as members; witnesses of the Lord incarnate and seek to lead others to a personal faith in Him;</p>
                <p><strong className="text-white">BOUND</strong> by the calling to live holy and righteous lives based on the Holy Bible and following the example of Jesus Christ;</p>
                <p><strong className="text-white">APPRECIATE</strong> our ethnic, cultural, denominational and gender diversities, recognize The Christian Union as non-political, non-denominational and non-profit making society;</p>
                <p><strong className="text-white">ADOPT, ENACT</strong> and give this constitution to ourselves and to the future generations of Murang'a University of Technology Christian Union.</p>
                <p className="text-orange font-montserrat font-bold text-base mt-4">GOD BLESS MUTCU</p>
              </div>
              <div className="mt-5 bg-orange/10 border border-orange/20 rounded-xl p-4">
                <h4 className="font-montserrat font-bold text-orange text-xs uppercase tracking-widest mb-2">Supremacy Declaration</h4>
                <p className="text-white/70 text-sm leading-relaxed italic">
                  "We declare that the Holy Bible is supreme to this Constitution and binds all members of the Murang'a University of Technology Christian Union. Any provision that is inconsistent with the Holy Bible is void to the extent of its inconsistency, and any act of omission in contravention of the Holy Bible is invalid."
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Who We Are ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl shadow-xl overflow-hidden" data-aos="fade-up">
            <div className="p-10 flex flex-col justify-center">
              <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Our Foundation</div>
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">Who We Are</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-5" />
              <p className="text-gray-600 leading-relaxed mb-4">
                MUTCU is a vibrant, student-led Christian Society at Murang'a University of Technology, committed to discipleship, evangelism, mission work, and leadership development — anchored in the supremacy of the Holy Bible.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                The name of the Society shall be <strong>Murang'a University of Technology Christian Union (MUTCU)</strong>, herein referred to as 'The Christian Union (C.U.)'. The Christian Union shall be registered under the office of the Dean of Students of the Murang'a University of Technology.
              </p>
              <div className="border-l-4 border-teal bg-gray-50 rounded-r-xl p-4">
                <p className="text-navy text-sm font-medium">
                  Affiliated to{' '}
                  <a href="https://focuskenya.org/" className="text-teal font-bold hover:underline" target="_blank" rel="noreferrer">
                    Fellowship of Christian Unions (FOCUS Kenya)
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
              { title: 'Our Motto', text: 'Inspire Love, Hope and Godliness.', icon: 'fa-quote-left', bg: '#FF9700', ref: 'Article 2, MUTCU Constitution 2025' },
              { title: 'Our Vision', text: 'To be a model Christian union that cultivates Christ-centeredness among members to positively impact the society.', icon: 'fa-eye', bg: '#30D5C8', ref: 'Article 5.1, MUTCU Constitution 2025' },
              { title: 'Our Mission', text: 'Raising a Christ-like family, equipped in all aspects of life, by encouraging unity as one body and reaching out to non-believers within our community and beyond.', icon: 'fa-chess-king', bg: '#04003D', ref: 'Article 5.2, MUTCU Constitution 2025' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: item.bg }}>
                  <i className={`fas ${item.icon} text-white text-xl`} />
                </div>
                <h4 className="font-montserrat font-bold text-navy text-lg mb-3">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed mb-3">{item.text}</p>
                <p className="text-gray-300 text-xs italic">{item.ref}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Core Values — Exact Constitutional Text ─────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionTitle title="Our Core Values" subtitle="The values that shape our identity and guide our fellowship. — Article 5.3, MUTCU Constitution 2025" center light />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_VALUES.map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                data-aos="zoom-in" data-aos-delay={i * 80}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${v.icon} text-orange text-xl`} />
                  </div>
                  <div>
                    <h5 className="font-montserrat font-bold text-white text-lg mb-2">{v.title}</h5>
                    <p className="text-white/65 text-sm leading-relaxed">{v.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Aims — Exact Constitutional Text ───────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Aims" subtitle="What we pursue as MUTCU in obedience to Christ and His Word. — Article 6, MUTCU Constitution 2025" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AIMS.map((aim, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                  <i className={`fas ${aim.icon} text-orange`} />
                </div>
                <h5 className="font-montserrat font-bold text-navy mb-2">{aim.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed">{aim.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Doctrinal Basis — With Bible References ────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2" data-aos="fade-right">
              <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Article 7</div>
              <h2 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-4">Our Doctrinal Basis</h2>
              <div className="h-1 w-12 bg-orange rounded-full mb-5" />
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                The doctrinal basis of The Christian Union shall be the Fundamental Truth of Christianity including:
              </p>
              <div className="bg-navy/5 border-l-4 border-orange rounded-r-xl p-4">
                <p className="text-navy text-sm font-medium italic">
                  "We declare that the Holy Bible is supreme to this Constitution and binds all members of MUTCU."
                </p>
                <p className="text-gray-400 text-xs mt-1">— Supremacy Declaration, MUTCU Constitution 2025</p>
              </div>
            </div>
            <div className="lg:col-span-3" data-aos="fade-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DOCTRINAL_POINTS.map((point, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 border-l-4 border-orange hover:shadow-sm transition-all">
                    <div className="flex items-start gap-2 mb-1">
                      <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0 text-sm" />
                      <span className="text-navy text-sm font-medium leading-relaxed">{point.text}</span>
                    </div>
                    <div className="ml-5 text-orange text-xs font-montserrat font-bold italic">{point.ref}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Governance Structure ───────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Governance Structure" subtitle="The governance of MUTCU shall be vested on three main organs. — Article 9, MUTCU Constitution 2025" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { num: '1', title: 'The Executive Council', desc: 'The principal governing body responsible for implementing and upholding the aims of The Christian Union.', icon: 'fa-users', link: '/about#ec' },
              { num: '2', title: 'The Sub-Committees', desc: 'Ministry committees and general committees that carry out the day-to-day work of the Union\'s various departments.', icon: 'fa-sitemap', link: '/ministries' },
              { num: '3', title: 'The Advisory Board', desc: 'Provides guidance, wisdom, and oversight to the Executive Council in matters of governance and spiritual direction.', icon: 'fa-shield-alt', link: '/special-committees/advisory-board' },
            ].map((item, i) => (
              <Link key={i} to={item.link} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group"
                data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
                    <i className={`fas ${item.icon} text-orange`} />
                  </div>
                  <span className="font-montserrat font-black text-navy text-2xl opacity-20">{item.num}</span>
                </div>
                <h4 className="font-montserrat font-bold text-navy mb-2 group-hover:text-orange transition-colors">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Patron's Office ────────────────────────────────────────────────── */}
      {patrons.length > 0 && (
        <section className="py-20 bg-white" id="patrons">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionTitle title="Patron's Office" subtitle="Article 13.3 — The Patron provides spiritual oversight and guidance to the Union." />
            <div className="flex flex-wrap justify-center gap-10">
              {patrons.map((patron, i) => (
                <div key={patron.id || i} className="text-center group" data-aos="zoom-in" data-aos-delay={i * 100}>
                  <div className="relative inline-block mb-4">
                    <img
                      src={patron.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(patron.name)}&background=04003D&color=FF9700&size=200&bold=true`}
                      alt={patron.name}
                      className="w-36 h-36 rounded-2xl object-cover shadow-xl border-4 border-orange group-hover:border-teal transition-colors duration-300"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patron.name)}&background=04003D&color=FF9700&size=200&bold=true` }}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-orange rounded-xl px-2 py-1">
                      <i className="fas fa-star text-white text-xs" />
                    </div>
                  </div>
                  <h6 className="font-montserrat font-bold text-navy text-base">{patron.name}</h6>
                  <p className="text-orange text-xs font-bold uppercase tracking-wider mt-1">{patron.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Executive Committee ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50" id="ec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            title="The Executive Council"
            subtitle="Article 12.1 — The Executive Council consists of 13 office bearers serving as the principal governing body of the Christian Union."
          />
          {loading ? <LoadingSpinner text="Loading leadership..." /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {leadership.map((member, i) => {
                const slug = member.role_slug || getRoleSlug(member.role)
                const card = (
                  <div className="group text-center">
                    <div className="relative inline-block mb-3">
                      <img
                        src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=04003D&color=FF9700&size=200&bold=true`}
                        alt={member.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-lg border-3 group-hover:scale-105 transition-transform duration-300"
                        style={{ borderColor: ACCENT_COLORS[i % ACCENT_COLORS.length], borderWidth: '3px', borderStyle: 'solid' }}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=04003D&color=FF9700&size=200&bold=true` }}
                      />
                    </div>
                    <h6 className="font-montserrat font-bold text-navy text-sm group-hover:text-orange transition-colors">{member.name}</h6>
                    <p className="text-teal text-xs font-bold uppercase tracking-wider mt-0.5 leading-tight">{member.role}</p>
                  </div>
                )
                return (
                  <div key={member.id || i} data-aos="zoom-in" data-aos-delay={i * 40}>
                    {slug ? <Link to={`/committees/${slug}`} className="block">{card}</Link> : card}
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/ministries" className="btn-primary">Explore Ministries</Link>
            <Link to="/special-committees" className="btn-outline">Special Committees</Link>
          </div>
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
    </>
  )
}