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
  generateNewsletterContent,
  chatWithMUTCU,
  getAvailableProviders,
} = require('../lib/gemini')

// Rate limiter
const requestCounts = new Map()
function rateLimit(ip, limit = 15, windowMs = 60000) {
  const now = Date.now()
  const key = `${ip}-${Math.floor(now / windowMs)}`
  const count = (requestCounts.get(key) || 0) + 1
  requestCounts.set(key, count)
  if (requestCounts.size > 2000) {
    const cutoff = Math.floor(now / windowMs) - 2
    for (const [k] of requestCounts) {
      if (parseInt(k.split('-').pop()) < cutoff) requestCounts.delete(k)
    }
  }
  return count > limit
}

// GET /api/ai/status
router.get('/status', (req, res) => {
  const providers = getAvailableProviders()
  res.json({ available: providers.primary !== 'none', providers, features: ['prayer-encouragement', 'devotional', 'blog-draft', 'ministry-match', 'chatbot', 'newsletter-content'] })
})

// POST /api/ai/chat — MUTCU Chatbot
router.post('/chat', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress
    if (rateLimit(ip, 30, 60000)) {
      return res.status(429).json({ error: 'Too many messages. Please wait a moment.' })
    }

    const { messages } = req.body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' })
    }

    const validMessages = messages
      .filter(m => m.role && m.content && ['user', 'assistant'].includes(m.role))
      .slice(-10)
      .map(m => ({ role: m.role, content: String(m.content).substring(0, 1000) }))

    if (validMessages.length === 0) return res.status(400).json({ error: 'No valid messages' })

    const result = await chatWithMUTCU(validMessages)
    res.json({ reply: result.reply, provider: result.provider })
  } catch (err) {
    console.error('[CHATBOT]', err.message)
    res.status(500).json({
      error: 'Service temporarily unavailable',
      reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact us at mutcunion@gmail.com. God bless you!",
    })
  }
})

// POST /api/ai/prayer-encouragement
router.post('/prayer-encouragement', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress
    if (rateLimit(ip, 10, 60000)) return res.status(429).json({ error: 'Too many requests.' })

    const { request, name } = req.body
    if (!request?.trim()) return res.status(400).json({ error: 'Prayer request is required' })

    const encouragement = await generatePrayerEncouragement(request.trim(), name?.trim())
    res.json({
      encouragement: encouragement || "Thank you for sharing your heart with us. Our Prayer Ministry will be interceding for you. \"Cast all your anxiety on him because he cares for you.\" (1 Peter 5:7). May God's peace, which surpasses all understanding, guard your heart and mind in Christ Jesus. Amen.",
      fallback: !encouragement,
    })
  } catch (err) {
    console.error('[AI] Prayer encouragement error:', err.message)
    res.json({
      encouragement: "Thank you for sharing your heart with us. Our Prayer Ministry will be interceding for you. \"Cast all your anxiety on him because he cares for you.\" (1 Peter 5:7). May God's peace guard your heart and mind in Christ Jesus. Amen.",
      fallback: true,
    })
  }
})

// GET /api/ai/devotional
router.get('/devotional', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: cached } = await supabase.from('website_settings').select('value').eq('key', `ai_devotional_${today}`).single()
    if (cached?.value) {
      try { return res.json({ devotional: JSON.parse(cached.value), cached: true, date: today }) } catch {}
    }

    const devotional = await generateDailyDevotional(today)
    const fallback = {
      title: 'Walking in Faith Today',
      verse: 'Trust in the LORD with all your heart and lean not on your own understanding.',
      reference: 'Proverbs 3:5',
      reflection: "Each day is a new opportunity to trust God completely. As university students, we face many uncertainties — exams, relationships, the future. But God's word reminds us that His understanding far surpasses ours. When we surrender our plans to Him, He directs our paths in ways we could never imagine.",
      prayer: 'Lord, help me to trust You completely today, surrendering my worries and plans into Your capable hands. Amen.',
    }

    if (devotional) {
      await supabase.from('website_settings').upsert({
        key: `ai_devotional_${today}`, value: JSON.stringify(devotional),
        label: `AI Devotional for ${today}`, category: 'ai_cache', updated_at: new Date().toISOString(),
      }, { onConflict: 'key' }).catch(() => {})
    }

    res.json({ devotional: devotional || fallback, cached: false, date: today })
  } catch (err) {
    console.error('[AI] Devotional error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/blog-draft (admin)
router.post('/blog-draft', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, topic, tone } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })
    const draft = await generateBlogDraft(title.trim(), topic?.trim(), tone || 'devotional')
    if (!draft) return res.status(503).json({ error: 'Generation failed. Please try again.' })
    res.json({ draft, title })
  } catch (err) {
    console.error('[AI] Blog draft error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/contact-reply
router.post('/contact-reply', async (req, res) => {
  try {
    const { name, subject, message } = req.body
    if (!name || !subject || !message) return res.status(400).json({ error: 'Missing fields' })
    const reply = await generateContactReply(name, subject, message)
    res.json({ reply })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/ai/ministry-match
router.post('/ministry-match', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress
    if (rateLimit(ip, 20, 60000)) return res.status(429).json({ error: 'Too many requests.' })

    const { passion, gifts, activity, personality, time } = req.body
    if (!passion || !gifts || !activity) return res.status(400).json({ error: 'Please answer all quiz questions' })

    const match = await generateMinistryMatch({ passion, gifts, activity, personality, time })
    res.json({
      match: match || {
        primary: 'Prayer Ministry',
        reason: 'Prayer is the foundation of all ministry at MUTCU. Whatever your gifts, a strong prayer life will enhance everything you do for God.',
        secondary: 'Bible Study & Training',
        secondaryReason: 'Growing in the Word equips you for every area of ministry and life.',
        encouragement: 'God has uniquely gifted you — trust Him to show you where you fit best!',
      },
      fallback: !match,
    })
  } catch (err) {
    console.error('[AI] Ministry match error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/ai/newsletter-content (admin)
router.post('/newsletter-content', authenticate, requireAdmin, async (req, res) => {
  try {
    const { blogs, events, customMessage } = req.body
    const content = await generateNewsletterContent(blogs || [], events || [], customMessage || '')
    if (!content) return res.status(503).json({ error: 'Content generation failed. Please try again.' })
    res.json({ content })
  } catch (err) {
    console.error('[AI] Newsletter content error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router