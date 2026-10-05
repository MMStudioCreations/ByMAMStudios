// Single source for brand facts used in metadata, JSON-LD, llms.txt and the sitemap.
// Anything marked [PLACEHOLDER] must be filled in by Michael before deploy.
export const SITE = {
  name: 'By MAM Studio',
  url: 'https://bymamstudio.com',
  email: 'hello@bymamstudio.com',
  founder: 'Michael A. Marino',
  parentOrg: { name: 'Avoren Group', url: 'https://avorengroup.com' },
  locality: 'Staten Island',
  region: 'NY',
  country: 'US',
  areaServed: ['New York City metro', 'New Jersey', 'United States (remote)'],
  ogImage: 'https://bymamstudio.com/og-image.png',
  logo: 'https://bymamstudio.com/logo.png',
  description:
    'By MAM Studio is a Staten Island, New York studio that builds AI systems, websites, and brand infrastructure for small businesses and operators, and sells self-serve AI playbooks and digital templates.',
  // Etsy shop is planned but not live yet. Replace with the real shop URL once it exists,
  // then add it to sameAs below.
  etsyUrl: '[PLACEHOLDER: Etsy shop URL]',
  sameAs: ['https://github.com/MMStudioCreations', 'https://avorengroup.com'],
}

export const absUrl = (path = '/') => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`)
