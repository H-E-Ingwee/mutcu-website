const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../lib/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: '/tmp/uploads/' });

// GET /api/gallery — public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    let query = supabase.from('website_gallery').select('*').eq('is_active', true).order('display_order').limit(limit);
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ gallery: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gallery/categories
router.get('/categories', async (req, res) => {
  try {
    const { data } = await supabase.from('website_gallery').select('category').eq('is_active', true);
    const cats = [...new Set((data || []).map(r => r.category).filter(Boolean))];
    res.json({ categories: cats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gallery/upload (admin) — upload image to Cloudinary
router.post('/upload', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });
    const { url, publicId } = await uploadImage(req.file.path, 'mutcu-website/gallery');
    // Clean up temp file
    fs.unlink(req.file.path, () => {});
    const { data, error } = await supabase.from('website_gallery').insert({
      title: req.body.title || null,
      description: req.body.description || null,
      image_url: url,
      cloudinary_public_id: publicId,
      category: req.body.category || 'general',
      display_order: parseInt(req.body.display_order) || 0,
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;
    res.status(201).json({ item: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gallery — add by URL (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_gallery')
      .insert({ ...req.body, updated_at: new Date().toISOString() }).select().single();
    if (error) throw error;
    res.status(201).json({ item: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/gallery/:id (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_gallery')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ item: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/gallery/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase.from('website_gallery').select('cloudinary_public_id').eq('id', req.params.id).single();
    if (data?.cloudinary_public_id) {
      await deleteImage(data.cloudinary_public_id).catch(() => {});
    }
    await supabase.from('website_gallery').delete().eq('id', req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;