// Single source for brand facts used in metadata, JSON-LD, llms.txt and the sitemap.
// Business identity details (street address, phone, EIN, legal entity name) are on hold
// until the business account is set up. Do not add them here until Michael provides them.
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
  // Etsy shop is planned but not live yet. Set the real shop URL here once it exists;
  // the site links it and adds it to sameAs automatically.
  etsyUrl: null,
  sameAs: ['https://github.com/MMStudioCreations', 'https://avorengroup.com'],
}
if (SITE.etsyUrl) SITE.sameAs.push(SITE.etsyUrl)

// Feature flags.
// assessment: the free AI Readiness Assessment (/assessment). The widget posts answers to the
// Pages Function functions/api/assessment.js, which holds the Anthropic key as the secret
// ANTHROPIC_API_KEY. Until that secret is set the widget shows "Assessment is warming up" and
// links to /contact. Setting this to false hides it (no links, no page, /assessment -> /contact).
export const FEATURES = {
  assessment: true,
}

export const absUrl = (path = '/') => (path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`)
