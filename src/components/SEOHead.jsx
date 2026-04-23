import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, keywords, canonical, ogImage }) {
  const url = canonical || 'https://bymamstudio.com'
  const image = ogImage || 'https://bymamstudio.com/assets/images/og-image.svg'

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: description,
          url: url,
        })}
      </script>
    </Helmet>
  )
}
