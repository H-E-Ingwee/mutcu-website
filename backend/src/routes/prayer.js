const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { sendPrayerNotification } = require('../lib/email')
const { createNotification } = require('./notifications')
const { generatePrayerEncouragement } = require('../lib/gemini')

// POST /api/prayer — submit prayer request (public)
router.post('/', async (req, res) => {
  try {
    const { name, request, is_public = false } = req.body
    if (!request?.trim()) return res.status(400).json({ error: 'Prayer request is required' })

    const { data, error } = await supabase.from('website_prayer_requests').insert({
      name: name?.trim() || null,
      request: request.trim(),
      is_public,
      updated_at: new Date().toISOString(),
    }).select().single()
    if (error) throw error

    // Notify admin (fire and forget)
    sendPrayerNotification({ name: name || 'Anonymous', request: request.trim() }).catch(() => {})
    createNotification({ type: 'prayer', title: `New prayer request from ${name || 'Anonymous'}`, body: request.trim().slice(0, 100), link: '/admin/prayer' }).catch(() => {})

    // Generate encouragement with 8s timeout
    let encouragement = null
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
      encouragement = await Promise.race([generatePrayerEncouragement(request.trim(), name?.trim()), timeoutPromise])
    } catch (aiErr) {
      console.log('[PRAYER] Encouragement skipped:', aiErr.message)
    }

    const fallback = "Thank you for sharing your heart with us. Our Prayer Ministry will be interceding for you. \"Cast all your anxiety on him because he cares for you.\" (1 Peter 5:7). May God's peace, which surpasses all understanding, guard your heart and mind in Christ Jesus. Amen."

    res.status(201).json({
      message: 'Prayer request submitted. Our Prayer Ministry will intercede for you.',
      id: data.id,
      encouragement: encouragement || fallback,
      fallback: !encouragement,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/prayer — admin: all requests
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query
    let query = supabase.from('website_prayer_requests').select('*').order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw error
    res.json({ requests: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/prayer/:id/status (admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const { data, error } = await supabase.from('website_prayer_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ request: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /api/prayer/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_prayer_requests').delete().eq('id', req.params.id)
    res.json({ message: 'Prayer request deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/prayer/forward — admin: forward selected requests to prayer coordinator
router.post('/forward', authenticate, requireAdmin, async (req, res) => {
  try {
    const { ids, coordinatorEmail, message } = req.body
    if (!ids?.length) return res.status(400).json({ error: 'No prayer requests selected' })
    if (!coordinatorEmail?.trim()) return res.status(400).json({ error: 'Coordinator email is required' })

    const { data, error } = await supabase
      .from('website_prayer_requests')
      .select('*')
      .in('id', ids)
    if (error) throw error

    const { sendEmail } = require('../lib/email')
    const requestRows = (data || []).map((r, i) =>
      `<tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
        <td style="padding:10px 12px;font-size:13px;color:#374151;border-bottom:1px solid #e5e7eb">${r.name || 'Anonymous'}</td>
        <td style="padding:10px 12px;font-size:13px;color:#374151;border-bottom:1px solid #e5e7eb">${r.request}</td>
        <td style="padding:10px 12px;font-size:12px;color:#9CA3AF;border-bottom:1px solid #e5e7eb">${new Date(r.created_at).toLocaleDateString('en-GB')}</td>
      </tr>`
    ).join('')

    await sendEmail({
      to: coordinatorEmail.trim(),
      subject: `MUTCU Prayer Ministry — ${data.length} Prayer Request${data.length !== 1 ? 's' : ''} for Intercession`,
      replyTo: process.env.ADMIN_EMAIL || 'mutcunion@gmail.com',
      html: `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:28px 32px">
          <h2 style="color:#FF9700;margin:0;font-size:18px">MUTCU Prayer Ministry</h2>
          <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">Prayer Requests for Intercession</p>
        </div>
        <div style="padding:24px 32px;background:#fff">
          ${message ? `<div style="background:#fff8ed;border-left:4px solid #FF9700;padding:12px 16px;border-radius:4px;margin-bottom:20px;font-size:14px;color:#374151">${message}</div>` : ''}
          <p style="font-size:14px;color:#374151;margin:0 0 16px">The following <strong>${data.length}</strong> prayer request${data.length !== 1 ? 's' : ''} have been forwarded for intercession:</p>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#04003D">
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:#FF9700;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Name</th>
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:#FF9700;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Prayer Request</th>
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:#FF9700;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Date</th>
              </tr>
            </thead>
            <tbody>${requestRows}</tbody>
          </table>
          <p style="font-size:12px;color:#9CA3AF;margin:20px 0 0">Please treat all prayer requests with strict confidentiality. — MUTCU Admin</p>
        </div>
        <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
          MUTCU · mutcu.org · Inspire Love, Hope &amp; Godliness
        </div>
      </div>`,
    })

    // Mark forwarded requests as prayed_for
    await supabase.from('website_prayer_requests')
      .update({ status: 'prayed_for', updated_at: new Date().toISOString() })
      .in('id', ids)

    res.json({ message: `${data.length} prayer request${data.length !== 1 ? 's' : ''} forwarded to ${coordinatorEmail.trim()}` })
  } catch (err) {
    console.error('[PRAYER FORWARD]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/prayer/digest — admin: weekly digest of pending requests
router.get('/digest', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_prayer_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (error) throw error

    const total = data?.length || 0
    const publicCount = data?.filter(r => r.is_public).length || 0
    const privateCount = total - publicCount

    res.json({
      requests: data || [],
      total,
      publicCount,
      privateCount,
      generatedAt: new Date().toISOString(),
    })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router