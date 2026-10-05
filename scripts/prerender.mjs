// Build step 3 of 3 (see package.json "build"):
//   1. vite build                         -> dist/ (client bundle + index.html template)
//   2. vite build --ssr src/entry-server  -> dist-ssr/entry-server.js
//   3. this script                        -> one static HTML file per route, 404.html,
//                                            sitemap.xml and llms.txt generated from src/data
// Output layout matches Cloudflare Pages pretty URLs: /services -> services.html,
// /services/ai-audit -> services/ai-audit.html, / -> index.html.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const { render, PRODUCTS, SERVICES, RESOURCES, WORK, FAQ, SITE } = await import(pathToFileURL(ssrEntry).href)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the <!--app-head--> / <!--app-html--> markers')
}

const today = new Date().toISOString().slice(0, 10)
const routes = [
  { path: '/', priority: '1.0' },
  { path: '/services', priority: '0.9' },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: '0.8' })),
  { path: '/products', priority: '0.9' },
  ...PRODUCTS.map((p) => ({ path: `/products/${p.slug}`, priority: '0.8' })),
  { path: '/work', priority: '0.7' },
  ...WORK.filter((w) => !w.comingSoon).map((w) => ({ path: `/work/${w.slug}`, priority: '0.6' })),
  { path: '/resources', priority: '0.8' },
  ...RESOURCES.map((r) => ({ path: `/resources/${r.slug}`, priority: '0.7', lastmod: r.updatedDate || r.publishDate })),
  { path: '/about', priority: '0.8' },
  { path: '/contact', priority: '0.7' },
  { path: '/assessment', priority: '0.6' },
]

function page(url) {
  const { html, head } = render(url)
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
}

function outFile(route) {
  if (route === '/') return path.join(dist, 'index.html')
  return path.join(dist, `${route.slice(1)}.html`)
}

let count = 0
for (const r of routes) {
  const file = outFile(r.path)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page(r.path))
  count++
}
// Real 404 page (Pages serves it with HTTP 404 for unknown paths; no SPA catch-all).
fs.writeFileSync(path.join(dist, '404.html'), page('/__not-found__'))

// sitemap.xml
const abs = (p) => (p === '/' ? `${SITE.url}/` : `${SITE.url}${p}`)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${abs(r.path)}</loc>\n    <lastmod>${r.lastmod || today}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)

// llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants.
const group = (g) => SERVICES.filter((s) => g.includes(s.group))
const svcLine = (s) => `- [${s.name}](${abs(`/services/${s.slug}`)}): ${s.description} Price: ${s.price}. Typical timeline: ${s.duration}.`
const llms = `# ${SITE.name}

> ${SITE.description}

Founder: ${SITE.founder}. Location: ${SITE.locality}, ${SITE.region} (New York City); in-person in the NYC metro and New Jersey, remote across the United States. A venture of ${SITE.parentOrg.name} (${SITE.parentOrg.url}). Contact: ${SITE.email}.

## Services: AI Systems

${group(['AI Systems', 'Retainer']).map(svcLine).join('\n')}

## Services: Brand & Web

${group(['Brand', 'Web']).map(svcLine).join('\n')}

## Products (PDF playbooks and frameworks)

${PRODUCTS.map((p) => `- [${p.name}](${abs(`/products/${p.slug}`)}): ${p.description} Price: ${p.price}.`).join('\n')}

## Digital products (Etsy, planned)

- AI skill bundles, an AEO (answer engine optimization) starter kit, and business/website templates. Shop: ${SITE.etsyUrl}

## Frequently asked questions

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Work

${WORK.filter((w) => !w.comingSoon).map((w) => `- [${w.name}](${abs(`/work/${w.slug}`)}): ${w.subtitle}`).join('\n')}

## Resources

${RESOURCES.map((r) => `- [${r.title}](${abs(`/resources/${r.slug}`)}): ${r.metaDescription}`).join('\n')}

## Optional

- [About](${abs('/about')})
- [Contact](${abs('/contact')})
- [Sitemap](${abs('/sitemap.xml')})
`
fs.writeFileSync(path.join(dist, 'llms.txt'), llms)

console.log(`prerendered ${count} routes + 404.html, sitemap.xml (${routes.length} URLs), llms.txt`)
