import { useEffect, useState } from 'react'
import { resourcesAPI } from '../lib/api'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const TYPE_ICONS = { PDF: 'fa-file-pdf', AUDIO: 'fa-headphones', VIDEO: 'fa-play-circle', LINK: 'fa-external-link-alt', DOCUMENT: 'fa-file-word' }
const TYPE_COLORS = { PDF: 'text-red-500', AUDIO: 'text-purple-500', VIDEO: 'text-blue-500', LINK: 'text-teal', DOCUMENT: 'text-navy' }
const CATEGORIES = ['All', 'sermons', 'devotionals', 'constitution', 'forms', 'other']

// ─── Featured Videos — exact from original site ───────────────────────────────
const FEATURED_VIDEOS = [
  {
    id: '1',
    title: 'Unlocking the Secrets to Academic Excellence',
    description: 'Learn the proven strategies and spiritual foundations for achieving academic success.',
    url: 'https://youtube.com/watch?v=brvyKkNHIps',
  },
  {
    id: '2',
    title: 'Purpose',
    description: "A creative experience exploring God's divine purpose for your life and ministry.",
    url: 'https://youtu.be/qqTkS5KQDyA',
  },
  {
    id: '3',
    title: "Pastor John Ng'ang'a on Purposeful Life",
    description: "Inspiring insights on living a life aligned with God's plan and calling.",
    url: 'https://youtu.be/fbstJHBDGrc',
  },
  {
    id: '4',
    title: 'Best-P Class on Homiletics',
    description: 'Master the art of preaching and Biblical communication through this comprehensive guide.',
    url: 'https://youtu.be/uSIp_D1Vpcs',
  },
]

// ─── Static fallback resources ────────────────────────────────────────────────
const FALLBACK_RESOURCES = [
  { id: '1', title: 'MUTCU Constitution 2025', description: 'The official MUTCU Constitution — the governing document of the Union.', url: '/assets/images/THE AMENDED 2021 MUT-CU CONSTITUTION (1) (1).docx', type: 'DOCUMENT', category: 'constitution' },
  { id: '2', title: 'MUTCU Brand Guidelines', description: 'Official MUTCU brand guidelines including logo usage, colors, and typography.', url: '/assets/images/MUTCU BRAND GUIDELINES.pdf', type: 'PDF', category: 'other' },
  { id: '3', title: 'MUTCU Overview', description: 'A comprehensive overview of MUTCU — its history, structure, and vision.', url: '/assets/images/MUTCU OVERVIEW.docx', type: 'DOCUMENT', category: 'other' },
  { id: '4', title: 'September–December 2026 Program', description: 'The full semester program for September to December 2026.', url: '/assets/images/SEP-DED SEM 2026 PROGRAM.docx', type: 'DOCUMENT', category: 'other' },
  { id: '5', title: '2025 Amended Policies', description: 'The 2025 amended MUTCU policies document.', url: '/assets/images/2025 AMMENDED POLICIES[1].docx', type: 'DOCUMENT', category: 'constitution' },
]

// ─── YouTube helpers ──────────────────────────────────────────────────────────
function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (match && match[1]) return match[1]
  try { return new URL(url).searchParams.get('v') } catch { return null }
}

function getYouTubeThumb(url) {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

function VideoCard({ video, onPlay }) {
  const thumb = getYouTubeThumb(video.url)
  const ytId = getYouTubeId(video.url)

  return (
    <div className="card group cursor-pointer" onClick={() => ytId ? onPlay(ytId) : window.open(video.url, '_blank')}>
      <div className="relative overflow-hidden h-44">
        {thumb ? (
          <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-navy flex items-center justify-center">
            <i className="fas fa-play-circle text-orange text-4xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/60 transition-all flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-orange/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <i className="fas fa-play text-white text-xl ml-1" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="badge badge-red text-xs"><i className="fab fa-youtube mr-1" />YouTube</span>
        </div>
      </div>
      <div className="card-body">
        <h4 className="font-montserrat font-bold text-navy text-sm mb-1 line-clamp-2 group-hover:text-orange transition-colors">{video.title}</h4>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{video.description}</p>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [previewId, setPreviewId] = useState(null)

  useEffect(() => {
    resourcesAPI.getAll()
      .then(data => setResources(data.resources?.length > 0 ? data.resources : FALLBACK_RESOURCES))
      .catch(() => setResources(FALLBACK_RESOURCES))
      .finally(() => setLoading(false))
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    if (!previewId) return
    const handler = (e) => { if (e.key === 'Escape') setPreviewId(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [previewId])

  const filtered = resources.filter(r => {
    const catMatch = category === 'All' || r.category === category
    const qMatch = !query.trim() || r.title.toLowerCase().includes(query.toLowerCase()) || (r.description || '').toLowerCase().includes(query.toLowerCase())
    return catMatch && qMatch
  })

  return (
    <div>
      
        subtitle="Equipping the saints with sermons, devotionals, videos, and study materials to foster growth in Christ."
        image="/assets/images/bs1.jpg"
        badge="Library & Media"
      />

      {/* ─── Featured Videos ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={<>Featured <span className="text-orange">Videos</span></>}
            subtitle="Watch sermons, teachings, and creative content from MUTCU and our partners."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_VIDEOS.map(video => (
              <VideoCard key={video.id} video={video} onPlay={setPreviewId} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Documents & Downloads ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Documents & Downloads" subtitle="Access Union documents, devotionals, forms, and other resources." />

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search resources..." value={query}
                onChange={e => setQuery(e.target.value)} className="form-input pl-9 py-2 text-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold capitalize transition-all ${category === cat ? 'bg-orange text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? <LoadingSpinner text="Loading resources..." /> : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r, i) => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all"
                  data-aos="fade-up" data-aos-delay={i * 60}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${TYPE_ICONS[r.type] || 'fa-file'} text-xl ${TYPE_COLORS[r.type] || 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-1 mb-1">
                        {r.type && <span className="badge badge-gray text-xs">{r.type}</span>}
                        {r.category && <span className="badge badge-navy text-xs capitalize">{r.category}</span>}
                      </div>
                      <h4 className="font-montserrat font-bold text-navy text-sm line-clamp-2">{r.title}</h4>
                    </div>
                  </div>
                  {r.description && <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{r.description}</p>}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" download={r.type === 'DOCUMENT' || r.type === 'PDF'}
                      className="btn-primary btn-sm w-full justify-center">
                      <i className={`fas ${r.type === 'LINK' ? 'fa-external-link-alt' : r.type === 'AUDIO' ? 'fa-headphones' : r.type === 'VIDEO' ? 'fa-play' : 'fa-download'}`} />
                      {r.type === 'LINK' ? 'Open Link' : r.type === 'AUDIO' ? 'Listen' : r.type === 'VIDEO' ? 'Watch' : 'Download'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-folder-open text-5xl mb-4 block" />
              <h3 className="font-montserrat font-bold text-xl mb-2">No resources found</h3>
              <p className="text-sm">{query ? `No results for "${query}"` : 'Resources will be added soon.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Constitution CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-navy text-center">
        <div className="max-w-2xl mx-auto px-4" data-aos="fade-up">
          <i className="fas fa-book text-orange text-4xl mb-4 block" />
          <h3 className="font-montserrat font-black text-white text-2xl mb-3">MUTCU Member Portal</h3>
          <p className="text-white/60 mb-6">Access the full MUTCU Constitution, Leadership Manual, and member resources through the Member Portal.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              <i className="fas fa-external-link-alt" /> Access Member Portal
            </a>
            <a href="/assets/images/THE AMENDED 2021 MUT-CU CONSTITUTION (1) (1).docx" download className="btn-outline-white btn-lg">
              <i className="fas fa-download" /> Download Constitution
            </a>
          </div>
        </div>
      </section>

      {/* ─── YouTube Lightbox ─────────────────────────────────────────────────── */}
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
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}