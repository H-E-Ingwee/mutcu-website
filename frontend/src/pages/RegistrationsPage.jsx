import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formsAPI } from '../lib/api'
import SEO from '../components/SEO'
import PageHero from '../components/PageHero'
import toast from 'react-hot-toast'

// ─── Dynamic form renderer ────────────────────────────────────────────────────
function DynamicForm({ form }) {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  let fields = form.fields || []
  if (typeof fields === 'string') { try { fields = JSON.parse(fields) } catch { fields = [] } }

  const set = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const toggleCheckbox = (key, option) => {
    const current = values[key] || []
    set(key, current.includes(option) ? current.filter(v => v !== option) : [...current, option])
  }

  const validate = () => {
    const e = {}
    fields.forEach(f => {
      if (f.required) {
        const val = values[f.key]
        if (!val || (Array.isArray(val) && val.length === 0) || String(val).trim() === '') {
          e[f.key] = `${f.label} is required`
        }
        if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          e[f.key] = 'Please enter a valid email address'
        }
      }
    })
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await formsAPI.submit(form.slug, values)
      setSubmitted(true)
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.message || 'Registrations are closed.')
      } else {
        toast.error(err.message || 'Submission failed. Please try again.')
      }
    } finally { setSubmitting(false) }
  }

  const inputBase = 'w-full px-4 py-3 rounded-xl border text-sm font-lato transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange/40'
  const inputClass = (key) => `${inputBase} ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-orange'}`
  const labelClass = 'block text-xs font-montserrat font-bold text-navy uppercase tracking-wider mb-1.5'

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid #16A34A' }}>
          <i className="fas fa-check-circle text-green-600 text-4xl" />
        </div>
        <h3 className="font-montserrat font-black text-navy text-2xl mb-3">Submission Received!</h3>
        <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-sm mx-auto">
          {form.success_message || 'Thank you for your submission! We will be in touch soon.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setValues({}) }}
            className="px-5 py-2.5 rounded-xl font-montserrat font-bold text-orange text-sm border-2 border-orange hover:bg-orange hover:text-white transition-all">
            Submit Another Response
          </button>
          <Link to="/" className="px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm transition-all" style={{ background: '#04003D' }}>
            Back to MUTCU
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {fields.map(field => (
        <div key={field.key}>
          <label className={labelClass}>
            {field.label} {field.required && <span className="text-orange">*</span>}
          </label>

          {field.type === 'textarea' && (
            <textarea value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder || ''} rows={4}
              className={`${inputClass(field.key)} resize-none`} />
          )}

          {field.type === 'select' && (
            <select value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)}
              className={inputClass(field.key)}>
              <option value="">Select an option</option>
              {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          )}

          {field.type === 'radio' && (
            <div className="space-y-2">
              {(field.options || []).map(opt => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${values[field.key] === opt ? 'border-orange bg-orange' : 'border-gray-300 group-hover:border-orange'}`}
                    onClick={() => set(field.key, opt)}>
                    {values[field.key] === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-lato text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === 'checkbox' && (
            <div className="space-y-2">
              {(field.options || []).map(opt => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${(values[field.key] || []).includes(opt) ? 'border-orange bg-orange' : 'border-gray-300 group-hover:border-orange'}`}
                    onClick={() => toggleCheckbox(field.key, opt)}>
                    {(values[field.key] || []).includes(opt) && <i className="fas fa-check text-white text-xs" />}
                  </div>
                  <span className="text-sm font-lato text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === 'date' && (
            <input type="date" value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)}
              className={inputClass(field.key)} />
          )}

          {!['textarea','select','radio','checkbox','date'].includes(field.type) && (
            <input type={field.type} value={values[field.key] || ''} onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder || ''} className={inputClass(field.key)} />
          )}

          {errors[field.key] && <p className="text-red-500 text-xs mt-1 font-lato">{errors[field.key]}</p>}
        </div>
      ))}

      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-montserrat font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: submitting ? '#ccc' : '#FF9700', boxShadow: submitting ? 'none' : '0 4px 20px rgba(255,151,0,0.35)' }}>
        {submitting ? (
          <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Submitting...</>
        ) : (
          <><i className="fas fa-paper-plane" />Submit Registration</>
        )}
      </button>
      <p className="text-center text-gray-400 text-xs font-lato">A confirmation email will be sent to you.</p>
    </form>
  )
}

// ─── Single form page ─────────────────────────────────────────────────────────
function SingleFormPage({ slug }) {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    formsAPI.getBySlug(slug)
      .then(data => setForm(data.form))
      .catch(err => setError(err.message || 'Form not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange" />
    </div>
  )

  if (error || !form) return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <i className="fas fa-exclamation-circle text-gray-300 text-5xl mb-4 block" />
      <h2 className="font-montserrat font-black text-navy text-2xl mb-2">Form Not Found</h2>
      <p className="text-gray-500 text-sm mb-6">This registration form doesn't exist or has been removed.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm" style={{ background: '#FF9700' }}>
        <i className="fas fa-home" /> Back to MUTCU
      </Link>
    </div>
  )

  const isClosed = form.status === 'closed' || (form.deadline && new Date(form.deadline) < new Date())
  const isDraft = form.status === 'draft'

  return (
    <>
      <SEO title={`${form.title} — MUTCU`} description={form.description || `Register for ${form.title}`} url={`/register/${form.slug}`} />
      <PageHero title={form.title} subtitle={form.description || ''} image="/assets/images/church2.jpg" />

      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          {/* Status banner */}
          {isClosed && (
            <div className="mb-6 p-4 rounded-2xl flex items-center gap-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <i className="fas fa-lock text-red-500 text-lg" />
              <div>
                <p className="font-montserrat font-bold text-red-600 text-sm">Registrations Closed</p>
                <p className="text-red-500/70 text-xs">
                  {form.deadline && new Date(form.deadline) < new Date()
                    ? `The registration deadline was ${new Date(form.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                    : 'This registration form is currently closed.'}
                  {' '}Contact us at <a href="mailto:mutcunion@gmail.com" className="underline">mutcunion@gmail.com</a> for more information.
                </p>
              </div>
            </div>
          )}

          {form.status === 'open' && !isClosed && (
            <div className="mb-6 p-3 rounded-2xl flex items-center gap-2" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <i className="fas fa-check-circle text-green-600" />
              <p className="font-montserrat font-semibold text-green-700 text-sm">
                Registrations Open
                {form.deadline && ` · Closes ${new Date(form.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
            </div>
          )}

          {/* Form card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              {isClosed || isDraft ? (
                <div className="text-center py-8">
                  <i className="fas fa-lock text-gray-300 text-4xl mb-4 block" />
                  <p className="font-montserrat font-bold text-gray-400 text-base">
                    {isDraft ? 'This form is not yet published.' : 'Registrations are currently closed.'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Contact us at <a href="mailto:mutcunion@gmail.com" className="text-orange hover:underline">mutcunion@gmail.com</a></p>
                </div>
              ) : (
                <DynamicForm form={form} />
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm font-montserrat font-semibold text-gray-400 hover:text-navy transition-colors">
              <i className="fas fa-arrow-left mr-1" /> Back to MUTCU Website
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

// ─── All forms listing page ───────────────────────────────────────────────────
function AllFormsPage() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    formsAPI.getAll()
      .then(data => setForms(data.forms || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO title="Registrations — MUTCU" description="Register for MUTCU events, programs, and activities." url="/register" />
      <PageHero title="Registrations" subtitle="Register for MUTCU events, programs, and activities." image="/assets/images/church2.jpg" />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange" />
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-clipboard-list text-gray-300 text-5xl mb-4 block" />
              <h2 className="font-montserrat font-black text-navy text-2xl mb-2">No Open Registrations</h2>
              <p className="text-gray-500 text-sm mb-6">There are no active registration forms at this time. Check back soon!</p>
              <Link to="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-montserrat font-bold text-white text-sm" style={{ background: '#FF9700' }}>
                View Events <i className="fas fa-arrow-right" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map(form => {
                const isClosed = form.status === 'closed' || (form.deadline && new Date(form.deadline) < new Date())
                return (
                  <Link key={form.id} to={`/register/${form.slug}`}
                    className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-orange/30 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-montserrat font-black text-navy text-base group-hover:text-orange transition-colors">{form.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold border ${isClosed ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200'}`}>
                            <i className={`fas ${isClosed ? 'fa-lock' : 'fa-check-circle'} text-xs`} />
                            {isClosed ? 'Closed' : 'Open'}
                          </span>
                        </div>
                        {form.description && <p className="text-gray-500 text-sm line-clamp-2">{form.description}</p>}
                        {form.deadline && (
                          <p className="text-gray-400 text-xs mt-1 font-montserrat">
                            <i className="fas fa-clock mr-1" />
                            {isClosed ? 'Closed' : 'Closes'}: {new Date(form.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <i className="fas fa-arrow-right text-gray-300 group-hover:text-orange transition-colors mt-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// ─── Router wrapper ───────────────────────────────────────────────────────────
export default function RegistrationsPage() {
  const { slug } = useParams()
  return slug ? <SingleFormPage slug={slug} /> : <AllFormsPage />
}