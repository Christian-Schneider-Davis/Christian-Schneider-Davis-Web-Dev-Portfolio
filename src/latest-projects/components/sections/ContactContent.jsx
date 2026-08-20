import { useState } from 'react'
import { SectionHeader } from './SectionHeader.jsx'
import { SectionFooter } from './SectionFooter.jsx'
import { Icon } from '../common/Icon.jsx'
import './sections.css'
import './ContactContent.css'

const CONTACT_EMAIL = 'hello@christianschneiderdavis.com'

export function ContactContent() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`Project inquiry from ${form.name || 'your website'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="section-content">
      <SectionHeader
        eyebrow="Contact"
        title="Tell me about the project"
        tagline="Fill this out and it opens a message addressed to me, ready to send from your own inbox."
      />

      <div className="section-content__body">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__row">
            <label>
              <span>Name</span>
              <input required type="text" value={form.name} onChange={update('name')} placeholder="Jamie Rivera" />
            </label>
            <label>
              <span>Email</span>
              <input required type="email" value={form.email} onChange={update('email')} placeholder="jamie@studio.com" />
            </label>
          </div>
          <label>
            <span>What are you building?</span>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={update('message')}
              placeholder="A few lines about the project, timeline, and budget range."
            />
          </label>
          <button type="submit" className="contact-form__submit">
            Send message <Icon name="send" size={16} />
          </button>
        </form>

        <div className="contact-direct">
          <span className="contact-direct__label">Prefer email directly?</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>

      <SectionFooter />
    </div>
  )
}
