import { useEffect } from 'react'
import { useContent } from '../context/ContentContext'

function setMeta(property, content, isName = false) {
  if (!content) return
  const attr = isName ? 'name' : 'property'
  let el = document.querySelector(`meta[${attr}="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function SEO() {
  const { content } = useContent()

  useEffect(() => {
    const { hero, contact, site, social } = content
    const name = hero?.name || 'Developer'
    const title = `${name} | ${hero?.typingWords?.[0] || 'Portfolio'}`
    const description = hero?.description || site?.tagline || ''
    const siteUrl = window.location.origin

    // Title
    document.title = title

    // Standard
    setMeta('description', description, true)

    // Open Graph
    setMeta('og:title', title)
    setMeta('og:description', description)
    setMeta('og:url', siteUrl)
    setMeta('og:site_name', site?.name || name)

    // Twitter
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', description, true)

    // JSON-LD — update with live content
    const existing = document.querySelector('script[type="application/ld+json"]')
    if (existing) {
      existing.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        url: siteUrl,
        email: contact?.email || '',
        jobTitle: hero?.typingWords?.[0] || 'Developer',
        description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: contact?.location || '',
          addressCountry: 'VN',
        },
        sameAs: [social?.github, social?.linkedin, social?.twitter].filter(Boolean),
      })
    }
  }, [content])

  return null
}
