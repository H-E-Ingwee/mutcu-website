const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/ministries — public
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_ministries')
      .select('*').eq('is_active', true).order('display_order');
    if (error) throw error;
    res.json({ ministries: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ministries/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_ministries')
      .select('*').eq('slug', req.params.slug).single();
    if (error || !data) return res.status(404).json({ error: 'Ministry not found' });
    res.json({ ministry: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ministries (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_ministries')
      .insert({ ...req.body, updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    res.status(201).json({ ministry: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/ministries/:id (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_ministries')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ ministry: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/ministries/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_ministries').delete().eq('id', req.params.id);
    res.json({ message: 'Ministry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;