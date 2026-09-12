import { useState } from 'react'
import { contactAPI, prayerAPI } from '../lib/api'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import SectionTitle from '../components/SectionTitle'
import toast from 'react-hot-toast'

const SUBJECTS = ['General Inquiry', 'Ministry Information', 'Event Information', 'Prayer Request', 'Partnership', 'Media & Press', 'Other']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      await contactAPI.submit(form)
      toast.success('Message sent! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div>
      
        subtitle="We'd love to hear from you. Reach out with any questions, prayer requests, or partnership inquiries."
        image="/assets/images/church2.jpg"
        badge="Get In Touch"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Contact Info */}
            <div data-aos="fade-right">
              <SectionTitle title="Get In Touch" center={false} />
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you have a question about our ministries, want to partner with us, or simply want to connect —
                we're here and happy to hear from you.
              </p>

              <div className="space-y-5">
                {[
                  { icon: 'fa-map-marker-alt', title: 'Location', text: "Murang'a University of Technology, Murang'a, Kenya" },
                  { icon: 'fa-envelope', title: 'Email', text: 'info@mutcu.org', href: 'mailto:info@mutcu.org' },
                  { icon: 'fa-globe', title: 'Member Portal', text: 'portal.mutcu.org', href: 'https://portal.mutcu.org' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${item.icon} text-orange`} />
                    </div>
                    <div>
                      <div className="font-montserrat font-bold text-navy text-sm mb-0.5">{item.title}</div>
                      {item.href
                        ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-600 text-sm hover:text-orange transition-colors">{item.text}</a>
                        : <p className="text-gray-600 text-sm">{item.text}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h4 className="font-montserrat font-bold text-navy text-sm mb-3">Follow Us</h4>
                <div className="flex gap-3">
                  
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white hover:bg-orange transition-colors">
                      <i className={s.icon} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Portal CTA */}
              <div className="mt-8 bg-navy rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-user-circle text-orange text-2xl" />
                  <div>
                    <div className="font-montserrat font-bold text-white text-sm">MUTCU Member Portal</div>
                    <div className="text-white/50 text-xs">For registered members</div>
                  </div>
                </div>
                <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm w-full justify-center">
                  Access Portal <i className="fas fa-external-link-alt" />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2" data-aos="fade-left">
              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="font-montserrat font-black text-navy text-2xl mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Full Name <span className="text-orange">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                        placeholder="Your full name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">Email Address <span className="text-orange">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                        placeholder="your@email.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Subject <span className="text-orange">*</span></label>
                    <select name="subject" value={form.subject} onChange={handleChange}
                      className={`form-select ${errors.subject ? 'border-red-400' : ''}`}>
                      <option value="">Select a subject...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="form-label">Message <span className="text-orange">*</span></label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={6}
                      className={`form-textarea ${errors.message ? 'border-red-400' : ''}`}
                      placeholder="Write your message here..." />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full justify-center">
                    {submitting ? <><i className="fas fa-spinner fa-spin" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
          <SectionTitle title="Find Us" subtitle="We meet at Murang'a University of Technology, Murang'a County, Kenya." />
          <div className="rounded-2xl overflow-hidden shadow-lg h-64 bg-navy flex items-center justify-center">
            <div className="text-center text-white">
              <i className="fas fa-map-marker-alt text-orange text-4xl mb-3 block" />
              <p className="font-montserrat font-bold">Murang'a University of Technology</p>
              <p className="text-white/60 text-sm">Murang'a County, Kenya</p>
              <a href="https://maps.google.com/?q=Murang'a+University+of+Technology" target="_blank" rel="noopener noreferrer"
                className="btn-primary btn-sm mt-4 inline-flex">
                <i className="fas fa-directions" /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}