import { useEffect, useState } from 'react'
import api from '../../lib/api'
import toast from 'react-hot-toast'
import { Save, Globe, Share2, Link, Home, Search, Mail, RefreshCw } from 'lucide-react'

const TABS = [
  { id: 'identity', label: 'Site Identity', icon: Globe },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'links', label: 'Links', icon: Link },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'seo', label: 'SEO', icon: Search },
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
    { key: 'social_whatsapp', label: 'WhatsApp Number', placeholder: '+254700000000', type: 'text' },
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
    { key: 'og_image', label: 'Default OG Image URL', placeholder: '/assets/images/exec.jpg', type: 'text', help: 'Image shown when sharing on social media' },
  ],
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('identity')
  const [testEmailSending, setTestEmailSending] = useState(false)

  useEffect(() => {
    api.get('/settings')
      .then(data => setSettings(data.settings || {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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

  const sendTestEmail = async () => {
    setTestEmailSending(true)
    try {
      await api.post('/admin/test-email', { email: settings.site_email })
      toast.success('Test email sent!')
    } catch (err) {
      toast.error('Failed to send test email')
    } finally {
      setTestEmailSending(false)
    }
  }

  const fields = SETTING_FIELDS[activeTab] || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Site Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Configure your website content, links, and SEO</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
          <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-0.5">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-montserrat font-semibold transition-all text-left ${activeTab === tab.id ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-montserrat font-bold text-navy text-base mb-5 flex items-center gap-2">
                {(() => { const t = TABS.find(t => t.id === activeTab); return t ? <><t.icon size={16} className="text-orange" />{t.label}</> : null })()}
              </h2>
              <div className="space-y-5">
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
                      <p className={`text-xs mt-1 ${(settings[field.key] || '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                        {(settings[field.key] || '').length}/160 characters
                      </p>
                    )}
                  </div>
                ))}

                {/* Social preview */}
                {activeTab === 'social' && (
                  <div className="bg-gray-50 rounded-xl p-4 mt-4">
                    <h4 className="font-montserrat font-bold text-navy text-sm mb-3">Social Links Preview</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'social_facebook', icon: 'fab fa-facebook-f', color: 'bg-blue-600' },
                        { key: 'social_instagram', icon: 'fab fa-instagram', color: 'bg-pink-600' },
                        { key: 'social_tiktok', icon: 'fab fa-tiktok', color: 'bg-gray-900' },
                        { key: 'social_youtube', icon: 'fab fa-youtube', color: 'bg-red-600' },
                      ].map(s => settings[s.key] && (
                        <a key={s.key} href={settings[s.key]} target="_blank" rel="noopener noreferrer"
                          className={`${s.color} text-white w-9 h-9 rounded-xl flex items-center justify-center text-sm hover:opacity-90 transition-all`}>
                          <i className={s.icon} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO preview */}
                {activeTab === 'seo' && settings.meta_description && (
                  <div className="bg-gray-50 rounded-xl p-4 mt-2">
                    <h4 className="font-montserrat font-bold text-navy text-xs mb-2 uppercase tracking-wider">Google Preview</h4>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-blue-600 text-sm font-medium">{settings.site_name || 'MUTCU'} — {settings.site_tagline || 'Inspire Love, Hope & Godliness'}</div>
                      <div className="text-green-700 text-xs">mutcu.org</div>
                      <div className="text-gray-600 text-xs mt-1 line-clamp-2">{settings.meta_description}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Email test (identity tab) */}
              {activeTab === 'identity' && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h4 className="font-montserrat font-bold text-navy text-sm mb-3 flex items-center gap-2">
                    <Mail size={14} className="text-orange" /> Email Configuration
                  </h4>
                  <p className="text-gray-500 text-sm mb-3">Test that your email notifications are working correctly.</p>
                  <button onClick={sendTestEmail} disabled={testEmailSending} className="btn-outline btn-sm">
                    {testEmailSending ? <><RefreshCw size={13} className="animate-spin" /> Sending...</> : <><Mail size={13} /> Send Test Email</>}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save button (bottom) */}
      <div className="flex justify-end mt-5">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save size={14} />{saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  )
}