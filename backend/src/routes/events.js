const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/events — public, paginated, filterable
router.get('/', async (req, res) => {
  try {
    const { type, upcoming, featured, limit = 20, page = 1 } = req.query;
    let query = supabase.from('website_events').select('*').eq('is_active', true);

    if (type) query = query.eq('service_type', type.toUpperCase());
    if (featured === 'true') query = query.eq('is_featured', true);
    if (upcoming === 'true') query = query.gte('date', new Date().toISOString().split('T')[0]);

    query = query.order('date', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ events: data || [], total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/featured — featured events for homepage
router.get('/featured', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_events')
      .select('*').eq('is_active', true).eq('is_featured', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true }).limit(6);
    if (error) throw error;
    res.json({ events: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_events')
      .select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: 'Event not found' });
    res.json({ event: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_events')
      .insert({ ...req.body, updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    res.status(201).json({ event: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/events/:id (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_events')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ event: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_events').delete().eq('id', req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;