import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle'
import SEO from '../../components/SEO'

// ─── Exact from Leadership Manual 2025, Part 3.9 ─────────────────────────────
const COMMITTEE_COMPOSITION = [
  'The Bible Study and Training Coordinator (Chairperson)',
  'The Secretary/Treasurer',
  'The Bible Study Coordinator',
  'The Assistant Bible Study Coordinator',
  'The BEST-P Coordinator',
  'The Assistant BEST-P Coordinator',
  'Consistent Bible Reading Coordinator',
  'Assistant Bible Reading Coordinator',
]

const OFFICE_BEARER_ROLES = [
  {
    title: 'Chairperson (Bible Study & Training Coordinator)',
    icon: 'fa-user-tie',
    color: 'border-orange',
    duties: ['Performs all duties as outlined in Part 2.10 of the Leadership Manual.'],
  },
  {
    title: 'Secretary/Treasurer',
    icon: 'fa-file-alt',
    color: 'border-teal',
    duties: [
      'He/she takes minutes during the ministry\'s meeting and avails them for reading and confirmation in every meeting.',
      'He/she is the custodian of all committee funds, documents and assets.',
      'He/she is in charge of special activities within the committee.',
      'Shall be the financial advisor to the committee.',
    ],
  },
  {
    title: 'The Bible Study Coordinator',
    icon: 'fa-book-open',
    color: 'border-orange',
    duties: [
      'Coordinating the committee members to ensure they follow up Bible study leaders for effective running of the small Bible Study groups.',
      'Issuing of the Bible study guides and collecting monies.',
      'Oversee the coordination of the Bible study review on Mondays at 4:00 p.m.',
      'He/she oversees special activities of the committee e.g Bereans.',
    ],
  },
  {
    title: 'The Assistant Bible Study Coordinator',
    icon: 'fa-book',
    color: 'border-teal',
    duties: [
      'He/she shall collect, record and store data on small Bible study group meetings every Monday.',
      'He/she is the principal assistant.',
    ],
  },
  {
    title: 'The BEST-P Coordinator',
    icon: 'fa-graduation-cap',
    color: 'border-orange',
    duties: [
      'He/she ensure that the BEST-P classes are on-going well.',
      'He/she selects facilitators of various BEST-P topics.',
      'He/she plans and coordinates the BEST-P graduation.',
    ],
  },
  {
    title: 'The Assistant BEST-P Coordinator',
    icon: 'fa-chalkboard-teacher',
    color: 'border-teal',
    duties: [
      'He/she plans and coordinates the formation of the BEST-P groups and assignments.',
      'He/she ensures proper record keeping and attendance.',
      'He/she is the principal assistant of the BEST-P coordinator.',
    ],
  },
  {
    title: 'Consistent Bible Reading Coordinator',
    icon: 'fa-bible',
    color: 'border-orange',
    duties: [
      'Develop and promote strategic plans to encourage consistent, personal Bible reading across the entire CU.',
      'May manage reading-plan groups, share devotional resources, and track engagement.',
    ],
  },
  {
    title: 'Assistant Consistent Bible Reading Coordinator',
    icon: 'fa-bookmark',
    color: 'border-teal',
    duties: [
      'He/she plans and coordinates the formation of the CBR groups and assignments.',
      'He/she ensures proper record keeping and attendance.',
    ],
  },
]

const BIBLE_STUDY_SUB_COMMITTEE = [
  'Shall assign different Bible study leaders to different Bible study groups.',
  'In charge of Bible study leaders training.',
  'Shall form and dissolve Bible study groups upon completion.',
]

const PROGRAMS = [
  { icon: 'fa-users', title: 'Small Bible Study Groups', desc: 'Weekly small group Bible studies led by trained Bible study leaders, reviewed every Monday at 4:00 p.m.' },
  { icon: 'fa-graduation-cap', title: 'BEST-P', desc: 'Bible Exposition Self Training Program — structured self-training in biblical exposition with facilitators, groups, and a graduation ceremony.' },
  { icon: 'fa-bible', title: 'Consistent Bible Reading (CBR)', desc: 'Strategic plans and reading-plan groups to encourage consistent, personal Bible reading across the entire CU.' },
  { icon: 'fa-star', title: 'Bereans', desc: 'Special activities of the Bible Study committee for deeper engagement with Scripture.' },
  { icon: 'fa-chalkboard-teacher', title: 'Bible Study Leaders Training', desc: 'Training sessions for Bible study leaders to equip them for effective facilitation of small groups.' },
  { icon: 'fa-book-open', title: 'Bible Study Guides', desc: 'Issuing of Bible study guides to all small group members for structured study.' },
]

export default function BibleStudyPage() {
  return (
    <>
      <SEO
        title="Bible Study & Training Ministry | MUTCU"
        description="MUTCU Bible Study & Training Ministry — small groups, BEST-P, Consistent Bible Reading, and equipping programs at Murang'a University of Technology Christian Union."
        url="/ministries/bible-study"
        keywords="MUTCU Bible study, BEST-P MUTCU, Murang'a University Christian Union Bible study, MUT CU training, MUTCU small groups"
      />
      <div>
        {/* Hero */}
        <section className="page-hero" style={{ backgroundImage: "url('/assets/images/bs1.jpg')" }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,0,61,0.88) 0%, rgba(4,0,61,0.65) 100%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-montserrat font-bold uppercase tracking-widest mb-4">
              MUTCU Ministry · Leadership Manual Part 3.9
            </div>
            <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl mb-4">Bible Study & Training Ministry</h1>
            <p className="text-white/75 text-lg max-w-2xl mx-auto">Deepening Spiritual Growth Through the In-Depth Study of God's Word</p>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div data-aos="fade-right">
                <div className="text-orange font-montserrat font-bold text-xs uppercase tracking-widest mb-2">Leadership Manual 2025 · Part 3.9</div>
                <h2 className="font-montserrat font-black text-navy text-3xl mb-4">About the Bible Study & Training Ministry</h2>
                <div className="h-1 w-12 bg-orange rounded-full mb-5" />
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Mandate</h5>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-orange pl-4">"To facilitate the systematic spiritual growth of members through the in-depth study of God's Word in small groups and structured self-training programs."</p>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Committee Composition</h5>
                  <ul className="space-y-2">
                    {COMMITTEE_COMPOSITION.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][i]}</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h5 className="font-montserrat font-bold text-navy mb-2">Bible Study Sub-Committee Duties</h5>
                  <ul className="space-y-2">
                    {BIBLE_STUDY_SUB_COMMITTEE.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <i className="fas fa-check-circle text-teal mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to="/committees/bible-study" className="btn-primary mt-4 inline-flex">
                  <i className="fas fa-user-tie" /> Meet the Coordinator
                </Link>
              </div>
              <div data-aos="fade-left" className="space-y-4">
                <img src="/assets/images/bs1.jpg" alt="Bible Study Ministry" className="rounded-2xl shadow-2xl w-full h-56 object-cover"
                  onError={e => { e.target.src = '/assets/images/church2.jpg' }} />
                <img src="/assets/images/BS3.jpg" alt="Bible Study Group" className="rounded-2xl shadow-xl w-full h-44 object-cover"
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Office Bearer Roles */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Committee Office Bearers & Roles" subtitle="Each office bearer in the Bible Study & Training Committee has specific responsibilities. — Leadership Manual 2025, Part 3.9.3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {OFFICE_BEARER_ROLES.map((role, i) => (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${role.color} p-5 hover:shadow-md transition-all`}
                  data-aos="fade-up" data-aos-delay={i * 50}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${role.icon} text-orange text-sm`} />
                    </div>
                    <h4 className="font-montserrat font-bold text-navy text-sm">{role.title}</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {role.duties.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-600 text-xs leading-relaxed">
                        <i className="fas fa-chevron-right text-orange text-xs mt-0.5 flex-shrink-0" />{d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #04003D 0%, #0a0060 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Programs & Activities" subtitle="The Bible Study & Training Ministry runs several structured programs to equip members in the Word." center light />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROGRAMS.map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                  data-aos="fade-up" data-aos-delay={i * 60}>
                  <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center mb-4">
                    <i className={`fas ${p.icon} text-orange text-xl`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-navy text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Join the Bible Study & Training Ministry</h3>
            <p className="text-white/60 mb-6">Grow in the Word — join a small group, enroll in BEST-P, or become a Bible study leader.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary">Join MUTCU</Link>
              <Link to="/contact" className="btn-outline-white">Contact Us</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}