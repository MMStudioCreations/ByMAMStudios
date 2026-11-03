// Cloudflare Pages Function: /api/assessment
//
// Runs the free AI Readiness Assessment server-side so the Anthropic API key never reaches
// the browser. The key lives in the Pages secret ANTHROPIC_API_KEY (set by Michael):
//   npx wrangler pages secret put ANTHROPIC_API_KEY --project-name bymamstudios
//
// GET  -> { ready } so the widget can show "warming up" until the key is set.
// POST -> { result } with the assessment JSON the widget renders.
//
// Abuse protection (this endpoint spends real money):
//   - origin allowlist (bymamstudio.com and the bymamstudios.pages.dev previews)
//   - body size cap; answers must match the multiple-choice options exactly (no free text)
//   - per-IP limits (hour + day) and a global daily cap, counted in KV before the API call
//   - fixed model, effort and max_tokens

import Anthropic from '@anthropic-ai/sdk'
import { QUESTIONS } from '../../src/data/assessment.js'
import { SERVICES } from '../../src/data/services.js'
import { PRODUCTS } from '../../src/data/products.js'

const MODEL = 'claude-haiku-5-5'
const MAX_TOKENS = 2500
const MAX_BODY_BYTES = 4096

const LIMITS = {
  perIpHour: 5,
  perIpDay: 20,
  globalDay: 200,
}

const ALLOWED_HOSTS = ['bymamstudio.com', 'www.bymamstudio.com', 'bymamstudios.pages.dev']

const MESSAGES = {
  warmingUp: 'Assessment is warming up. Book a free consult instead.',
  forbidden: 'This assessment can only be run from bymamstudio.com.',
  badRequest: 'Please answer every question, then try again.',
  ipLimit: "You've run the assessment a few times already. Please try again later, or book a free consult and we'll walk through it together.",
  globalLimit: "The assessment has hit today's limit. Please try again tomorrow, or book a free consult instead.",
  busy: 'The assessment is busy right now. Please try again in a minute, or book a free consult instead.',
  failed: "We couldn't build your plan this time. Please try again, or book a free consult instead.",
}

const catalog = [
  ...SERVICES.map((s) => `- Service: ${s.name} (${s.price})`),
  ...PRODUCTS.map((p) => `- Product: ${p.name} (${p.price})`),
].join('\n')

const SYSTEM_PROMPT = `You are the AI Readiness Advisor for By MAM Studio, a Staten Island, NY studio that builds AI systems, operations systems and websites for small businesses and operators.

Read the prospect's multiple-choice answers and write a short, practical AI and operations readiness assessment for a small business. Stay on that topic only. Be specific to their answers, plain-spoken, and realistic about a small team's time and budget. Recommend only names and prices from this catalog, copied exactly:
${catalog}

Maturity tiers: Tier 1 Uninitialized, Tier 2 Developing, Tier 3 Emerging, Tier 4 Scaling, Tier 5 AI-Native.

Reply with only a JSON object, no markdown, in this shape:
{"maturityTier":"Tier N — Name","maturityScore":1-100,"criticalGap":"one sentence",
"plan":{"days30":{"title":"","actions":["","",""]},"days60":{"title":"","actions":["","",""]},"days90":{"title":"","actions":["","",""]}},
"dimensions":[{"name":"Strategy","score":1-5,"gap":"","action":""},{"name":"Governance",...},{"name":"Data & Documentation",...},{"name":"Skills & Infrastructure",...},{"name":"Team Adoption",...},{"name":"Output Quality",...}],
"recommendations":{"primary":{"type":"service or product","name":"","price":"","reason":"two sentences"},"secondary":{"type":"","name":"","price":"","reason":"one sentence"},"selfImplement":{"name":"","price":"","reason":"one sentence"}},
"summary":"3-4 sentences on where they stand, the critical gap and what the 90-day plan achieves. End by suggesting a free consult through the Contact page at bymamstudio.com/contact."}`

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const fail = (status, code, message) => json({ error: code, message }, status)

function originAllowed(request) {
  const origin = request.headers.get('Origin')
  if (!origin) return false
  let o
  try {
    o = new URL(origin)
  } catch {
    return false
  }
  if (o.protocol === 'https:' && (ALLOWED_HOSTS.includes(o.hostname) || o.hostname.endsWith('.bymamstudios.pages.dev'))) {
    return true
  }
  // Local `wrangler pages dev`: only when the request itself is to localhost.
  const self = new URL(request.url)
  const local = (h) => h === 'localhost' || h === '127.0.0.1'
  return local(self.hostname) && local(o.hostname)
}

// Returns the answers as "question\nAnswer: option" text, or null if anything is off.
function validateAnswers(answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return null
  const keys = Object.keys(answers)
  if (keys.length !== QUESTIONS.length) return null
  const lines = []
  for (const q of QUESTIONS) {
    const a = answers[q.id]
    if (typeof a !== 'string' || !q.options.includes(a)) return null
    lines.push(`${q.text}\nAnswer: ${a}`)
  }
  return lines.join('\n\n')
}

async function hashIp(ip) {
  const data = new TextEncoder().encode(`bymam-assessment:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Counts this attempt against the per-IP and global limits. KV is eventually consistent, so
// these are soft limits; the Anthropic console spend limit is the hard backstop.
async function takeRateLimit(kv, ip) {
  const now = Date.now()
  const day = new Date(now).toISOString().slice(0, 10)
  const hour = Math.floor(now / 3600000)
  const ipKey = `ip:${await hashIp(ip)}`
  const globalKey = `global:${day}`

  const [ipRec, globalCount] = await Promise.all([
    kv.get(ipKey, 'json'),
    kv.get(globalKey).then((v) => Number(v) || 0),
  ])

  const rec = { d: day, dc: 0, h: hour, hc: 0 }
  if (ipRec && ipRec.d === day) {
    rec.dc = ipRec.dc || 0
    if (ipRec.h === hour) rec.hc = ipRec.hc || 0
  }

  if (globalCount >= LIMITS.globalDay) return 'global'
  if (rec.hc >= LIMITS.perIpHour || rec.dc >= LIMITS.perIpDay) return 'ip'

  rec.hc += 1
  rec.dc += 1
  await Promise.all([
    kv.put(ipKey, JSON.stringify(rec), { expirationTtl: 60 * 60 * 26 }),
    kv.put(globalKey, String(globalCount + 1), { expirationTtl: 60 * 60 * 48 }),
  ])
  return null
}

function parseResult(text) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  let r
  try {
    r = JSON.parse(match[0])
  } catch {
    return null
  }
  const ok =
    r &&
    typeof r.maturityTier === 'string' &&
    typeof r.criticalGap === 'string' &&
    typeof r.summary === 'string' &&
    r.plan &&
    ['days30', 'days60', 'days90'].every((k) => r.plan[k] && Array.isArray(r.plan[k].actions)) &&
    Array.isArray(r.dimensions) &&
    r.recommendations &&
    r.recommendations.primary
  return ok ? r : null
}

export async function onRequestGet({ env }) {
  return json({ ready: Boolean(env.ANTHROPIC_API_KEY && env.RATE_LIMIT) })
}

export async function onRequestPost({ request, env }) {
  if (!originAllowed(request)) return fail(403, 'forbidden', MESSAGES.forbidden)
  if (!env.ANTHROPIC_API_KEY || !env.RATE_LIMIT) return fail(503, 'warming_up', MESSAGES.warmingUp)

  const declared = Number(request.headers.get('Content-Length') || 0)
  if (declared > MAX_BODY_BYTES) return fail(413, 'too_large', MESSAGES.badRequest)
  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return fail(413, 'too_large', MESSAGES.badRequest)

  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return fail(400, 'bad_request', MESSAGES.badRequest)
  }
  const userContent = validateAnswers(body && body.answers)
  if (!userContent) return fail(400, 'bad_request', MESSAGES.badRequest)

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const limited = await takeRateLimit(env.RATE_LIMIT, ip)
  if (limited === 'global') return fail(429, 'daily_cap', MESSAGES.globalLimit)
  if (limited === 'ip') return fail(429, 'rate_limited', MESSAGES.ipLimit)

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 45000 })

  let response
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      console.error('assessment: Anthropic rejected the API key', err.status)
      return fail(503, 'warming_up', MESSAGES.warmingUp)
    }
    if (err instanceof Anthropic.RateLimitError) {
      console.error('assessment: Anthropic rate limit or spend limit hit', err.status)
      return fail(503, 'busy', MESSAGES.busy)
    }
    if (err instanceof Anthropic.APIError) {
      console.error('assessment: Anthropic API error', err.status, err.message)
      return fail(err.status >= 500 ? 503 : 502, 'upstream', err.status >= 500 ? MESSAGES.busy : MESSAGES.failed)
    }
    console.error('assessment: request failed', err && err.message)
    return fail(502, 'upstream', MESSAGES.failed)
  }

  if (response.stop_reason !== 'end_turn') {
    console.error('assessment: unexpected stop_reason', response.stop_reason)
    return fail(502, 'upstream', MESSAGES.failed)
  }
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
  const result = parseResult(text)
  if (!result) {
    console.error('assessment: could not parse model output')
    return fail(502, 'upstream', MESSAGES.failed)
  }
  return json({ result })
}

