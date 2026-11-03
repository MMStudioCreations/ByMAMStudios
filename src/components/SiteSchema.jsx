import { Helmet } from 'react-helmet-async'
import { SITE } from '../data/site.js'
import { SERVICES } from '../data/services.js'

// Site-wide entity markup (rendered on every page): who the business is, where it is,
// what it offers. Pages reference these nodes by @id.
export default function SiteSchema() {
  const org = {
    '@type': ['ProfessionalService', 'Organization'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    alternateName: ['ByMAM Studio', 'MAM Studio'],
    url: `${SITE.url}/`,
    logo: SITE.logo,
    image: SITE.ogImage,
    email: SITE.email,
    description: SITE.description,
    founder: { '@id': `${SITE.url}/#founder` },
    parentOrganization: { '@type': 'Organization', name: SITE.parentOrg.name, url: SITE.parentOrg.url },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: SITE.areaServed,
    knowsAbout: [
      'AI implementation for small businesses',
      'Claude skills libraries',
      'AI governance',
      'Answer engine optimization (AEO)',
      'Website design and development',
      'Brand systems',
    ],
    sameAs: SITE.sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'By MAM Studio services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
          url: `${SITE.url}/services/${s.slug}`,
        },
      })),
    },
  }
  const founder = {
    '@type': 'Person',
    '@id': `${SITE.url}/#founder`,
    name: SITE.founder,
    url: `${SITE.url}/about`,
    worksFor: { '@id': `${SITE.url}/#organization` },
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.name,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en-US',
  }
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({ '@context': 'https://schema.org', '@graph': [org, founder, website] })}
      </script>
    </Helmet>
  )
}
