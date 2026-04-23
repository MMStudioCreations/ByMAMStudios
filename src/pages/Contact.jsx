import { useState } from 'react'
import SEOHead from '../components/SEOHead.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import GoldRule from '../components/GoldRule.jsx'

const SUBJECTS = [
  { value: 'discovery', label: 'Discovery Call' },
  { value: 'product', label: 'Product Question' },
  { value: 'consulting', label: 'Consulting Inquiry' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const subjectLabel = SUBJECTS.find((s) => s.value === form.subject)?.label || form.subject || 'General Inquiry'
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || 'N/A'}\nSubject: ${subjectLabel}\n\n${form.message}`
    )
    const subject = encodeURIComponent(`[By MAM Studio] ${subjectLabel} from ${form.name}`)
    window.location.href = `mailto:hello@bymamstudio.com?subject=${subject}&body=${body}`
  }

  const field = (name, value) => setForm((f) => ({ ...f, [name]: value }))
  const inputClass = (err) =>
    `w-full bg-surface border rounded px-4 py-3 font-body text-warm text-sm placeholder-slate focus:outline-none focus:border-gold transition-colors ${
      err ? 'border-sienna' : 'border-border'
    }`

  return (
    <>
      <SEOHead
        title="Contact By MAM Studio — Start a Project or Ask a Question"
        description="For service inquiries, product questions, licensing, or consulting engagements. By MAM Studio responds to all inquiries within 1 business day."
        canonical="https://bymamstudio.com/contact"
      />

      <div className="bg-navy border-b border-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>GET IN TOUCH</SectionLabel>
          <h1 className="font-display text-white font-semibold" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Get in Touch
          </h1>
          <p className="font-body text-stone mt-4 max-w-xl leading-relaxed">
            For service inquiries, product questions, licensing, or consulting engagements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* LEFT — CONTACT INFO */}
          <div>
            <h2 className="font-display text-warm text-2xl font-semibold mb-8">Contact</h2>
            <ul className="space-y-4 mb-10">
              <li>
                <p className="font-mono text-slate mb-1" style={{ fontSize: '10px' }}>EMAIL</p>
                <a href="mailto:hello@bymamstudio.com" className="font-body text-stone hover:text-warm transition-colors">
                  hello@bymamstudio.com
                </a>
              </li>
              <li>
                <p className="font-mono text-slate mb-1" style={{ fontSize: '10px' }}>WEB</p>
                <a href="https://bymamstudio.com" target="_blank" rel="noopener noreferrer" className="font-body text-stone hover:text-warm transition-colors">
                  bymamstudio.com
                </a>
              </li>
              <li>
                <p className="font-mono text-slate mb-1" style={{ fontSize: '10px' }}>HOLDING COMPANY</p>
                <a href="https://avorengroup.com" target="_blank" rel="noopener noreferrer" className="font-body text-stone hover:text-warm transition-colors">
                  AvorenGroup.com
                </a>
              </li>
              <li>
                <p className="font-mono text-slate mb-1" style={{ fontSize: '10px' }}>RESPONSE TIME</p>
                <p className="font-body text-stone text-sm">We respond to all inquiries within 1 business day.</p>
              </li>
            </ul>

            <GoldRule className="mb-8" />

            <div className="space-y-3">
              {[
                { label: 'Book a Discovery Call', subject: 'discovery' },
                { label: 'Product Question', subject: 'product' },
                { label: 'Partnership Inquiry', subject: 'partnership' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={`mailto:hello@bymamstudio.com?subject=${encodeURIComponent(`[By MAM Studio] ${item.label}`)}`}
                  className="block border border-border text-stone font-body text-sm px-5 py-3 rounded hover:border-gold hover:text-warm transition-all"
                >
                  {item.label} →
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div>
            <h2 className="font-display text-warm text-2xl font-semibold mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="font-mono text-slate block mb-1.5" style={{ fontSize: '11px' }}>NAME *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => field('name', e.target.value)}
                  placeholder="Your name"
                  className={inputClass(errors.name)}
                />
                {errors.name && <p className="font-mono text-sienna mt-1" style={{ fontSize: '10px' }}>{errors.name}</p>}
              </div>

              <div>
                <label className="font-mono text-slate block mb-1.5" style={{ fontSize: '11px' }}>EMAIL *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => field('email', e.target.value)}
                  placeholder="you@email.com"
                  className={inputClass(errors.email)}
                />
                {errors.email && <p className="font-mono text-sienna mt-1" style={{ fontSize: '10px' }}>{errors.email}</p>}
              </div>

              <div>
                <label className="font-mono text-slate block mb-1.5" style={{ fontSize: '11px' }}>COMPANY (optional)</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => field('company', e.target.value)}
                  placeholder="Your company"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className="font-mono text-slate block mb-1.5" style={{ fontSize: '11px' }}>SUBJECT</label>
                <select
                  value={form.subject}
                  onChange={(e) => field('subject', e.target.value)}
                  className={inputClass(false)}
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-slate block mb-1.5" style={{ fontSize: '11px' }}>MESSAGE *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => field('message', e.target.value)}
                  placeholder="Tell us about your project or question."
                  rows={5}
                  className={inputClass(errors.message)}
                />
                {errors.message && <p className="font-mono text-sienna mt-1" style={{ fontSize: '10px' }}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-ink font-body font-semibold py-3 rounded hover:bg-goldlt transition-all"
              >
                Send Message
              </button>

              <p className="font-mono text-slate text-center" style={{ fontSize: '10px' }}>
                No spam. No CRM drip sequences. Just a real reply.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
