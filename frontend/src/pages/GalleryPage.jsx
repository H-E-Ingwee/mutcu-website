import { useEffect, useState } from 'react'
import { galleryAPI } from '../lib/api'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = ['All', 'worship', 'outreach', 'fellowship', 'events', 'ministry']

// Map display labels
const CATEGORY_LABELS = {
  All: 'All Photos', worship: 'Worship', outreach: 'Outreach & Missions',
  fellowship: 'Fellowship', events: 'Events', ministry: 'Ministries'
}

const FALLBACK_GALLERY = [
  { id: '1', image_url: '/assets/images/exec.jpg', title: 'Executive Committee', category: 'fellowship' },
  { id: '2', image_url: '/assets/images/music2.jpg', title: 'Worship Service', category: 'worship' },
  { id: '3', image_url: '/assets/images/music11.jpg', title: 'Music Ministry', category: 'worship' },
  { id: '4', image_url: '/assets/images/band1.jpg', title: 'Band', category: 'worship' },
  { id: '5', image_url: '/assets/images/prayer1.jpg', title: 'Prayer Meeting', category: 'worship' },
  { id: '6', image_url: '/assets/images/PRAYER.jpg', title: 'Corporate Prayer', category: 'worship' },
  { id: '7', image_url: '/assets/images/mission1.jpg', title: 'Outreach', category: 'outreach' },
  { id: '8', image_url: '/assets/images/crusade.jpg', title: 'Crusade', category: 'outreach' },
  { id: '9', image_url: '/assets/images/crusade 2.jpg', title: 'Crusade 2', category: 'outreach' },
  { id: '10', image_url: '/assets/images/Outreach 1.jpg', title: 'Community Outreach', category: 'outreach' },
  { id: '11', image_url: '/assets/images/dance3.jpg', title: 'Dance Ministry', category: 'ministry' },
  { id: '12', image_url: '/assets/images/dance4.jpg', title: 'Dance Performance', category: 'ministry' },
  { id: '13', image_url: '/assets/images/Dance1.jpg', title: 'Dance', category: 'ministry' },
  { id: '14', image_url: '/assets/images/Dance out1.jpg', title: 'Dance Outreach', category: 'ministry' },
  { id: '15', image_url: '/assets/images/Dance out2.jpg', title: 'Dance Outreach 2', category: 'ministry' },
  { id: '16', image_url: '/assets/images/cream1.JPG', title: 'CREAM Ministry', category: 'ministry' },
  { id: '17', image_url: '/assets/images/drama2.JPG', title: 'Drama', category: 'ministry' },
  { id: '18', image_url: '/assets/images/models1.JPG', title: 'Modelling', category: 'ministry' },
  { id: '19', image_url: '/assets/images/MODELS.jpg', title: 'Models', category: 'ministry' },
  { id: '20', image_url: '/assets/images/film1.jpg', title: 'Film Premiere', category: 'events' },
  { id: '21', image_url: '/assets/images/bs1.jpg', title: 'Bible Study', category: 'fellowship' },
  { id: '22', image_url: '/assets/images/BS3.jpg', title: 'Bible Study Group', category: 'fellowship' },
  { id: '23', image_url: '/assets/images/mbbc1.jpg', title: 'Fellowship', category: 'fellowship' },
  { id: '24', image_url: '/assets/images/Lumii_20241023_192938507.jpg', title: 'Fellowship Moment', category: 'fellowship' },
  { id: '25', image_url: '/assets/images/technicalDpt.jpg', title: 'Technical Ministry', category: 'ministry' },
  { id: '26', image_url: '/assets/images/service.jpg', title: 'Sunday Service', category: 'worship' },
  { id: '27', image_url: '/assets/images/church1.jpg', title: 'Church Service', category: 'worship' },
  { id: '28', image_url: '/assets/images/church2.jpg', title: 'Church Gathering', category: 'worship' },
  { id: '29', image_url: '/assets/images/MULEWO 2026 1.png', title: 'MULEWO 2026', category: 'events' },
  { id: '30', image_url: '/assets/images/bus.jpg', title: 'Business Exposition', category: 'events' },
  { id: '31', image_url: '/assets/images/chastity walk.png', title: 'Chastity Campaign', category: 'outreach' },
  { id: '32', image_url: '/assets/images/play.jpg', title: 'Mega Play', category: 'events' },
  { id: '33', image_url: '/assets/images/tlp.jpg', title: 'TLP', category: 'fellowship' },
  { id: '34', image_url: '/assets/images/bestp.jpg', title: 'BEST-P', category: 'fellowship' },
]

export default function GalleryPage() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    galleryAPI.getAll({ limit: 100 })
      .then(data => setGallery(data.gallery?.length > 0 ? data.gallery : FALLBACK_GALLERY))
      .catch(() => setGallery(FALLBACK_GALLERY))
      .finally(() => setLoading(false))
  }, [])

  const filtered = category === 'All' ? gallery : gallery.filter(g => g.category === category)

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox) return
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') {
        const idx = filtered.findIndex(g => g.id === lightbox.id)
        if (idx < filtered.length - 1) setLightbox(filtered[idx + 1])
      }
      if (e.key === 'ArrowLeft') {
        const idx = filtered.findIndex(g => g.id === lightbox.id)
        if (idx > 0) setLightbox(filtered[idx - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, filtered])

  return (
    <div>
      <PageHero
        title="Our Gallery"
        subtitle="Moments from our fellowship, services, events, and outreach activities."
        image="/assets/images/church2.jpg"
        badge="MUTCU Gallery"
      />

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <LoadingSpinner text="Loading gallery..." /> : (
            <>
              <p className="text-gray-400 text-sm mb-6">{filtered.length} photo{filtered.length !== 1 ? 's' : ''}</p>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                {filtered.map((item, i) => (
                  <div key={item.id} className="gallery-item break-inside-avoid cursor-pointer"
                    onClick={() => setLightbox(item)}
                    data-aos="zoom-in" data-aos-delay={Math.min(i * 40, 400)}>
                    <img src={item.image_url} alt={item.title || 'Gallery'}
                      className="w-full rounded-xl object-cover"
                      onError={e => { e.target.src = 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=600' }} />
                    <div className="gallery-overlay rounded-xl">
                      <div className="text-white text-center">
                        <i className="fas fa-expand text-2xl mb-2 block" />
                        {item.title && <span className="font-montserrat font-bold text-sm">{item.title}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <i className="fas fa-images text-5xl mb-4 block" />
                  <p>No photos in this category yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10"
            onClick={() => setLightbox(null)}>
            <i className="fas fa-times" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-2xl z-10"
            onClick={e => { e.stopPropagation(); const idx = filtered.findIndex(g => g.id === lightbox.id); if (idx > 0) setLightbox(filtered[idx - 1]) }}>
            <i className="fas fa-chevron-left" />
          </button>
          <img src={lightbox.image_url} alt={lightbox.title || 'Gallery'}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-2xl z-10"
            onClick={e => { e.stopPropagation(); const idx = filtered.findIndex(g => g.id === lightbox.id); if (idx < filtered.length - 1) setLightbox(filtered[idx + 1]) }}>
            <i className="fas fa-chevron-right" />
          </button>
          {lightbox.title && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-montserrat">
              {lightbox.title}
            </div>
          )}
        </div>
      )}
    </div>
  )
}