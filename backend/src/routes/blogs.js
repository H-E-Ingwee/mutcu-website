const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const { tag, limit = 12, page = 1 } = req.query
    let query = supabase.from('website_blogs').select('id,title,slug,excerpt,featured_image,author,tags,published_at,created_at')
      .eq('status', 'published').order('published_at', { ascending: false })
    if (tag) query = query.ilike('tags', `%${tag}%`)
    query = query.range((page - 1) * limit, page * limit - 1)
    const { data, error } = await query
    if (error) throw error
    res.json({ blogs: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_blogs').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ blogs: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_blogs')
      .select('*').eq('slug', req.params.slug).eq('status', 'published').single()
    if (error || !data) return res.status(404).json({ error: 'Blog not found' })
    res.json({ blog: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const body = { ...req.body, updated_at: new Date().toISOString() }
    if (body.status === 'published' && !body.published_at) body.published_at = new Date().toISOString()
    if (!body.slug && body.title) body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const { data, error } = await supabase.from('website_blogs').insert(body).select().single()
    if (error) throw error
    res.status(201).json({ blog: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const body = { ...req.body, updated_at: new Date().toISOString() }
    if (body.status === 'published' && !body.published_at) body.published_at = new Date().toISOString()
    const { data, error } = await supabase.from('website_blogs').update(body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ blog: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_blogs').delete().eq('id', req.params.id)
    res.json({ message: 'Blog deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router