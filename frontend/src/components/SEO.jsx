import { useEffect } from 'react'

export default function SEO({
  title,
  description,
  image = '/assets/images/exec.jpg',
  url,
  type = 'website',
  keywords,
}) {
  const siteName = 'MUTCU — Inspire Love, Hope & Godliness'
  const fullTitle = title ? `${title} | MUTCU` : siteName
  const defaultDesc = "Murang'a University of Technology Christian Union — a Christ-centred student fellowship at MUT. Inspire Love, Hope & Godliness."
  const metaDesc = description || defaultDesc
  const metaImage = image.startsWith('http') ? image : `https://mutcu.org${image}`
  const metaUrl = url ? `https://mutcu.org${url}` : 'https://mutcu.org'
  const metaKeywords = keywords || 'MUTCU, Murang\'a University Christian Union, MUT, Christian Union Kenya, FOCUS Kenya, fellowship, discipleship, evangelism'

  useEffect(() => {
    // Title
    document.title = fullTitle

    const setMeta = (name, content, prop = false) => {
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }

    // Standard
    setMeta('description', metaDesc)
    setMeta('keywords', metaKeywords)
    setMeta('author', 'Murang\'a University of Technology Christian Union')
    setMeta('robots', 'index, follow')

    // Open Graph
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', metaDesc, true)
    setMeta('og:image', metaImage, true)
    setMeta('og:url', metaUrl, true)
    setMeta('og:type', type, true)
    setMeta('og:site_name', 'MUTCU', true)

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', metaDesc)
    setMeta('twitter:image', metaImage)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', metaUrl)

    // JSON-LD structured data
    const existingScript = document.querySelector('script[data-seo="mutcu"]')
    if (existingScript) existingScript.remove()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', 'mutcu')
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: "Murang'a University of Technology Christian Union",
      alternateName: 'MUTCU',
      url: 'https://mutcu.org',
      logo: 'https://mutcu.org/assets/images/best logo.png',
      description: defaultDesc,
      sameAs: [
        'https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/',
        'https://www.instagram.com/muranga_university_cu/',
        'https://www.tiktok.com/@mutcu001',
        'https://www.youtube.com/@murangauniversityCU',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: "Murang'a",
        addressCountry: 'KE',
      },
    })
    document.head.appendChild(script)
  }, [fullTitle, metaDesc, metaImage, metaUrl, type, metaKeywords])

  return null
}