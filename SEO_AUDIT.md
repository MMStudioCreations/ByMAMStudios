# By MAM Studio: SEO / AEO audit

Date: 2026-10-05. Branch: `seo-aeo` (local only, not pushed, not deployed).

Goal: get bymamstudio.com ranking in Google and recommended by AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews).

---

## 1. Why https://bymamstudio.com returns 403

**It is not a missing site.** The Cloudflare Pages project `bymamstudios` is deployed and attached to the apex domain. `https://bymamstudios.pages.dev` returns 200 with the full site, and the apex serves the same `robots.txt`. The 403 comes from **Cloudflare security settings on the `bymamstudio.com` zone**, in front of Pages.

Evidence (read-only `curl`, 2026-10-05):

| Request | Result |
|---|---|
| `GET /` (any non-browser client, including a Googlebot user agent) | `403`, `cf-mitigated: challenge`, "Just a moment..." page (Cloudflare **Managed Challenge**), `<meta name="robots" content="noindex,nofollow">` |
| `GET /sitemap.xml` | `403` challenge |
| `GET /robots.txt`, `GET /llms.txt` | `200` (`.txt` counts as a static file and is not challenged) |
| `GET /llms.txt` with a `GPTBot` user agent | `403` "Your request was blocked." (no challenge, a hard block) |
| A real Chrome browser | passes the challenge and sees the site |
| `https://bymamstudios.pages.dev/` | `200` |
| Example Ray ID | `a45eece589d60d85-EWR` (look it up under Security > Events) |

So two separate Cloudflare features are involved:

1. **A Managed Challenge on every HTML page.** That pattern (HTML and XML challenged, static extensions like `.txt` not) matches **Security Level "I'm Under Attack"**, **Bot Fight Mode**, or a **WAF custom rule** with action Managed Challenge. Humans get through after a JS check. Crawlers that don't run the challenge (most SEO tools, link previews, many AI fetchers) see a 403 page marked `noindex`. Verified Googlebot and Bingbot are usually let through, but that isn't guaranteed and it can't be checked from outside. Google Search Console's URL Inspection will show it.
2. **AI crawler blocking** ("Block AI bots" / AI Crawl Control, which Cloudflare turns on by default for new zones). It hard-blocks GPTBot and similar crawlers even though `robots.txt` explicitly allows them. That directly prevents AI assistants from learning about the site.

**www is a separate problem, and a security risk:** `www.bymamstudio.com` is a DNS-only CNAME to `biglsendr.github.io`. GitHub answers "There isn't a GitHub Pages site here." That is a **dangling CNAME**: anyone who controls (or creates) that GitHub account can publish a Pages site on your www subdomain (subdomain takeover). It also splits ranking signals.

`api.bymamstudio.com` has no DNS record. That is expected: the `deploy-platform` worker (`worker/wrangler.toml`, route `api.bymamstudio.com/*`) has never been deployed. It doesn't affect the marketing site.

### Exact fix (Michael, in the Cloudflare dashboard, zone `bymamstudio.com`)

1. **Security > Events**: filter by the Ray ID above (or Host = bymamstudio.com, Action = Managed Challenge) to see which service fired: "Security Level", "Bot Fight Mode", or a named custom rule.
2. Turn off whichever one it is:
   - **Security > Settings > Security Level**: if it's "I'm Under Attack", set it to **Essentially Off** or **Low**. Also check **Overview > Under Attack Mode** is off.
   - **Security > Bots**: turn **Bot Fight Mode off**. On a free plan it can't be tuned to allow good crawlers, and the site has no login or form to protect.
   - **Security > WAF > Custom rules**: if a rule challenges everything (for example `true` or hostname equals bymamstudio.com → Managed Challenge), disable or delete it.
3. **AI Crawl Control** (or **Security > Bots > "Block AI bots"** / "Manage AI crawlers"): set it to **Allow / Do not block** for all AI crawlers. If Cloudflare **Managed robots.txt** is on, turn it off so the repo's `robots.txt` is the one served.
4. **DNS**: delete the `www` CNAME to `biglsendr.github.io`. Then in **Workers & Pages > bymamstudios > Custom domains**, add `www.bymamstudio.com`, and add a **Redirect Rule** (Rules > Redirect Rules): hostname equals `www.bymamstudio.com` → 301 to `https://bymamstudio.com${path}`. Any setup that redirects www to the apex works.
5. Verify from any terminal: `curl -sI https://bymamstudio.com` should return `200` with no `cf-mitigated` header, and `curl -sI -A "GPTBot/1.1" https://bymamstudio.com/llms.txt` should return 200.

---

## 2. Audit findings (before this branch)

The repo root holds two sites. The **live site** is the Vite + React SPA (`src/`, `index.html`, `public/`), deployed by `.github/workflows/deploy.yml` on push to `main` → Pages project `bymamstudios`. The root-level folders (`about-the-founder/`, `insights/`, `brand-systems/`, ..., `assets/`, root `robots.txt` / `sitemap.xml`, which point at the wrong domain `bymamstudios.com`) are the **old static site**. They duplicate `_archive/` and are **not deployed**. Only `public/` and the build output ship.

| Area | Finding | Severity |
|---|---|---|
| Rendering | Client-only SPA: every URL returned the same empty `<div id="root">` plus the homepage's title, description and canonical. Crawlers that don't run JS (most AI crawlers, social previews, Bing on a first pass) saw one page with no content, and every URL claimed the homepage as its canonical | Critical |
| Soft 404s | `_redirects` had `/* /index.html 200`, so any junk URL returned 200 with homepage HTML | High |
| Duplicate tags | The static `index.html` canonical/description/JSON-LD plus react-helmet tags gave two canonicals and two descriptions after JS ran | High |
| Titles / descriptions | Present on most pages via Helmet (client-side only). ResourceDetail and WorkDetail had no og:image. No Twitter cards anywhere | Medium |
| OG image | `og:image` pointed to `/assets/images/og-image.svg`, which **isn't deployed** (404). SVG isn't supported by Facebook, LinkedIn or X anyway, and it said "By MAM Studios" | Medium |
| JSON-LD | One `ProfessionalService` block (no logo, email or @id) and a generic `WebPage` per page. No `WebSite`, `Person`, `BreadcrumbList`, `Service`, `Product` or `FAQPage`, although service and product pages have FAQs | Medium |
| FAQ for AEO | No site-level FAQ answering basic "who, what, where, how much" questions | Medium |
| Detail-page FAQs | Rendered only after a tab click, so not in HTML | Medium |
| robots.txt | `public/robots.txt` was fine (allows all, including AI bots, and lists the sitemap). Cloudflare overrides it in practice (section 1) | n/a |
| sitemap.xml | Hand-maintained, with stale `lastmod`. URLs matched the routes | Low |
| llms.txt | Present and good, but hand-maintained, so it would drift from the data files | Low |
| Headings | One `<h1>` per page; sensible h2/h3 hierarchy | OK |
| Images | Very few `<img>` tags in the React site (CSS and SVG decoration); the portfolio PNGs aren't used by the React build. No missing alt text found | OK |
| Performance | Google Fonts loaded via CSS `@import` (render-blocking chain: CSS → font CSS → fonts). JS bundle 390 KB (117 KB gzip). Duplicate SVG `id="dots"` on the homepage | Low |
| Legacy URLs | Old static-site URLs (`/insights/*.html`, `/brand-systems/` ...) may be indexed or linked and now return the SPA shell | Low |
| Security headers | Root `_headers` has a CSP, but it isn't in `public/`, so it isn't deployed. Deploying it as written would also break Google Fonts (`style-src 'self'`) | Info |
| Assessment widget | `AssessmentWidget.jsx` calls `https://api.anthropic.com/v1/messages` directly from the browser with no API key, so it **fails for every visitor**. The site promotes this tool in several places. It needs a server-side proxy (Pages Function or Worker holding the key) or should be hidden | High (UX/trust) |

---

## 3. What changed on `seo-aeo`

Commit `ce916be` (plus this document):

- **Prerendering.** `npm run build` now runs `vite build`, then an SSR build of `src/entry-server.jsx`, then `scripts/prerender.mjs`. That writes **45 static HTML pages** (`index.html`, `services.html`, `services/ai-audit.html`, ...) with full content and per-page head tags. The output matches Cloudflare Pages pretty URLs (`/services` → `services.html`). `src/main.jsx` hydrates when HTML is present. Headless Chrome showed no hydration or console errors.
- **Real 404.** `dist/404.html` (noindex) replaces the SPA catch-all. `public/_redirects` now holds **301s for legacy URLs** (`/insights/:slug.html` → `/resources/:slug`, `/brand-systems` → `/services/brand-systems`, and so on).
- **Generated sitemap.xml and llms.txt.** Both are built from `src/data/*` every build, so they can't drift. llms.txt now includes services with prices and timelines, products, the Etsy line, the full FAQ, work and resources. (The hand-written `public/sitemap.xml` and `public/llms.txt` were removed.)
- **Head tags (`SEOHead`).** One canonical per page (self-referencing), `og:*` with a new **1200x630 PNG** (`public/og-image.png`, source in `design/`), Twitter `summary_large_image`, and `noindex` on the 404. JSON-LD is an `@graph` with `WebPage` and `BreadcrumbList`.
- **Entity schema (`SiteSchema`, every page).** `ProfessionalService` and `Organization` with `@id`, logo (`/logo.png`), email, Staten Island address, areaServed, founder `Person`, `parentOrganization` Avoren Group, `sameAs`, `knowsAbout`, and an `OfferCatalog` of all services. Plus `WebSite`.
- **Page schema.** `Service` + `FAQPage` on service pages, `Product` (Offer, USD price) + `FAQPage` on product pages, `Article` (author and publisher linked by @id) on resources, `CreativeWork` on work pages.
- **Crawlable tabs.** Service and product tab panels are always in the HTML and hidden with `hidden` when inactive, so their FAQs, deliverables and process steps are indexable.
- **Homepage content for AI answers.**
  - The hero sentence now states who, where and what.
  - A new **Digital Products** section covers AI skill bundles, the AEO starter kit and templates via Etsy, with `[PLACEHOLDER]` prices and shop URL.
  - A new **FAQ** section has 11 questions people ask an AI about a small web/AI studio (what it is, services, website cost, AI consulting cost, location and remote work, fit, AI tools, digital products, what AEO is, timelines, how to start), with `FAQPage` schema. Prices and timelines in the answers are **pulled from `src/data/services.js` and `products.js`**, not typed in. Source: `src/data/faq.js`.
- **Brand facts in one place.** `src/data/site.js` holds the name, URL, email, location, parent org, `sameAs`, and the Etsy URL placeholder.
- **Performance.** Fonts now load via `preconnect` + `<link>` instead of a CSS `@import` chain. Unique SVG pattern ids. Dates format in UTC, so the build server and browsers agree.
- **Validation.** `npm run validate` (`scripts/validate.mjs`, no dependencies) checks:
  - tag balance
  - exactly one title, description and canonical per page, with the canonical matching the URL
  - OG and Twitter tags
  - one `<h1>` per page
  - JSON-LD that parses
  - alt text on images
  - duplicate ids
  - every internal link, sitemap URL and llms.txt link resolving to a built file

**Validation result:** 46 HTML files, 45 sitemap URLs and llms.txt checked: **0 errors**. 29 warnings, all length-only: descriptions from `services.js` / `products.js` / `resources.js` run 170 to 245 characters and some article titles exceed 70, so Google will truncate them in results. The only `[PLACEHOLDER]` text on a page is on the homepage (Etsy section).

Not changed (left as-is on purpose): the old static-site folders at the repo root, the Assessment widget, the untracked `dabble/` folder (a separate nested git repo for the Dabble mobile app; untouched).

---

## 4. What Michael needs to do

1. **Fix the 403 and AI-bot block** (section 1, steps 1 to 3), and **remove the dangling www CNAME** (step 4). Nothing else matters until crawlers can fetch the pages.
2. **Fill the placeholders** before merging. Run `grep -rn PLACEHOLDER src index.html` to find them:
   - `src/data/site.js` → `etsyUrl`. Once the shop exists, also add the URL to `sameAs`.
   - `src/components/DigitalProducts.jsx` → three prices, and adjust the copy to the real listings.
   - `index.html` → the optional Google Search Console verification meta tag.
3. **Confirm the facts the FAQ repeats from the existing data:** service prices (from $1,500 / $1,800 / $10,000 ...), durations, and "Staten Island / NYC metro / NJ / remote US". The live site already shows services that this local repo doesn't have ("Websites & Digital Infrastructure", "Operations Systems", "Three practice areas"). That means **GitHub `main` is ahead of this local clone**. Before merging, run `git fetch` and rebase `seo-aeo` onto `origin/main`. New services in `src/data/services.js` will flow into the FAQ, schema, sitemap and llms.txt automatically.
4. **Deploy:** merge to `main` and push. The existing GitHub Action runs `npm run build` (now including prerender) and deploys `dist/` to Pages. No workflow change is needed. Afterwards, verify:
   - `curl -s https://bymamstudio.com/services/ai-audit | grep '<h1'` returns content
   - `https://bymamstudio.com/does-not-exist` returns 404
5. **Search Console and Bing Webmaster Tools.** Add or verify the domain property, submit `https://bymamstudio.com/sitemap.xml`, then URL-inspect `/` and request indexing. Bing verification is already in `index.html`. Bing feeds ChatGPT search and Copilot, so it matters for AEO.
6. **Off-site signals (the biggest AEO lever after crawlability):**
   - Create a **Google Business Profile** (service-area business, Staten Island).
   - Use the same name, description and email on LinkedIn, GitHub and the Etsy shop, and link each back to bymamstudio.com. Then add those URLs to `sameAs` in `src/data/site.js`.
   - Get listed in a few local and industry directories.
7. **Fix or hide the AI Readiness Assessment.** It currently errors for every visitor because it calls the Anthropic API from the browser without a key. It needs a server-side proxy holding the key (for example a Pages Function), or the links to it should be hidden.
8. Optional:
   - Shorten the long service/product/resource descriptions to about 155 characters.
   - Deploy security headers through `public/_headers`, with a CSP that allows `fonts.googleapis.com` / `fonts.gstatic.com`.
   - Delete the duplicate old static-site folders at the repo root (they live in `_archive/`).
