import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { expoAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Save, Globe, Share2, Link, Home, Search, Mail, RefreshCw, Zap, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react'

const TABS = [
  { id: 'identity', label: 'Site Identity', icon: Globe },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'links', label: 'Links', icon: Link },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'ai', label: 'AI & Email', icon: Zap },
]

const SETTING_FIELDS = {
  identity: [
    { key: 'site_name', label: 'Site Name', placeholder: 'MUTCU', type: 'text' },
    { key: 'site_tagline', label: 'Site Tagline', placeholder: 'Inspire Love, Hope & Godliness', type: 'text' },
    { key: 'site_email', label: 'Contact Email', placeholder: 'info@mutcu.org', type: 'email' },
    { key: 'site_location', label: 'Location', placeholder: "Murang'a University of Technology, Kenya", type: 'text' },
  ],
  social: [
    { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://www.facebook.com/...', type: 'url' },
    { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...', type: 'url' },
    { key: 'social_tiktok', label: 'TikTok URL', placeholder: 'https://www.tiktok.com/...', type: 'url' },
    { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://www.youtube.com/...', type: 'url' },
    { key: 'social_whatsapp', label: 'WhatsApp Number', placeholder: '+254700000000', type: 'text', help: 'Include country code, e.g. +254712345678' },
  ],
  links: [
    { key: 'portal_url', label: 'Member Portal URL', placeholder: 'https://portal.mutcu.org', type: 'url' },
  ],
  homepage: [
    { key: 'homepage_events_limit', label: 'Homepage Events Limit', placeholder: '6', type: 'number', help: 'Number of upcoming events shown on the homepage' },
    { key: 'homepage_gallery_limit', label: 'Homepage Gallery Limit', placeholder: '8', type: 'number', help: 'Number of photos shown in the homepage gallery preview' },
    { key: 'featured_videos_limit', label: 'Featured Videos Limit', placeholder: '4', type: 'number', help: 'Number of videos shown on the Resources page' },
  ],
  seo: [
    { key: 'meta_description', label: 'Default Meta Description', placeholder: 'MUTCU — Inspire Love, Hope & Godliness...', type: 'textarea', help: 'Shown in Google search results. Keep under 160 characters.' },
    { key: 'og_image', label: 'Default OG Image URL', placeholder: '/assets/images/exec.jpg', type: 'text', help: 'Image shown when sharing on social media (WhatsApp, Twitter, LinkedIn)' },
  ],
}

function StatusDot({ status }) {
  if (status === 'checking') return <Loader size={14} className="text-gray-400 animate-spin" />
  if (status === 'ok') return <CheckCircle size={14} className="text-green-500" />
  if (status === 'error') return <XCircle size={14} className="text-red-500" />
  return <div className="w-3.5 h-3.5 rounded-full bg-gray-200" />
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('identity')
  const [testEmailSending, setTestEmailSending] = useState(false)
  const [testEmailStatus, setTestEmailStatus] = useState(null) // null | 'sent' | 'error'
  const [clearingCache, setClearingCache] = useState(false)
  const [aiStatus, setAiStatus] = useState(null)
  const [healthStatus, setHealthStatus] = useState({ brevo: null, ai: null })

  useEffect(() => {
    api.get('/settings')
      .then(data => setSettings(data.settings || {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Check AI status when AI tab is opened
  useEffect(() => {
    if (activeTab === 'ai' && !aiStatus) {
      api.get('/ai/status').then(d => setAiStatus(d)).catch(() => setAiStatus({ available: false }))
    }
  }, [activeTab, aiStatus])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', settings)
      toast.success('Settings saved successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  

  const sendExpoTestEmail = async () => {
    const emailTo = settings.site_email || ''
    if (!emailTo) return toast.error('Please set a contact email in Site Identity first')
    setTestEmailSending(true)
    try {
      const res = await expoAPI.testEmail(emailTo)
      toast.success(res.message || `Expo test email sent to ${emailTo}!`)
    } catch (err) {
      toast.error(err.message || 'Expo email test failed')
    } finally {
      setTestEmailSending(false)
    }
  }

  const clearDevotionalCache = async () => {
    setClearingCache(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      await api.put('/settings', { [`ai_devotional_${today}`]: '' })
      // Also clear localStorage
      localStorage.removeItem('mutcu_devotional')
      toast.success("Today's devotional cache cleared! A new one will be generated on next visit.")
    } catch (err) {
      toast.error('Failed to clear cache')
    } finally {
      setClearingCache(false)
    }
  }

  const fields = SETTING_FIELDS[activeTab] || []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Site Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Configure your website content, links, and SEO</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm self-start sm:self-auto">
          <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Layout: stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Tab navigation — horizontal scroll on mobile, vertical on desktop */}
        <div className="lg:w-48 flex-shrink-0">
          {/* Mobile: horizontal scroll tabs */}
          <div className="flex lg:hidden gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-montserrat font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}>
                <tab.icon size={12} />{tab.label}
              </button>
            ))}
          </div>
          {/* Desktop: vertical sidebar */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-2 space-y-0.5">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-montserrat font-semibold transition-all text-left ${activeTab === tab.id ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                <tab.icon size={14} className={activeTab === tab.id ? 'text-orange' : ''} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              {/* Tab heading */}
              <h2 className="font-montserrat font-bold text-navy text-base mb-5 flex items-center gap-2">
                {(() => { const t = TABS.find(t => t.id === activeTab); return t ? <><t.icon size={16} className="text-orange" />{t.label}</> : null })()}
              </h2>

              {/* Standard fields */}
              {fields.length > 0 && (
                <div className="space-y-5 mb-6">
                  {fields.map(field => (
                    <div key={field.key}>
                      <label className="form-label">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea className="form-textarea" rows={3} placeholder={field.placeholder}
                          value={settings[field.key] || ''}
                          onChange={e => handleChange(field.key, e.target.value)} />
                      ) : (
                        <input type={field.type} className="form-input" placeholder={field.placeholder}
                          value={settings[field.key] || ''}
                          onChange={e => handleChange(field.key, e.target.value)} />
                      )}
                      {field.help && <p className="text-gray-400 text-xs mt-1">{field.help}</p>}
                      {field.key === 'meta_description' && (
                        <p className={`text-xs mt-1 font-montserrat font-semibold ${(settings[field.key] || '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                          {(settings[field.key] || '').length}/160 characters
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Identity tab extras ── */}
              {activeTab === 'identity' && (
                <div className="pt-5 border-t border-gray-100">
                  <h4 className="font-montserrat font-bold text-navy text-sm mb-1 flex items-center gap-2">
                    <Mail size={14} className="text-orange" /> Email Configuration Test
                  </h4>
                  <p className="text-gray-500 text-xs mb-3">
                    Send a test email to <strong>{settings.site_email || 'your contact email'}</strong> to verify Brevo is working.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={sendTestEmail} disabled={testEmailSending}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold border-2 transition-all disabled:opacity-60 ${testEmailStatus === 'sent' ? 'border-green-500 text-green-600 bg-green-50' : testEmailStatus === 'error' ? 'border-red-400 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600 hover:border-orange hover:text-orange'}`}>
                      {testEmailSending ? <><RefreshCw size={12} className="animate-spin" />Sending...</> : testEmailStatus === 'sent' ? <><CheckCircle size={12} />Email Sent ✓</> : testEmailStatus === 'error' ? <><XCircle size={12} />Failed — Check Brevo Key</> : <><Mail size={12} />Send Test Email</>}
                    </button>
                    <button onClick={sendExpoTestEmail} disabled={testEmailSending}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold border-2 border-gray-200 text-gray-600 hover:border-orange hover:text-orange transition-all disabled:opacity-60">
                      <Mail size={12} /> Test Expo Email
                    </button>
                  </div>
                  {testEmailStatus === 'error' && (
                    <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-lato">
                      <strong>Troubleshooting:</strong> Go to Render → your backend service → Environment → verify <code className="bg-red-100 px-1 rounded">BREVO_API_KEY</code>, <code className="bg-red-100 px-1 rounded">MAIL_FROM_EMAIL</code>, and <code className="bg-red-100 px-1 rounded">ADMIN_EMAIL</code> are set correctly. Also check Brevo dashboard → Senders → verify your sender email is approved.
                    </div>
                  )}
                </div>
              )}

              {/* ── Social tab extras ── */}
              {activeTab === 'social' && (
                <div className="pt-5 border-t border-gray-100">
                  <h4 className="font-montserrat font-bold text-navy text-sm mb-3">Social Links Preview</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'social_facebook', icon: 'fab fa-facebook-f', color: 'bg-blue-600', label: 'Facebook' },
                      { key: 'social_instagram', icon: 'fab fa-instagram', color: 'bg-pink-600', label: 'Instagram' },
                      { key: 'social_tiktok', icon: 'fab fa-tiktok', color: 'bg-gray-900', label: 'TikTok' },
                      { key: 'social_youtube', icon: 'fab fa-youtube', color: 'bg-red-600', label: 'YouTube' },
                      { key: 'social_whatsapp', icon: 'fab fa-whatsapp', color: 'bg-green-600', label: 'WhatsApp' },
                    ].map(s => settings[s.key] && (
                      <a key={s.key}
                        href={s.key === 'social_whatsapp' ? `https://wa.me/${settings[s.key].replace(/[^0-9]/g, '')}` : settings[s.key]}
                        target="_blank" rel="noopener noreferrer"
                        className={`${s.color} text-white flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-montserrat font-semibold hover:opacity-90 transition-all`}>
                        <i className={s.icon} />{s.label}
                      </a>
                    ))}
                    {!['social_facebook','social_instagram','social_tiktok','social_youtube','social_whatsapp'].some(k => settings[k]) && (
                      <p className="text-gray-400 text-xs">No social links set yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── SEO tab extras ── */}
              {activeTab === 'seo' && settings.meta_description && (
                <div className="pt-5 border-t border-gray-100">
                  <h4 className="font-montserrat font-bold text-navy text-xs mb-2 uppercase tracking-wider">Google Search Preview</h4>
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-blue-600 text-sm font-medium truncate">{settings.site_name || 'MUTCU'} — {settings.site_tagline || 'Inspire Love, Hope & Godliness'}</div>
                    <div className="text-green-700 text-xs mt-0.5">mutcu.org</div>
                    <div className="text-gray-600 text-xs mt-1 line-clamp-2">{settings.meta_description}</div>
                  </div>
                  <h4 className="font-montserrat font-bold text-navy text-xs mb-2 uppercase tracking-wider mt-4">WhatsApp / Social Share Preview</h4>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex gap-3 items-start">
                    {settings.og_image && (
                      <img src={settings.og_image} alt="OG" className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        onError={e => { e.target.style.display = 'none' }} />
                    )}
                    <div>
                      <div className="text-navy text-sm font-semibold">{settings.site_name || 'MUTCU'} — {settings.site_tagline || 'Inspire Love, Hope & Godliness'}</div>
                      <div className="text-gray-500 text-xs mt-0.5 line-clamp-2">{settings.meta_description}</div>
                      <div className="text-gray-400 text-xs mt-1">mutcu.org</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── AI & Email tab ── */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  {/* AI Status */}
                  <div>
                    <h4 className="font-montserrat font-bold text-navy text-sm mb-3 flex items-center gap-2">
                      <Zap size={14} className="text-orange" /> AI Provider Status
                    </h4>
                    {!aiStatus ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange" />
                        Checking AI status...
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-2">
                            <StatusDot status={aiStatus.providers?.groq ? 'ok' : 'error'} />
                            <span className="font-montserrat font-semibold text-navy text-sm">Groq AI</span>
                            <span className="text-gray-400 text-xs">(Chatbot, Devotionals, Prayer, Blog drafts)</span>
                          </div>
                          <span className={`text-xs font-montserrat font-bold px-2 py-0.5 rounded-full ${aiStatus.providers?.groq ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {aiStatus.providers?.groq ? 'Connected' : 'Not configured'}
                          </span>
                        </div>
                        {!aiStatus.providers?.groq && (
                          <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-700 font-lato">
                            <strong>To enable AI:</strong> Add <code className="bg-yellow-100 px-1 rounded">GROQ_API_KEY</code> to your Render environment variables. Get a free key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline">console.groq.com</a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* AI Features */}
                  <div>
                    <h4 className="font-montserrat font-bold text-navy text-sm mb-3">AI Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { icon: 'fa-robot', label: 'MUTCU Chatbot', desc: 'Answers visitor questions about MUTCU' },
                        { icon: 'fa-praying-hands', label: 'Prayer Encouragement', desc: 'Generates scripture-based responses' },
                        { icon: 'fa-book-open', label: 'Daily Devotional', desc: 'Generates and caches daily devotionals' },
                        { icon: 'fa-pen', label: 'Blog Draft Generator', desc: 'Helps write blog posts in admin' },
                        { icon: 'fa-fire', label: 'Ministry Matcher', desc: 'Recommends ministries via quiz' },
                        { icon: 'fa-envelope', label: 'Contact Auto-Reply', desc: 'Sends AI acknowledgment emails' },
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <i className={`fas ${f.icon} text-orange text-sm mt-0.5`} />
                          <div>
                            <div className="font-montserrat font-bold text-navy text-xs">{f.label}</div>
                            <div className="text-gray-400 text-xs">{f.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cache management */}
                  <div className="pt-5 border-t border-gray-100">
                    <h4 className="font-montserrat font-bold text-navy text-sm mb-1 flex items-center gap-2">
                      <RefreshCw size={14} className="text-orange" /> Cache Management
                    </h4>
                    <p className="text-gray-500 text-xs mb-3">
                      The daily devotional is cached in Supabase and the visitor's browser for the current day. Clear it to force a new devotional to be generated.
                    </p>
                    <button onClick={clearDevotionalCache} disabled={clearingCache}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold border-2 border-gray-200 text-gray-600 hover:border-orange hover:text-orange transition-all disabled:opacity-60">
                      {clearingCache ? <><RefreshCw size={12} className="animate-spin" />Clearing...</> : <><RefreshCw size={12} />Clear Today's Devotional Cache</>}
                    </button>
                  </div>

                  {/* Email config + diagnostics */}
                  <div className="pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-montserrat font-bold text-navy text-sm flex items-center gap-2">
                        <Mail size={14} className="text-orange" /> Email (Brevo) Configuration
                      </h4>
                      <button onClick={loadEmailDiagnostics} disabled={loadingDiag}
                        className="flex items-center gap-1 text-xs font-montserrat font-semibold text-orange hover:underline disabled:opacity-50">
                        {loadingDiag ? <><RefreshCw size={11} className="animate-spin" />Checking...</> : <><RefreshCw size={11} />Run Diagnostics</>}
                      </button>
                    </div>

                    {/* Diagnostics result */}
                    {emailDiag && (
                      <div className={`p-4 rounded-xl mb-4 ${emailDiag.configured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {emailDiag.configured
                            ? <><CheckCircle size={14} className="text-green-600" /><span className="font-montserrat font-bold text-green-700 text-sm">Email is configured correctly</span></>
                            : <><XCircle size={14} className="text-red-600" /><span className="font-montserrat font-bold text-red-700 text-sm">Email is NOT configured</span></>
                          }
                        </div>
                        {emailDiag.issues?.length > 0 && (
                          <ul className="space-y-1 mb-3">
                            {emailDiag.issues.map((issue, i) => (
                              <li key={i} className="text-xs text-red-600 font-lato flex items-start gap-1">
                                <span className="text-red-400 flex-shrink-0">•</span>{issue}
                              </li>
                            ))}
                          </ul>
                        )}
                        {emailDiag.envVars && (
                          <div className="space-y-1">
                            {Object.entries(emailDiag.envVars).map(([key, val]) => (
                              <div key={key} className="flex items-center gap-2 text-xs font-lato">
                                <code className={`font-bold ${val.includes('NOT SET') ? 'text-red-600' : 'text-green-700'}`}>{key}</code>
                                <span className="text-gray-500">{val}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {!emailDiag.configured && emailDiag.instructions && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <p className="text-xs font-montserrat font-bold text-red-700 mb-1">How to fix:</p>
                            <ol className="space-y-0.5">
                              {emailDiag.instructions.map((step, i) => (
                                <li key={i} className="text-xs text-red-600 font-lato">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-gray-500 text-xs mb-3">
                      All transactional emails are sent via Brevo. Set these environment variables on Render:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {[
                        { label: 'BREVO_API_KEY', desc: 'API key from app.brevo.com → Account → API Keys', required: true },
                        { label: 'MAIL_FROM_EMAIL', desc: 'Verified sender email in Brevo Senders', required: true },
                        { label: 'MAIL_FROM_NAME', desc: 'Sender name shown in inbox (e.g. MUTCU)', required: false },
                        { label: 'ADMIN_EMAIL', desc: 'Where admin notifications are delivered', required: true },
                      ].map((v, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs font-bold text-navy">{v.label}</code>
                            {v.required && <span className="text-orange text-xs">*</span>}
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">{v.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={sendTestEmail} disabled={testEmailSending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold border-2 transition-all disabled:opacity-60 ${testEmailStatus === 'sent' ? 'border-green-500 text-green-600 bg-green-50' : testEmailStatus === 'error' ? 'border-red-400 text-red-600 bg-red-50' : 'border-gray-200 text-gray-600 hover:border-orange hover:text-orange'}`}>
                        {testEmailSending ? <><RefreshCw size={12} className="animate-spin" />Sending...</> : testEmailStatus === 'sent' ? <><CheckCircle size={12} />Sent ✓</> : testEmailStatus === 'error' ? <><XCircle size={12} />Failed</> : <><Mail size={12} />Send Test Email</>}
                      </button>
                      <button onClick={sendExpoTestEmail} disabled={testEmailSending}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold border-2 border-gray-200 text-gray-600 hover:border-orange hover:text-orange transition-all disabled:opacity-60">
                        <Mail size={12} /> Test Expo Email
                      </button>
                      <a href="https://app.brevo.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-montserrat font-bold border-2 border-gray-200 text-gray-600 hover:border-orange hover:text-orange transition-all">
                        <i className="fas fa-external-link-alt text-xs" /> Open Brevo
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save button — bottom */}
      <div className="flex justify-end mt-5">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save size={14} />{saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  )
}