const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate } = require('../middleware/auth')

// ─── GET /api/notifications — list recent notifications ───────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 20 } = req.query
    const { data, error } = await supabase
      .from('website_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))
    if (error) throw error
    const unread = (data || []).filter(n => !n.is_read).length
    res.json({ notifications: data || [], unread })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/notifications/count — unread count only ────────────────────────
router.get('/count', authenticate, async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('website_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
    if (error) throw error
    res.json({ unread: count || 0 })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── PUT /api/notifications/read-all — mark all as read ──────────────────────
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await supabase
      .from('website_notifications')
      .update({ is_read: true })
      .eq('is_read', false)
    res.json({ message: 'All notifications marked as read' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── PUT /api/notifications/:id/read — mark one as read ──────────────────────
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await supabase
      .from('website_notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
    res.json({ message: 'Notification marked as read' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── DELETE /api/notifications/clear — delete all read notifications ──────────
router.delete('/clear', authenticate, async (req, res) => {
  try {
    await supabase.from('website_notifications').delete().eq('is_read', true)
    res.json({ message: 'Read notifications cleared' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router

// ─── Helper: create a notification (used by other routes) ────────────────────
async function createNotification({ type, title, body, link }) {
  try {
    await supabase.from('website_notifications').insert({
      type,
      title,
      body: body || null,
      link: link || null,
      is_read: false,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[NOTIFICATION]', err.message)
  }
}

module.exports.createNotification = createNotification