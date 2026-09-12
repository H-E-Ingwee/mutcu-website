import { useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function AIPrayerForm({ compact = false }) {
  const [step, setStep] = useState('form') // form | submitting | encouragement
  const [name, setName] = useState('')
  const [request, setRequest] = useState('')
  const [encouragement, setEncouragement] = useState('')
  const [isFallback, setIsFallback] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!request.trim()) return toast.error('Please enter your prayer request')
    setStep('submitting')

    try {
      const res = await api.post('/prayer', {
        name: name.trim() || undefined,
        request: request.trim(),
        is_public: false,
      })
      setEncouragement(res.encouragement || '')
      setIsFallback(res.fallback || false)
      setStep('encouragement')
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please try again.')
      setStep('form')
    }
  }

  const reset = () => {
    setStep('form')
    setName('')
    setRequest('')
    setEncouragement('')
  }

  if (step === 'submitting') {
    return (
      <div className={`${compact ? 'p-6' : 'p-8'} text-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-orange/20 border-t-orange animate-spin" />
            <i className="fas fa-praying-hands text-orange text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <p className="font-montserrat font-bold text-white text-sm">Submitting your prayer request...</p>
            <p className="text-white/50 text-xs mt-1">Our AI is preparing a word of encouragement for you</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'encouragement') {
    return (
      <div className={`${compact ? 'p-6' : 'p-8'}`}>
        {/* Success header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-check-circle text-teal text-3xl" />
          </div>
          <h3 className="font-montserrat font-bold text-white text-lg mb-1">Prayer Request Received</h3>
          <p className="text-white/60 text-sm">Our Prayer Ministry will intercede for you.</p>
        </div>

        {/* AI Encouragement */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-orange/20 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-star text-orange text-xs" />
            </div>
            <span className="font-montserrat font-bold text-orange text-xs uppercase tracking-wider">
              {isFallback ? 'A Word of Encouragement' : 'AI-Generated Encouragement'}
            </span>
          </div>
          <p className="text-white/85 text-sm leading-relaxed italic">
            {encouragement}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={reset} className="btn-outline-white flex-1 justify-center btn-sm">
            <i className="fas fa-plus" /> Submit Another Request
          </button>
          <a href="/ministries/prayer-ministry" className="btn-primary flex-1 justify-center btn-sm">
            <i className="fas fa-praying-hands" /> Prayer Ministry
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`${compact ? 'p-6' : 'p-8'} space-y-4`}>
      {!compact && (
        <h3 className="font-montserrat font-bold text-white text-xl mb-2">Submit a Prayer Request</h3>
      )}
      <div>
        <label className="form-label text-white/80">Your Name (Optional)</label>
        <input
          type="text"
          className="form-input bg-white/10 border-white/20 text-white placeholder-white/40"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <p className="text-white/40 text-xs mt-1">You may submit anonymously if preferred.</p>
      </div>
      <div>
        <label className="form-label text-white/80">Prayer Request <span className="text-orange">*</span></label>
        <textarea
          className="form-textarea bg-white/10 border-white/20 text-white placeholder-white/40"
          rows={compact ? 4 : 5}
          placeholder="Share your prayer request here..."
          required
          value={request}
          onChange={e => setRequest(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center">
        <i className="fas fa-paper-plane" /> Submit Request
      </button>
      <p className="text-white/30 text-xs text-center flex items-center justify-center gap-1">
        <i className="fas fa-lock text-xs" /> Your request is kept confidential
        <span className="mx-1">·</span>
        <i className="fas fa-robot text-xs" /> AI encouragement powered by Gemini
      </p>
    </form>
  )
}