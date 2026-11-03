// Post-build SEO + HTML sanity check for dist/ (run: npm run build && npm run validate).
// Dependency-free: checks tag balance, titles, descriptions, canonicals, one <h1>,
// JSON-LD syntax, image alt text, duplicate ids, and that every internal link,
// sitemap URL and llms.txt link resolves to a built file.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const SITE = 'https://bymamstudio.com'
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

const errors = []
const warnings = []
const err = (f, m) => errors.push(`${f}: ${m}`)
const warn = (f, m) => warnings.push(`${f}: ${m}`)

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    return d.isDirectory() ? walk(p) : [p]
  })
}
const files = walk(dist)
const htmlFiles = files.filter((f) => f.endsWith('.html'))
const rel = (f) => path.relative(dist, f).split(path.sep).join('/')

// Route -> file resolution, mirroring Cloudflare Pages pretty URLs.
const redirects = fs.existsSync(path.join(dist, '_redirects'))
  ? fs.readFileSync(path.join(dist, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/)[0])
  : []
function resolves(urlPath) {
  const p = decodeURIComponent(urlPath.split('#')[0].split('?')[0])
  if (p === '/' || p === '') return true
  const clean = p.replace(/\/$/, '')
  const candidates = [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`]
  if (candidates.some((c) => fs.existsSync(path.join(dist, c)))) return true
  return redirects.some((r) => r === p || (r.includes(':') && new RegExp('^' + r.replace(/:[a-z]+/g, '[^/]+') + '$').test(p)))
}
function expectedCanonical(file) {
  const r = rel(file)
  if (r === 'index.html') return `${SITE}/`
  return `${SITE}/${r.replace(/\.html$/, '')}`
}

for (const file of htmlFiles) {
  const f = rel(file)
  const html = fs.readFileSync(file, 'utf8')
  const isTemplate = !html.includes('data-rh=')
  if (isTemplate) { err(f, 'not prerendered (no head tags injected)'); continue }

  // Tag balance (ignores script/style bodies and comments)
  const body = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  const stack = []
  for (const m of body.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g)) {
    const tag = m[1].toLowerCase()
    if (m[0].startsWith('<!')) continue
    if (VOID.has(tag) || m[2] === '/') continue
    if (m[0].startsWith('</')) {
      const top = stack.pop()
      if (top !== tag) { err(f, `mismatched </${tag}> (expected </${top}>)`); break }
    } else stack.push(tag)
  }
  if (stack.length) err(f, `unclosed tags: ${stack.slice(-5).join(', ')}`)

  const titles = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/g)].map((m) => m[1])
  if (titles.length !== 1) err(f, `${titles.length} <title> tags`)
  else if (titles[0].length > 70) warn(f, `title ${titles[0].length} chars (>70)`)

  const desc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)
  if (!desc) err(f, 'missing meta description')
  else if (desc[1].length < 50 || desc[1].length > 170) warn(f, `meta description ${desc[1].length} chars`)
  if ((html.match(/name="description"/g) || []).length > 1) err(f, 'duplicate meta description')

  const canon = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g)].map((m) => m[1])
  if (f === '404.html') {
    if (!/name="robots"[^>]*noindex/.test(html)) err(f, '404 page is not noindex')
  } else if (canon.length !== 1) err(f, `${canon.length} canonical tags`)
  else if (canon[0] !== expectedCanonical(file)) err(f, `canonical ${canon[0]} != ${expectedCanonical(file)}`)

  for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) {
    if (!html.includes(`"${p}"`)) err(f, `missing ${p}`)
  }

  const h1 = (body.match(/<h1\b/g) || []).length
  if (f !== '404.html' && h1 !== 1) {
    // The assessment widget renders its h1 only after JS runs; report but don't fail.
    ;(f === 'assessment.html' ? warn : err)(f, `${h1} <h1> elements`)
  }

  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]) } catch (e) { err(f, `invalid JSON-LD: ${e.message}`) }
  }
  for (const m of body.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) err(f, `img without alt: ${m[0].slice(0, 80)}`)

  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (dup.length) err(f, `duplicate ids: ${[...new Set(dup)].join(', ')}`)

  for (const m of body.matchAll(/\shref="([^"]+)"/g)) {
    let href = m[1].replace(/&amp;/g, '&')
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || '/'
    if (!href.startsWith('/') || href.startsWith('//')) continue
    if (href.startsWith('/assets/')) { if (!fs.existsSync(path.join(dist, href))) err(f, `missing asset ${href}`); continue }
    if (!resolves(href)) err(f, `broken internal link ${href}`)
  }
  if (body.includes('[PLACEHOLDER')) warn(f, 'contains [PLACEHOLDER] text')
}

// sitemap + llms.txt links
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
for (const loc of locs) if (!resolves(loc.slice(SITE.length) || '/')) err('sitemap.xml', `URL has no page: ${loc}`)
const llms = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8')
for (const m of llms.matchAll(/\]\((https:\/\/bymamstudio\.com[^)]*)\)/g)) {
  if (!resolves(m[1].slice(SITE.length) || '/')) err('llms.txt', `broken link ${m[1]}`)
}
for (const need of ['og-image.png', 'logo.png', 'robots.txt', 'favicon.svg']) {
  if (!fs.existsSync(path.join(dist, need))) err('dist', `missing ${need}`)
}

console.log(`Checked ${htmlFiles.length} HTML files, ${locs.length} sitemap URLs, llms.txt.`)
const placeholderWarnings = warnings.filter((w) => w.includes('PLACEHOLDER'))
const otherWarnings = warnings.filter((w) => !w.includes('PLACEHOLDER'))
if (otherWarnings.length) console.log(`\nWarnings (${otherWarnings.length}):\n  ` + otherWarnings.join('\n  '))
if (placeholderWarnings.length) console.log(`\nPages with [PLACEHOLDER] text to fill before deploy: ${placeholderWarnings.map((w) => w.split(':')[0]).join(', ')}`)
if (errors.length) {
  console.log(`\nErrors (${errors.length}):\n  ` + errors.join('\n  '))
  process.exit(1)
}
console.log('\nNo errors.')
