import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ministriesAPI } from '../lib/api'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'

const STATIC_MINISTRIES = [
  { slug: 'bible-study', name: 'Bible Study & Training', description: 'Bible-based teaching, exposition, study sessions, and training to ground believers in Scripture.', icon: 'fa-book-open', image: '/assets/images/bs1.jpg', route: '/ministries/bible-study' },
  { slug: 'discipleship', name: 'Discipleship', description: 'Mentorship, accountability, and practical Christian living to nurture believers into maturity.', icon: 'fa-user-friends', image: '/assets/images/BS3.jpg', route: '/ministries/discipleship' },
  { slug: 'prayer-ministry', name: 'Prayer Ministry', description: 'Intercession, prayer gatherings, prayer chains, keshas, retreats, and revival-focused programs.', icon: 'fa-praying-hands', image: '/assets/images/prayer1.jpg', route: '/ministries/prayer-ministry' },
  { slug: 'missions-evangelism', name: 'Missions & Evangelism', description: 'Campus outreach, missions, evangelism, and hope ministry visits within and beyond the university.', icon: 'fa-globe', image: '/assets/images/mission1.jpg', route: '/ministries/missions-evangelism' },
  { slug: 'music-ministry', name: 'Music Ministry', description: 'Choir, band, instrumentalists and Praise & Worship teams leading the Union in worship with excellence.', icon: 'fa-music', image: '/assets/images/music2.jpg', route: '/ministries/music-ministry' },
  { slug: 'creative-arts', name: 'Creative Arts (CREAM)', description: 'Drama, dance, spoken word, modelling, film/media and creative expressions that point people to Christ.', icon: 'fa-theater-masks', image: '/assets/images/dance3.jpg', route: '/ministries/creative-arts' },
  { slug: 'technical-department', name: 'Technical Department', description: 'Sound, livestream, projection, photography/video, and technical support for services and events.', icon: 'fa-photo-video', image: '/assets/images/technicalDpt.jpg', route: '/ministries/technical-department' },
  { slug: 'hospitality-ministry', name: 'Hospitality Committee', description: 'Welcoming guests, coordinating seating/hosting, and ensuring visitors and members feel at home.', icon: 'fa-mug-hot', image: '/assets/images/prayer1.jpg', route: '/ministries/hospitality-ministry' },
  { slug: 'welfare-committee', name: 'Welfare Committee', description: 'Member care, encouragement, support in times of need, and strengthening fellowship as a family.', icon: 'fa-hand-holding-heart', image: '/assets/images/welfare11.jpg', route: '/ministries/welfare-committee' },
  { slug: 'rmc', name: 'Resource Mobilization (RMC)', description: 'Stewardship and mobilization of financial/material resources to support ministry work and programs.', icon: 'fa-donate', image: '/assets/images/prayer1.jpg', route: '/ministries/rmc' },
]

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState(STATIC_MINISTRIES)
  const [query, setQuery] = useState('')

  useEffect(() => {
    ministriesAPI.getAll().then(data => {
      if (data.ministries?.length > 0) {
        // Merge API data onto static list
        const apiMap = new Map(data.ministries.map(m => [m.slug, m]))
        setMinistries(STATIC_MINISTRIES.map(s => {
          const api = apiMap.get(s.slug)
          return api ? { ...s, name: api.name || s.name, description: api.description || s.description, image: api.image_url || s.image, icon: api.icon || s.icon } : s
        }))
      }
    }).catch(() => {})
  }, [])

  const filtered = query.trim()
    ? ministries.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.description.toLowerCase().includes(query.toLowerCase()))
    : ministries

  return (
    <div>
      <PageHero
        title="Our Ministries"
        subtitle="Find your place to grow and to serve — each ministry exists to build believers and reach others for Christ."
        image="/assets/images/church2.jpg"
        badge="MUTCU Ministries"
      />

      {/* Search */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ministries..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="form-input pl-11"
            />
          </div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="All Ministries" subtitle="Every ministry is a place to discover your gifts and serve God alongside fellow believers." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m, i) => (
              <Link key={m.slug} to={m.route}
                className="ministry-card group block"
                data-aos="fade-up" data-aos-delay={i * 60}>
                <img src={m.image} alt={m.name}
                  onError={e => { e.target.src = 'https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg?auto=compress&cs=tinysrgb&w=600' }} />
                <div className="ministry-card-overlay">
                  <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center mb-3">
                    <i className={`fas ${m.icon} text-orange`} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white text-lg mb-2">{m.name}</h4>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">{m.description}</p>
                  <div className="flex items-center gap-1 text-orange text-sm font-semibold">
                    Learn More <i className="fas fa-arrow-right text-xs" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-search text-4xl mb-3 block" />
              <p>No ministries found for "{query}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Committees CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <div className="bg-navy rounded-3xl p-10">
            <i className="fas fa-star text-orange text-4xl mb-4 block" />
            <h3 className="font-montserrat font-black text-white text-2xl mb-3">Special Committees</h3>
            <p className="text-white/60 mb-6">MUTCU also has special committees including the Advisory Board, Auditing Committee, Associates Committee, Interim EC, and RMC.</p>
            <Link to="/special-committees" className="btn-primary">View Special Committees</Link>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-orange text-center">
        <div className="max-w-2xl mx-auto px-4" data-aos="zoom-in">
          <h3 className="font-montserrat font-black text-white text-3xl mb-3">Find Your Ministry</h3>
          <p className="text-white/90 text-lg mb-6">Join MUTCU and discover where God has gifted you to serve.</p>
          <Link to="/register" className="btn-navy btn-lg">Join MUTCU Today</Link>
        </div>
      </section>
    </div>
  )
}