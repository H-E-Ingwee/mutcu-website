const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { cloudinary } = require('../lib/cloudinary')
const multer = require('multer')
const fs = require('fs')

const upload = multer({ dest: '/tmp/uploads/', limits: { fileSize: 10 * 1024 * 1024 } })

router.get('/', async (req, res) => {
  try {
    const { category, limit = 100 } = req.query
    let query = supabase.from('website_gallery').select('*').eq('is_active', true).order('display_order').limit(limit)
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) throw error
    res.json({ gallery: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/categories', async (req, res) => {
  try {
    const { data } = await supabase.from('website_gallery').select('category').eq('is_active', true)
    const cats = [...new Set((data || []).map(r => r.category).filter(Boolean))]
    res.json({ categories: cats })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/gallery/upload — upload image from device
router.post('/upload', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' })

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mutcu-website/gallery',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })
    fs.unlink(req.file.path, () => {})

    const { data, error } = await supabase.from('website_gallery').insert({
      title: req.body.title || null,
      description: req.body.description || null,
      image_url: result.secure_url,
      cloudinary_public_id: result.public_id,
      category: req.body.category || 'general',
      display_order: parseInt(req.body.display_order) || 0,
      is_active: true,
      updated_at: new Date().toISOString(),
    }).select().single()
    if (error) throw error
    res.status(201).json({ item: data })
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {})
    console.error('[GALLERY UPLOAD]', err.message)
    res.status(500).json({ error: err.message })
  }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_gallery')
      .insert({ ...req.body, updated_at: new Date().toISOString() }).select().single()
    if (error) throw error
    res.status(201).json({ item: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_gallery')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ item: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase.from('website_gallery').select('cloudinary_public_id').eq('id', req.params.id).single()
    if (data?.cloudinary_public_id) await cloudinary.uploader.destroy(data.cloudinary_public_id).catch(() => {})
    await supabase.from('website_gallery').delete().eq('id', req.params.id)
    res.json({ message: 'Gallery item deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router