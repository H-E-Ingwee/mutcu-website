import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogsAPI } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    blogsAPI.getBySlug(slug)
      .then(data => setBlog(data.blog))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading article..." /></div>

  if (notFound || !blog) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <i className="fas fa-newspaper text-gray-300 text-6xl mb-4 block" />
        <h2 className="font-montserrat font-bold text-navy text-2xl mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">This article may have been removed or the link is incorrect.</p>
        <Link to="/blogs" className="btn-primary">← Back to Blog</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      {blog.featured_image && (
        <div className="relative h-72 md:h-96 overflow-hidden" style={{ marginTop: '-80px' }}>
          <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,0,61,0.3) 0%, rgba(4,0,61,0.7) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl mx-auto">
              {blog.tags && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.split(',').map(tag => (
                    <span key={tag} className="badge badge-orange text-xs">{tag.trim()}</span>
                  ))}
                </div>
              )}
              <h1 className="font-montserrat font-black text-3xl md:text-4xl leading-tight">{blog.title}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-200">
          <span><i className="fas fa-user mr-2 text-orange" />{blog.author || 'MUTCU'}</span>
          {blog.published_at && <span><i className="fas fa-calendar mr-2 text-orange" />{new Date(blog.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          <Link to="/blogs" className="ml-auto text-orange hover:underline font-semibold text-sm">← Back to Blog</Link>
        </div>

        {!blog.featured_image && (
          <h1 className="font-montserrat font-black text-navy text-3xl md:text-4xl mb-6 leading-tight">{blog.title}</h1>
        )}

        {blog.excerpt && (
          <p className="text-gray-600 text-xl leading-relaxed mb-8 italic border-l-4 border-orange pl-5">{blog.excerpt}</p>
        )}

        {/* Content */}
        <div className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content || '' }} />

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Written by</p>
              <p className="font-montserrat font-bold text-navy">{blog.author || 'MUTCU'}</p>
            </div>
            <Link to="/blogs" className="btn-outline">← More Articles</Link>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-navy rounded-2xl p-8 text-center">
          <h3 className="font-montserrat font-black text-white text-xl mb-2">Be Part of the MUTCU Community</h3>
          <p className="text-white/60 mb-5">Join us for fellowship, discipleship, and spiritual growth.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary">Join MUTCU</Link>
            <Link to="/contact" className="btn-outline-white">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}