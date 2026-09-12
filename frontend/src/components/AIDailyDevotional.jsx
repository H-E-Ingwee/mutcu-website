import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function AIDailyDevotional({ compact = false }) {
  const [devotional, setDevotional] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Check local cache first (valid for today)
    const today = new Date().toISOString().split('T')[0]
    const cached = localStorage.getItem('mutcu_devotional')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.date === today && parsed.devotional) {
          setDevotional(parsed.devotional)
          setLoading(false)
          return
        }
      } catch {}
    }

    api.get('/ai/devotional')
      .then(data => {
        if (data.devotional) {
          setDevotional(data.devotional)
          // Cache locally
          localStorage.setItem('mutcu_devotional', JSON.stringify({ date: today, devotional: data.devotional }))
        }
      })
      .catch(() => {
        // Fallback devotional
        setDevotional({
          title: 'Walking in Faith Today',
          verse: 'Trust in the LORD with all your heart and lean not on your own understanding.',
          reference: 'Proverbs 3:5',
          reflection: "Each day is a new opportunity to trust God completely. As university students, we face many uncertainties — exams, relationships, the future. But God's word reminds us that His understanding far surpasses ours. When we surrender our plans to Him, He directs our paths in ways we could never imagine.",
          prayer: 'Lord, help me to trust You completely today, surrendering my worries and plans into Your capable hands. Amen.',
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} flex items-center gap-3`}>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange flex-shrink-0" />
        <span className="text-white/50 text-sm">Loading today's devotional...</span>
      </div>
    )
  }

  if (!devotional) return null

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  if (compact) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-orange/20 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-sun text-orange text-xs" />
          </div>
          <div>
            <div className="text-orange text-xs font-montserrat font-bold uppercase tracking-wider">Daily Devotional</div>
            <div className="text-white/40 text-xs">{today}</div>
          </div>
          <div className="ml-auto">
            <span className="text-white/20 text-xs flex items-center gap-1">
              <i className="fas fa-robot text-xs" /> AI
            </span>
          </div>
        </div>
        <h4 className="font-montserrat font-bold text-white text-base mb-2">{devotional.title}</h4>
        <div className="bg-orange/10 border border-orange/20 rounded-xl p-3 mb-3">
          <p className="text-white/80 text-sm italic leading-relaxed">"{devotional.verse}"</p>
          <p className="text-orange text-xs font-bold mt-1">— {devotional.reference}</p>
        </div>
        {!expanded ? (
          <button onClick={() => setExpanded(true)} className="text-orange text-xs font-semibold hover:underline flex items-center gap-1">
            Read full devotional <i className="fas fa-chevron-down text-xs" />
          </button>
        ) : (
          <>
            <p className="text-white/70 text-sm leading-relaxed mb-3">{devotional.reflection}</p>
            <div className="bg-teal/10 border border-teal/20 rounded-xl p-3">
              <p className="text-teal text-xs font-bold mb-1 flex items-center gap-1">
                <i className="fas fa-praying-hands text-xs" /> Prayer
              </p>
              <p className="text-white/70 text-sm italic">{devotional.prayer}</p>
            </div>
            <button onClick={() => setExpanded(false)} className="text-white/40 text-xs mt-3 hover:text-white/60 flex items-center gap-1">
              <i className="fas fa-chevron-up text-xs" /> Collapse
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" data-aos="fade-up">
      {/* Header */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange/20 flex items-center justify-center">
            <i className="fas fa-sun text-orange" />
          </div>
          <div>
            <div className="font-montserrat font-bold text-white text-sm">Daily Devotional</div>
            <div className="text-white/40 text-xs">{today}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-white/30 text-xs">
          <i className="fas fa-robot text-xs" />
          <span>Powered by Gemini AI</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-montserrat font-black text-navy text-xl mb-4">{devotional.title}</h3>

        {/* Verse */}
        <div className="bg-orange/5 border-l-4 border-orange rounded-r-2xl p-4 mb-5">
          <p className="text-navy text-base italic leading-relaxed mb-2">"{devotional.verse}"</p>
          <p className="text-orange font-montserrat font-bold text-sm">— {devotional.reference}</p>
        </div>

        {/* Reflection */}
        <div className="mb-5">
          <h5 className="font-montserrat font-bold text-navy text-sm mb-2 flex items-center gap-2">
            <i className="fas fa-book-open text-orange text-xs" /> Reflection
          </h5>
          <p className="text-gray-600 leading-relaxed">{devotional.reflection}</p>
        </div>

        {/* Prayer */}
        <div className="bg-teal/5 border border-teal/20 rounded-2xl p-4">
          <h5 className="font-montserrat font-bold text-teal text-sm mb-2 flex items-center gap-2">
            <i className="fas fa-praying-hands text-xs" /> Prayer
          </h5>
          <p className="text-gray-600 italic leading-relaxed">{devotional.prayer}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 flex items-center justify-between">
        <p className="text-gray-300 text-xs flex items-center gap-1">
          <i className="fas fa-sync-alt text-xs" /> Refreshes daily
        </p>
        <a href="/sermons" className="text-orange text-xs font-semibold hover:underline flex items-center gap-1">
          More Resources <i className="fas fa-arrow-right text-xs" />
        </a>
      </div>
    </div>
  )
}