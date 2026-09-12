const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/settings — public (for frontend to read site config)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_settings').select('key,value,category').order('category');
    if (error) throw error;
    // Convert to key-value object
    const settings = {}
    ;(data || []).forEach(s => { settings[s.key] = s.value })
    res.json({ settings, raw: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/settings/:key — single setting
router.get('/:key', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_settings').select('*').eq('key', req.params.key).single()
    if (error || !data) return res.status(404).json({ error: 'Setting not found' })
    res.json({ setting: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/settings — bulk update (admin)
router.put('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const updates = req.body // { key: value, ... }
    const rows = Object.entries(updates).map(([key, value]) => ({
      key, value: String(value), updated_at: new Date().toISOString()
    }))
    const { error } = await supabase.from('website_settings')
      .upsert(rows, { onConflict: 'key' })
    if (error) throw error
    res.json({ message: 'Settings updated successfully' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/settings/:key — single setting update (admin)
router.put('/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const { value } = req.body
    const { data, error } = await supabase.from('website_settings')
      .upsert({ key: req.params.key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .select().single()
    if (error) throw error
    res.json({ setting: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router