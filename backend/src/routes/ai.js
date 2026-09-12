const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const {
  generatePrayerEncouragement,
  generateDailyDevotional,
  generateBlogDraft,
  generateContactReply,
  generateMinistryMatch,
} = require('../lib/gemini')

// ─── Rate limiting helper ─────────────────────────────────────────────────────
const requestCounts = new Map()
function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now()
  const key = `${ip}-${Math.floor(now / windowMs)}`
  const count = (requestCounts.get(key) || 0) + 1
  requestCounts.set(key, count)
  // Cleanup old keys
  if (requestCounts.size > 1000) {
    const cutoff = Math.floor(now / windowMs) - 2
    for (const [k] of requestCounts) {
      if (parseInt(k.split('-').pop()) < cutoff) requestCounts.delete(k)
    }
  }
  return count > limit
}

// ─── POST /api/ai/prayer-encouragement ───────────────────────────────────────
// Public — generates encouragement for a submitted prayer request
router.post('/prayer-encouragement', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress
    if (rateLimit(ip, 10, 60000)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }

    const { request, name } = req.body
    if (!request?.trim()) return res.status(400).json({ error: 'Prayer request is required' })

    const encouragement = await generatePrayerEncouragement(request.trim(), name?.trim())

    if (!encouragement) {
      return res.json({
        encouragement: "Thank you for sharing your heart with us. Our Prayer Ministry will be interceding for you. \"Cast all your anxiety on him because he cares for you.\" (1 Peter 5:7). May God's peace, which surpasses all understanding, guard your heart and mind in Christ Jesus.",
        fallback: true,
      })
    }

    res.json({ encouragement, fallback: false })
  } catch (err) {
    console.error('[AI] Prayer encouragement error:', err.message)
    res.json({
      encouragement: "Thank you for sharing your heart with us. Our Prayer Ministry will be interceding for you. \"Cast all your anxiety on him because he cares for you.\" (1 Peter 5:7). May God's peace guard your heart and mind in Christ Jesus.",
      fallback: true,
    })
  }
})

// ─── GET /api/ai/devotional ───────────────────────────────────────────────────
// Public — returns today's devotional (cached in Supabase)
router.get('/devotional', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Check cache first
    const { data: cached } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', `ai_devotional_${today}`)
      .single()

    if (cached?.value) {
      try {
        const devotional = JSON.parse(cached.value)
        return res.json({ devotional, cached: true, date: today })
      } catch {}
    }

    // Generate new devotional
    const devotional = await generateDailyDevotional(today)

    if (!devotional) {
      return res.json({
        devotional: {
          title: 'Walking in Faith Today',
          verse: 'Trust in the LORD with all your heart and lean not on your own understanding.',
          reference: 'Proverbs 3:5',
          reflection: 'Each day is a new opportunity to trust God completely. As university students, we face many uncertainties — exams, relationships, the future. But God\'s word reminds us that His understanding far surpasses ours. When we surrender our plans to Him, He directs our paths in ways we could never imagine.',
          prayer: 'Lord, help me to trust You completely today, surrendering my worries and plans into Your capable hands. Amen.',
        },
        cached: false,
        date: today,
      })
    }

    // Cache in Supabase for 24 hours
    await supabase.from('website_settings').upsert({
      key: `ai_devotional_${today}`,
      value: JSON.stringify(devotional),
      label: `AI Devotional for ${today}`,
      category: 'ai_cache',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })

    res.json({ devotional, cached: false, date: today })
  } catch (err) {
    console.error('[AI] Devotional error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/blog-draft (admin only) ────────────────────────────────────
router.post('/blog-draft', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, topic, tone } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })

    const draft = await generateBlogDraft(title.trim(), topic?.trim(), tone || 'devotional')

    if (!draft) return res.status(503).json({ error: 'AI generation failed. Please try again.' })

    res.json({ draft, title })
  } catch (err) {
    console.error('[AI] Blog draft error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/contact-reply ───────────────────────────────────────────────
// Internal — called after contact form submission
router.post('/contact-reply', async (req, res) => {
  try {
    const { name, subject, message } = req.body
    if (!name || !subject || !message) return res.status(400).json({ error: 'Missing fields' })

    const reply = await generateContactReply(name, subject, message)
    res.json({ reply })
  } catch (err) {
    console.error('[AI] Contact reply error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/ai/ministry-match ─────────────────────────────────────────────
// Public — ministry recommendation quiz
router.post('/ministry-match', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress
    if (rateLimit(ip, 20, 60000)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }

    const { passion, gifts, activity, personality, time } = req.body
    if (!passion || !gifts || !activity) {
      return res.status(400).json({ error: 'Please answer all quiz questions' })
    }

    const match = await generateMinistryMatch({ passion, gifts, activity, personality, time })

    if (!match) {
      return res.json({
        match: {
          primary: 'Prayer Ministry',
          reason: 'Prayer is the foundation of all ministry at MUTCU. Whatever your gifts, a strong prayer life will enhance everything you do for God.',
          secondary: 'Bible Study & Training',
          secondaryReason: 'Growing in the Word equips you for every area of ministry and life.',
          encouragement: 'God has uniquely gifted you — trust Him to show you where you fit best!',
        },
        fallback: true,
      })
    }

    res.json({ match, fallback: false })
  } catch (err) {
    console.error('[AI] Ministry match error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/ai/status ───────────────────────────────────────────────────────
router.get('/status', (req, res) => {
  res.json({
    gemini: !!process.env.GEMINI_API_KEY,
    features: ['prayer-encouragement', 'devotional', 'blog-draft', 'ministry-match'],
  })
})

module.exports = router