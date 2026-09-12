const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendPrayerNotification } = require('../lib/email');
const { generatePrayerEncouragement } = require('../lib/gemini');

// POST /api/prayer — submit prayer request (public)
router.post('/', async (req, res) => {
  try {
    const { name, request, is_public = false } = req.body;
    if (!request?.trim()) return res.status(400).json({ error: 'Prayer request is required' });

    const { data, error } = await supabase.from('website_prayer_requests').insert({
      name: name?.trim() || null,
      request: request.trim(),
      is_public,
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;

    // Notify admin (fire and forget)
    sendPrayerNotification({ name: name || 'Anonymous', request: request.trim() }).catch(() => {});

    // Generate AI encouragement (non-blocking)
    let encouragement = null
    try {
      encouragement = await generatePrayerEncouragement(request.trim(), name?.trim())
    } catch {}

    res.status(201).json({
      message: 'Prayer request submitted. Our Prayer Ministry will intercede for you.',
      id: data.id,
      encouragement: encouragement || "Thank you for sharing your heart with us. Our Prayer Ministry will be interceding for you. \"Cast all your anxiety on him because he cares for you.\" (1 Peter 5:7). May God's peace guard your heart and mind in Christ Jesus.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prayer — admin: all requests
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('website_prayer_requests').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ requests: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/prayer/:id/status (admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('website_prayer_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ request: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/prayer/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_prayer_requests').delete().eq('id', req.params.id);
    res.json({ message: 'Prayer request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;