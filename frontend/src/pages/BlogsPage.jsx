import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogsAPI } from '../lib/api'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    blogsAPI.getAll({ limit: 50 })
      .then(data => setBlogs(data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = query.trim()
    ? blogs.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || (b.excerpt || '').toLowerCase().includes(query.toLowerCase()))
    : blogs

  return (
    <div>
      
        subtitle="Spiritual insights, testimonies, and reflections from the MUTCU community."
        image="/assets/images/bs1.jpg"
        badge="MUTCU Blog"
      />

      {/* Search */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search articles..." value={query}
              onChange={e => setQuery(e.target.value)} className="form-input pl-11" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <LoadingSpinner text="Loading articles..." /> : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((blog, i) => (
                <Link key={blog.id} to={`/blogs/${blog.slug}`}
                  className="card group block" data-aos="fade-up" data-aos-delay={i * 60}>
                  {blog.featured_image && (
                    <img src={blog.featured_image} alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.style.display = 'none' }} />
                  )}
                  <div className="card-body">
                    {blog.tags && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {blog.tags.split(',').slice(0, 2).map(tag => (
                          <span key={tag} className="badge badge-orange text-xs">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                    <h4 className="font-montserrat font-bold text-navy text-lg mb-2 group-hover:text-orange transition-colors line-clamp-2">{blog.title}</h4>
                    {blog.excerpt && <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{blog.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span><i className="fas fa-user mr-1" />{blog.author || 'MUTCU'}</span>
                      {blog.published_at && <span>{new Date(blog.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-newspaper text-5xl mb-4 block" />
              <h3 className="font-montserrat font-bold text-xl mb-2">{query ? 'No articles found' : 'No articles yet'}</h3>
              <p className="text-sm">{query ? `No results for "${query}"` : 'Check back soon for devotionals and articles.'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}