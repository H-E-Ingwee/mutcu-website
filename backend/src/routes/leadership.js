const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/leadership — current EC from website_leadership table
// Falls back to reading from DMS appointments table if website_leadership is empty
router.get('/', async (req, res) => {
  try {
    const { spiritual_year } = req.query;

    // First try website_leadership table
    let query = supabase.from('website_leadership')
      .select('*')
      .eq('is_active', true)
      .eq('is_patron', false)
      .order('display_order');

    if (spiritual_year) query = query.eq('spiritual_year', spiritual_year);

    const { data: websiteLeaders, error } = await query;

    if (!error && websiteLeaders && websiteLeaders.length > 0) {
      return res.json({ leadership: websiteLeaders, source: 'website' });
    }

    // Fallback: read from DMS appointments + users + positions
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*, user:user_id(id,name,photo_url,email,primary_ministry), position:position_id(id,title,display_order)')
      .eq('is_current', true)
      .order('position_id');

    if (appointments && appointments.length > 0) {
      const leadership = appointments.map(a => ({
        id: a.id,
        dms_user_id: a.user_id,
        name: a.user?.name || '',
        role: a.position?.title || '',
        photo_url: a.user?.photo_url || null,
        display_order: a.position?.display_order || 0,
        source: 'dms',
      }));
      return res.json({ leadership, source: 'dms' });
    }

    res.json({ leadership: [], source: 'none' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leadership/patrons
router.get('/patrons', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_leadership')
      .select('*').eq('is_patron', true).eq('is_active', true).order('display_order');
    if (error) throw error;
    res.json({ patrons: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leadership/role/:slug — single leader by role slug
router.get('/role/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_leadership')
      .select('*').eq('role_slug', req.params.slug).eq('is_active', true).single();
    if (error || !data) return res.status(404).json({ error: 'Leader not found' });
    res.json({ leader: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leadership/years — available spiritual years
router.get('/years', async (req, res) => {
  try {
    const { data } = await supabase.from('website_leadership')
      .select('spiritual_year').not('spiritual_year', 'is', null);
    const years = [...new Set((data || []).map(r => r.spiritual_year).filter(Boolean))].sort().reverse();
    res.json({ years });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leadership — create leader (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_leadership').insert({
      ...req.body, updated_at: new Date().toISOString()
    }).select().single();
    if (error) throw error;
    res.status(201).json({ leader: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/leadership/:id — update leader (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_leadership')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ leader: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leadership/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_leadership').delete().eq('id', req.params.id);
    res.json({ message: 'Leader deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;