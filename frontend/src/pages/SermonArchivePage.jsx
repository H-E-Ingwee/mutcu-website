import { useState } from 'react'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import SEO from '../components/SEO'

// Sermon archive — from the original site's YouTube videos + program data
const SERMONS = [
  // Featured videos from original site
  {
    id: 'v1', title: 'Unlocking the Secrets to Academic Excellence', speaker: 'MUTCU', date: '2026-01-11',
    type: 'SUNDAY', description: 'Learn the proven strategies and spiritual foundations for achieving academic success in university.',
    url: 'https://youtube.com/watch?v=brvyKkNHIps', youtubeId: 'brvyKkNHIps',
  },
  {
    id: 'v2', title: 'Purpose', speaker: 'MUTCU Creative Ministry', date: '2025-10-01',
    type: 'SPECIAL', description: "A creative experience exploring God's divine purpose for your life and ministry.",
    url: 'https://youtu.be/qqTkS5KQDyA', youtubeId: 'qqTkS5KQDyA',
  },
  {
    id: 'v3', title: "Pastor John Ng'ang'a on Purposeful Life", speaker: "Pastor John Ng'ang'a", date: '2025-09-01',
    type: 'SUNDAY', description: "Inspiring insights on living a life aligned with God's plan and calling.",
    url: 'https://youtu.be/fbstJHBDGrc', youtubeId: 'fbstJHBDGrc',
  },
  {
    id: 'v4', title: 'Best-P Class on Homiletics', speaker: 'BEST-P Faculty', date: '2025-08-01',
    type: 'TRAINING', description: 'Master the art of preaching and Biblical communication through this comprehensive guide.',
    url: 'https://youtu.be/uSIp_D1Vpcs', youtubeId: 'uSIp_D1Vpcs',
  },
  // Sep-Dec 2026 program sermons
  { id: 's1', title: 'Academic Excellence', speaker: 'Orientation Department', date: '2026-09-06', type: 'SUNDAY', description: 'Launching the new semester with a focus on academic excellence and God\'s purpose for our studies.' },
  { id: 's2', title: "God's Redemption Plan", speaker: 'Issa Thuo', date: '2026-09-20', type: 'SUNDAY', description: "Exploring the magnificent story of God's redemptive plan for humanity through Jesus Christ." },
  { id: 's3', title: 'Hermeneutics', speaker: 'Samuel Namano', date: '2026-10-04', type: 'SUNDAY', description: 'Learning the art and science of biblical interpretation — how to correctly handle the Word of Truth.' },
  { id: 's4', title: 'Leadership', speaker: 'Daphne Kimani', date: '2026-10-11', type: 'SUNDAY', description: 'Biblical principles of servant leadership and how to lead with integrity and purpose.' },
  { id: 's5', title: 'Mental Health', speaker: 'Becky Wanjiru', date: '2026-10-18', type: 'SUNDAY', description: 'A candid conversation on mental health from a Christian perspective — finding wholeness in Christ.' },
  { id: 's6', title: 'The Life and Character of Peter', speaker: 'Samson Muturi', date: '2026-10-25', type: 'SUNDAY', description: 'Lessons from the life of Peter — faith, failure, restoration, and purpose.' },
  { id: 's7', title: 'Christian Maturity', speaker: 'Dr. John Ndia', date: '2026-11-01', type: 'SUNDAY', description: 'Growing from spiritual infancy to maturity — what it means to be a fully devoted follower of Christ.' },
  { id: 's8', title: 'Family Genesis', speaker: 'Nancy Oginde', date: '2026-11-15', type: 'SUNDAY', description: "God's design for family — understanding the foundations of godly relationships and family life." },
  { id: 's9', title: 'Stewardship', speaker: 'Anne Kimathi', date: '2026-11-22', type: 'SUNDAY', description: "Faithful stewardship of time, talents, and resources — living as managers of God's gifts." },
  { id: 's10', title: 'Newmatology', speaker: 'Simon Kande', date: '2026-11-29', type: 'SUNDAY', description: "A deep dive into the doctrine of the Holy Spirit — His person, work, and role in the believer's life." },
  { id: 's11', title: 'Purity', speaker: 'James Njuguna', date: '2026-12-06', type: 'SUNDAY', description: "Living a life of purity in a world that challenges our values — God's call to holiness." },
  { id: 's12', title: 'The Man Jesus', speaker: 'Rachel Mwangi', date: '2026-12-13', type: 'SUNDAY', description: 'A Christmas season reflection on the humanity and divinity of Jesus Christ.' },
  // Friday sermons
  { id: 'f1', title: "God's Redemptive Plan", speaker: 'Issa Thuo', date: '2026-09-18', type: 'FRIDAY', description: "A Friday fellowship exploring God's redemptive plan — the Gospel in its fullness." },
  { id: 'f2', title: 'Living a Balanced Life', speaker: 'Prof Humphrey Kirimi', date: '2026-10-16', type: 'FRIDAY', description: 'Practical wisdom on balancing academics, ministry, relationships, and personal growth.' },
  { id: 'f3', title: 'Law and Grace', speaker: 'Jimmy Kidavasi', date: '2026-10-30', type: 'FRIDAY', description: 'Understanding the relationship between the Law and Grace in the Christian life.' },
  { id: 'f4', title: 'Integrity', speaker: 'Dr Thuita', date: '2026-11-06', type: 'FRIDAY', description: 'Living with integrity in all areas of life — character, honesty, and faithfulness.' },
]

const TYPE_COLORS = { SUNDAY: 'badge-navy', FRIDAY: 'badge-orange', SPECIAL: 'badge-teal', TRAINING: 'badge-gray' }

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

export default function SermonArchivePage() {
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [previewId, setPreviewId] = useState(null)

  const filtered = SERMONS.filter(s => {
    const typeMatch = filter === 'ALL' || s.type === filter
    const qMatch = !query.trim() || s.title.toLowerCase().includes(query.toLowerCase()) || s.speaker.toLowerCase().includes(query.toLowerCase())
    return typeMatch && qMatch
  }).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <SEO
        title="Sermon Archive | MUTCU"
        description="Access MUTCU sermon archive — Sunday services, Friday fellowships, and special teachings from Murang'a University of Technology Christian Union."
        url="/sermons"
        keywords="MUTCU sermons, MUTCU Sunday service recordings, Murang'a University Christian Union sermons, MUT CU teachings"
      />

      <PageHero
        title="Sermon Archive"
        subtitle="Access past Sunday services, Friday fellowships, and special teachings from MUTCU."
        image="/assets/images/bs1.jpg"
        badge="MUTCU Sermons"
      />

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" placeholder="Search by title or speaker..." value={query}
              onChange={e => setQuery(e.target.value)} className="form-input pl-9 py-2 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'SUNDAY', 'FRIDAY', 'SPECIAL', 'TRAINING'].map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold transition-all ${filter === t ? 'bg-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400 text-sm mb-6">{filtered.length} sermon{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((sermon, i) => {
              const ytId = sermon.youtubeId || getYouTubeId(sermon.url)
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
              return (
                <div key={sermon.id} className="card group" data-aos="fade-up" data-aos-delay={Math.min(i * 50, 300)}>
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden h-44 bg-navy cursor-pointer"
                    onClick={() => ytId ? setPreviewId(ytId) : sermon.url && window.open(sermon.url, '_blank')}>
                    {thumb ? (
                      <img src={thumb} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="fas fa-bible text-white/20 text-5xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/60 transition-all flex items-center justify-center">
                      {ytId ? (
                        <div className="w-12 h-12 rounded-full bg-orange/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <i className="fas fa-play text-white ml-1" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <i className="fas fa-microphone text-white text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className={`badge ${TYPE_COLORS[sermon.type] || 'badge-gray'} text-xs`}>{sermon.type}</span>
                      {ytId && <span className="badge badge-red text-xs"><i className="fab fa-youtube mr-1" />Video</span>}
                    </div>
                  </div>
                  <div className="card-body">
                    <h4 className="font-montserrat font-bold text-navy text-sm mb-1 line-clamp-2 group-hover:text-orange transition-colors">{sermon.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <i className="fas fa-microphone text-orange" />
                      <span>{sermon.speaker}</span>
                      <span>·</span>
                      <span>{new Date(sermon.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {sermon.description && <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{sermon.description}</p>}
                  </div>
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-bible text-5xl mb-4 block" />
              <h3 className="font-montserrat font-bold text-xl mb-2">No sermons found</h3>
              <p className="text-sm">{query ? `No results for "${query}"` : 'No sermons in this category.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* YouTube Lightbox */}
      {previewId && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewId(null)}>
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewId(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl">
              <i className="fas fa-times" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-2xl"
                src={`https://www.youtube.com/embed/${previewId}?autoplay=1`}
                title="Sermon"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}