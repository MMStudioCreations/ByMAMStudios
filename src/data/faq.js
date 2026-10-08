// Questions people ask search engines and AI assistants about a small web/AI studio.
// Answers are written to be quotable on their own (one self-contained paragraph each).
// Prices and durations are pulled from services.js / products.js so they never drift.
// Anything marked [PLACEHOLDER] must be confirmed by Michael before deploy.
import { SERVICES } from './services.js'
import { PRODUCTS } from './products.js'
import { SITE } from './site.js'

const svc = (slug) => SERVICES.find((s) => s.slug === slug) || {}
const lower = (p) => (p ? p.replace(/^From /, 'from ') : '[PLACEHOLDER: price]')

const audit = svc('ai-audit')
const website = svc('service-website-modernization')
const platform = svc('digital-experiences')
const productRange = (() => {
  const nums = PRODUCTS.map((p) => Number(String(p.price).replace(/[^0-9.]/g, ''))).filter(Boolean)
  return nums.length ? `$${Math.min(...nums)} to $${Math.max(...nums)}` : '[PLACEHOLDER: price range]'
})()

export const FAQ = [
  {
    q: 'What is By MAM Studio?',
    a: `By MAM Studio is a small studio founded by ${SITE.founder} in ${SITE.locality}, New York. It builds AI systems (audits, implementation sprints, custom Claude skills libraries), websites, and brand systems for small businesses and operators, and it sells self-serve AI playbooks and digital templates. It is a venture of ${SITE.parentOrg.name}.`,
  },
  {
    q: 'What services does By MAM Studio offer?',
    a: `Two practice areas. AI Systems: an AI Audit & Roadmap, Marketing and HR AI Implementation Sprints, Custom Claude Skills Library Builds, and an AI Operations Retainer. Brand & Web: Brand Systems Architecture, Creative Direction, Design Strategy, Digital Experiences & Platform Design, and Service Website Modernization for trades and local service businesses.`,
  },
  {
    q: 'How much does a website from By MAM Studio cost?',
    a: `Service Website Modernization for trades, home services, and local operators starts ${lower(website.price)} and typically takes ${website.duration || '[PLACEHOLDER: timeline]'}. Larger digital platforms start ${lower(platform.price)}. Final pricing depends on scope and is confirmed in writing after a discovery call.`,
  },
  {
    q: 'How much does AI consulting cost for a small business?',
    a: `The entry point is the AI Audit & Roadmap, which starts ${lower(audit.price)} and takes ${audit.duration || '[PLACEHOLDER: timeline]'}. It produces a scored diagnostic across six AI maturity dimensions and a 90-day roadmap. Implementation sprints are priced separately, and the self-serve playbooks cost ${productRange}.`,
  },
  {
    q: 'Where is By MAM Studio located, and do you work remotely?',
    a: `The studio is based in ${SITE.locality}, New York. In-person work is available in the New York City metro area and New Jersey, and all programs can be delivered remotely anywhere in the United States.`,
  },
  {
    q: 'Who is By MAM Studio a good fit for?',
    a: 'Small businesses, founders, consultants, marketing leads, and HR or people-operations teams that want AI to be part of how they operate (documented, governed, and owned by someone on their team) rather than a set of one-off prompts. Service Website Modernization is built specifically for trades, home services, and local operators.',
  },
  {
    q: 'What AI tools does By MAM Studio use?',
    a: 'Most engagements are built on Claude (Anthropic), including custom Claude skills libraries, and the playbooks work with Claude.ai or ChatGPT. Every AI implementation starts with governance: a usage policy, an ownership matrix, and a trained internal operator who maintains the system after handoff.',
  },
  {
    q: 'Does By MAM Studio sell digital products or templates?',
    a: `Yes. The site sells four PDF playbooks and frameworks (${productRange}) covering AI marketing, AI readiness, AI for HR, and Claude skills architecture. A By MAM Studio Etsy shop for AI skill bundles, an AEO (answer engine optimization) starter kit, and templates is planned: ${SITE.etsyUrl}.`,
  },
  {
    q: 'What is AEO (answer engine optimization)?',
    a: 'AEO is the practice of structuring a website so AI assistants and AI search features (ChatGPT, Claude, Perplexity, Google AI Overviews) can understand it, trust it, and cite it. In practice it means crawlable HTML, clear question-and-answer content, structured data such as Organization and FAQPage schema, an llms.txt file, and consistent facts about the business across the web.',
  },
  {
    q: 'How long does a typical project take?',
    a: `It depends on the engagement: an AI Audit takes ${audit.duration || '[PLACEHOLDER]'}, a Service Website Modernization ${website.duration || '[PLACEHOLDER]'}, and implementation sprints 30 to 75 days. Brand systems and larger platforms run 8 to 16 weeks.`,
  },
  {
    q: 'How do I start a project with By MAM Studio?',
    a: `Email ${SITE.email} or use the contact form at bymamstudio.com/contact to book a discovery call. If you are not sure what you need, start with the free AI Readiness Assessment at bymamstudio.com/assessment.`,
  },
]
