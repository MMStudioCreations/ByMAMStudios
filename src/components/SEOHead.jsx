import { Helmet } from 'react-helmet-async'
import { SITE } from '../data/site.js'

// Per-page head tags. Rendered into static HTML at build time by scripts/prerender.mjs,
// so crawlers and AI assistants see them without running JavaScript.
//
// jsonLd: an object or array of schema.org objects (without @context) for this page.
// breadcrumbs: [{ name, path }] -> BreadcrumbList.
export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  breadcrumbs,
  noindex = false,
}) {
  const url = canonical || `${SITE.url}/`
  const image = ogImage || SITE.ogImage

  const graph = []
  graph.push({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${SITE.url}/#website` },
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en-US',
  })
  if (breadcrumbs && breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: b.path === '/' ? `${SITE.url}/` : `${SITE.url}${b.path}`,
      })),
    })
  }
  if (jsonLd) graph.push(...(Array.isArray(jsonLd) ? jsonLd : [jsonLd]))

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      {!noindex && <link rel="canonical" href={url} />}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE.name}: AI systems, websites and brand systems`} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}
      </script>
    </Helmet>
  )
}
