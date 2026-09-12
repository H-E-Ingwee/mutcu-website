const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/resources — public
router.get('/', async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = supabase.from('website_resources').select('*').eq('is_active', true).order('display_order');
    if (category) query = query.eq('category', category);
    if (type) query = query.eq('type', type.toUpperCase());
    const { data, error } = await query;
    if (error) throw error;
    res.json({ resources: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resources (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_resources')
      .insert({ ...req.body, updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    res.status(201).json({ resource: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/resources/:id (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_resources')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ resource: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/resources/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_resources').delete().eq('id', req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;