const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { uploadImage } = require('../lib/cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Only PDF, Word, and Excel files are allowed'))
  }
});

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

// POST /api/resources/upload — upload document from device (admin)
router.post('/upload', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' })

    const ext = path.extname(req.file.originalname).toLowerCase()
    const typeMap = { '.pdf': 'PDF', '.doc': 'DOCUMENT', '.docx': 'DOCUMENT', '.xls': 'DOCUMENT', '.xlsx': 'DOCUMENT' }
    const fileType = typeMap[ext] || 'DOCUMENT'

    // Upload to Cloudinary as raw file
    const { cloudinary } = require('../lib/cloudinary')
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mutcu-website/documents',
      resource_type: 'raw',
      public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
    })

    fs.unlink(req.file.path, () => {})

    const title = req.body.title || req.file.originalname.replace(/\.[^.]+$/, '')
    const { data, error } = await supabase.from('website_resources').insert({
      title,
      url: result.secure_url,
      type: fileType,
      category: req.body.category || 'other',
      description: req.body.description || null,
      is_active: true,
      display_order: 0,
      updated_at: new Date().toISOString(),
    }).select().single()

    if (error) throw error
    res.status(201).json({ resource: data, url: result.secure_url })
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {})
    res.status(500).json({ error: err.message })
  }
})

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