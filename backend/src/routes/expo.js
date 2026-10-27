const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { sendEmail } = require('../lib/email')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[\+\d\s\-\(\)]{7,20}$/

// ─── Email helper with timeout + status return ────────────────────────────────
async function sendExpoEmail(opts) {
  try {
    const result = await Promise.race([
      sendEmail(opts),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Email timeout after 8s')), 8000)),
    ])
    return { sent: true, result }
  } catch (err) {
    console.error('[EXPO EMAIL FAILED]', err.message)
    return { sent: false, error: err.message }
  }
}

function buildConfirmationHtml({ full_name, participation_type, business_name }) {
  const isPitcher = participation_type === 'pitcher'
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:36px 32px;text-align:center">
        <div style="font-size:28px;margin-bottom:8px">🏆</div>
        <h1 style="color:#FF9700;margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px">MUTCU Business Exposition 2027</h1>
        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">Beyond Ideas: Blueprint of a CEO</p>
      </div>
      <div style="padding:32px;background:#fff">
        <p style="font-size:18px;color:#04003D;font-weight:900;margin:0 0 8px">Hi ${full_name}! 👋</p>
        <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px">
          ${isPitcher
            ? `Your application to <strong style="color:#FF9700">Founder's Arena</strong> has been received! You're officially on your way to the pitch stage. Our team will be in touch with next steps for Stage 01 — The Call.`
            : `Your registration as an <strong style="color:#04003D">Attendee</strong> for the MUTCU Business Exposition 2027 is <strong style="color:#16A34A">confirmed!</strong> We can't wait to see you on the day.`
          }
        </p>
        <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:0 0 20px;border-left:4px solid #FF9700">
          <p style="margin:0 0 12px;font-size:11px;color:#9CA3AF;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">Event Details</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:4px 0;font-size:13px;color:#6B7280;width:100px">📅 Date</td><td style="padding:4px 0;font-size:13px;color:#1a1a2e;font-weight:600">Saturday, 13 March 2027</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:#6B7280">⏰ Time</td><td style="padding:4px 0;font-size:13px;color:#1a1a2e;font-weight:600">8:00 AM – 4:00 PM</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:#6B7280">📍 Venue</td><td style="padding:4px 0;font-size:13px;color:#1a1a2e;font-weight:600">Murang'a University of Technology</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:#6B7280">🎯 Theme</td><td style="padding:4px 0;font-size:13px;color:#FF9700;font-weight:700">Beyond Ideas: Blueprint of a CEO</td></tr>
            ${isPitcher ? `<tr><td style="padding:4px 0;font-size:13px;color:#6B7280">🏆 Prize</td><td style="padding:4px 0;font-size:13px;color:#1a1a2e;font-weight:600">KSh 100,000 Prize Pool</td></tr>` : ''}
          </table>
        </div>
        ${isPitcher ? `
        <div style="background:#fff8ed;border-radius:12px;padding:16px;margin:0 0 20px;border:1px solid rgba(255,151,0,0.3)">
          <p style="margin:0 0 8px;font-size:12px;color:#FF9700;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">🔥 Your Founder's Arena Journey</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${['Stage 01: The Call','Stage 02: The Den','Stage 03: Blueprint Training','Stage 04: Pitch Showcase'].map((s,i) => `
              <span style="background:${i===0?'#FF9700':'#f3f4f6'};color:${i===0?'#fff':'#6B7280'};padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600">${s}</span>
            `).join('')}
          </div>
          ${business_name ? `<p style="margin:12px 0 0;font-size:13px;color:#374151">Business: <strong>${business_name}</strong></p>` : ''}
        </div>` : ''}
        <p style="color:#374151;font-size:13px;line-height:1.7;margin:0 0 16px">
          Follow us for updates and announcements: <strong>@muranga_university_cu</strong> on Instagram, TikTok, and Facebook.
        </p>
        <p style="color:#374151;font-size:13px;line-height:1.7;margin:0">
          Questions? Email <a href="mailto:mutcunion@gmail.com" style="color:#FF9700;text-decoration:none">mutcunion@gmail.com</a> or call <a href="tel:+254757930723" style="color:#FF9700;text-decoration:none">+254 757 930723</a>.
        </p>
      </div>
      <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:16px 32px;text-align:center">
        <a href="https://mutcu.org/business-expo" style="color:#FF9700;font-size:12px;text-decoration:none;font-weight:600">mutcu.org/business-expo</a>
        <span style="color:rgba(255,255,255,0.3);margin:0 8px">·</span>
        <span style="color:rgba(255,255,255,0.4);font-size:11px">Inspire Love, Hope &amp; Godliness</span>
      </div>
    </div>`
}

// ─── POST /api/expo/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      full_name, email, phone, participation_type,
      course, year_of_study, business_name, business_stage,
      business_description, support_needed, how_heard, message,
    } = req.body

    if (!full_name?.trim()) return res.status(400).json({ error: 'Full name is required' })
    if (!email?.trim() || !emailRegex.test(email.trim())) return res.status(400).json({ error: 'A valid email address is required' })
    if (!phone?.trim() || !phoneRegex.test(phone.trim())) return res.status(400).json({ error: 'A valid phone number is required' })
    if (!participation_type || !['attendee', 'pitcher'].includes(participation_type)) {
      return res.status(400).json({ error: 'Participation type must be Attendee or Pitcher' })
    }
    if (participation_type === 'pitcher' && !business_name?.trim()) {
      return res.status(400).json({ error: 'Business name is required for pitchers' })
    }

    const { data: existing } = await supabase
      .from('expo_registrations')
      .select('id, participation_type')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existing) {
      return res.status(409).json({
        error: `You are already registered as a${existing.participation_type === 'attendee' ? 'n attendee' : ' pitcher'}. Check your email for your confirmation.`,
        duplicate: true,
      })
    }

    const { data, error } = await supabase
      .from('expo_registrations')
      .insert({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        participation_type,
        course: course?.trim() || null,
        year_of_study: year_of_study || null,
        business_name: participation_type === 'pitcher' ? business_name?.trim() : null,
        business_stage: participation_type === 'pitcher' ? (business_stage || null) : null,
        business_description: participation_type === 'pitcher' ? (business_description?.trim() || null) : null,
        support_needed: participation_type === 'pitcher' ? (support_needed || null) : null,
        how_heard: how_heard || null,
        message: message?.trim() || null,
        status: 'confirmed',
        registered_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    const isPitcher = participation_type === 'pitcher'

    // Send confirmation email — with timeout, report status back
    const emailResult = await sendExpoEmail({
      to: email.trim(),
      subject: `You're registered! MUTCU Business Exposition 2027 — ${isPitcher ? "Founder's Arena" : 'Attendee Confirmed'}`,
      replyTo: process.env.ADMIN_EMAIL || 'mutcunion@gmail.com',
      html: buildConfirmationHtml({ full_name: full_name.trim(), participation_type, business_name: business_name?.trim() }),
    })

    // Admin notification (fire and forget)
    const adminEmail = process.env.ADMIN_EMAIL || 'mutcunion@gmail.com'
    sendExpoEmail({
      to: adminEmail,
      subject: `[MUTCU Expo 2027] New ${isPitcher ? 'Pitcher' : 'Attendee'} — ${full_name.trim()}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
          <h2 style="color:#FF9700;margin:0;font-size:16px">New Expo Registration — ${isPitcher ? "Pitcher (Founder's Arena)" : 'Attendee'}</h2>
        </div>
        <div style="padding:24px 32px;background:#fff">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="padding:6px 0;color:#6B7280;width:140px">Name</td><td style="padding:6px 0;color:#1a1a2e;font-weight:bold">${full_name.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280">Email</td><td style="padding:6px 0;color:#1a1a2e">${email.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280">Phone</td><td style="padding:6px 0;color:#1a1a2e">${phone.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280">Type</td><td style="padding:6px 0;color:#FF9700;font-weight:bold">${isPitcher ? "Pitcher — Founder's Arena" : 'Attendee'}</td></tr>
            ${course ? `<tr><td style="padding:6px 0;color:#6B7280">Course</td><td style="padding:6px 0;color:#1a1a2e">${course}</td></tr>` : ''}
            ${year_of_study ? `<tr><td style="padding:6px 0;color:#6B7280">Year</td><td style="padding:6px 0;color:#1a1a2e">${year_of_study}</td></tr>` : ''}
            ${isPitcher && business_name ? `<tr><td style="padding:6px 0;color:#6B7280">Business</td><td style="padding:6px 0;color:#1a1a2e">${business_name}</td></tr>` : ''}
            ${isPitcher && business_stage ? `<tr><td style="padding:6px 0;color:#6B7280">Stage</td><td style="padding:6px 0;color:#1a1a2e">${business_stage}</td></tr>` : ''}
            ${isPitcher && business_description ? `<tr><td style="padding:6px 0;color:#6B7280;vertical-align:top">Description</td><td style="padding:6px 0;color:#1a1a2e">${business_description}</td></tr>` : ''}
            ${isPitcher && support_needed ? `<tr><td style="padding:6px 0;color:#6B7280">Support needed</td><td style="padding:6px 0;color:#1a1a2e">${Array.isArray(support_needed) ? support_needed.join(', ') : support_needed}</td></tr>` : ''}
            ${how_heard ? `<tr><td style="padding:6px 0;color:#6B7280">How heard</td><td style="padding:6px 0;color:#1a1a2e">${how_heard}</td></tr>` : ''}
            ${message ? `<tr><td style="padding:6px 0;color:#6B7280;vertical-align:top">Message</td><td style="padding:6px 0;color:#1a1a2e">${message}</td></tr>` : ''}
          </table>
        </div>
        <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
          View all at <a href="https://mutcu.org/admin/expo-registrations" style="color:#FF9700">Admin Dashboard</a>
        </div>
      </div>`,
    })

    res.status(201).json({
      message: isPitcher
        ? "You're in! Your Founder's Arena application has been received. Check your email for confirmation and next steps."
        : "You're registered! Check your email for your confirmation details. See you on 13 March 2027!",
      id: data.id,
      participation_type,
      emailSent: emailResult.sent,
      emailNote: emailResult.sent ? null : 'Confirmation email could not be sent right now. Please check your spam folder or contact mutcunion@gmail.com.',
    })
  } catch (err) {
    console.error('[EXPO REGISTER]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/expo/resend-email — admin: resend confirmation ─────────────────
router.post('/resend-email/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expo_registrations')
      .select('*')
      .eq('id', req.params.id)
      .single()
    if (error || !data) return res.status(404).json({ error: 'Registration not found' })

    const result = await sendExpoEmail({
      to: data.email,
      subject: `[Resent] MUTCU Business Exposition 2027 — ${data.participation_type === 'pitcher' ? "Founder's Arena" : 'Attendee'} Confirmation`,
      replyTo: process.env.ADMIN_EMAIL || 'mutcunion@gmail.com',
      html: buildConfirmationHtml({ full_name: data.full_name, participation_type: data.participation_type, business_name: data.business_name }),
    })

    if (!result.sent) return res.status(500).json({ error: `Email failed: ${result.error}` })
    res.json({ message: `Confirmation email resent to ${data.email}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/expo/test-email — admin: test Brevo config ────────────────────
router.post('/test-email', authenticate, requireAdmin, async (req, res) => {
  try {
    const to = req.body.email || req.user.email
    if (!to) return res.status(400).json({ error: 'No email address provided' })

    const result = await sendExpoEmail({
      to,
      subject: 'MUTCU Expo Email Test ✓',
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
          <h2 style="color:#FF9700;margin:0">MUTCU Expo — Email Test</h2>
        </div>
        <div style="padding:24px 32px;background:#fff">
          <p style="font-size:16px;color:#1a1a2e">✅ Your Brevo email configuration is working correctly!</p>
          <p style="color:#6B7280;font-size:13px">Sent by: <strong>${req.user.name}</strong> at ${new Date().toLocaleString('en-GB')}</p>
          <p style="color:#6B7280;font-size:13px">Sent to: ${to}</p>
        </div>
        <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
          MUTCU Business Exposition 2027 · mutcu.org/business-expo
        </div>
      </div>`,
    })

    if (!result.sent) return res.status(500).json({ error: `Email failed: ${result.error}. Check BREVO_API_KEY on Render.` })
    res.json({ message: `Test email sent successfully to ${to}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/expo/registrations ─────────────────────────────────────────────
router.get('/registrations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { type, status, search } = req.query
    let query = supabase.from('expo_registrations').select('*').order('registered_at', { ascending: false })
    if (type) query = query.eq('participation_type', type)
    if (status) query = query.eq('status', status)
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,business_name.ilike.%${search}%`)
    const { data, error } = await query
    if (error) throw error
    const attendees = (data || []).filter(r => r.participation_type === 'attendee').length
    const pitchers = (data || []).filter(r => r.participation_type === 'pitcher').length
    res.json({ registrations: data || [], total: data?.length || 0, attendees, pitchers })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/expo/stats ──────────────────────────────────────────────────────
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('expo_registrations').select('participation_type, status, registered_at')
    if (error) throw error
    const total = data?.length || 0
    const attendees = data?.filter(r => r.participation_type === 'attendee').length || 0
    const pitchers = data?.filter(r => r.participation_type === 'pitcher').length || 0
    const confirmed = data?.filter(r => r.status === 'confirmed').length || 0
    const now = new Date()
    const daily = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i)
      daily[d.toISOString().split('T')[0]] = 0
    }
    data?.forEach(r => { const day = r.registered_at?.split('T')[0]; if (day && daily[day] !== undefined) daily[day]++ })
    res.json({ total, attendees, pitchers, confirmed, daily })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── PUT /api/expo/registrations/:id/status ───────────────────────────────────
router.put('/registrations/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    if (!['confirmed','waitlisted','cancelled','attended'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
    const { data, error } = await supabase.from('expo_registrations')
      .update({ status, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ registration: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── DELETE /api/expo/registrations/:id ──────────────────────────────────────
router.delete('/registrations/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('expo_registrations').delete().eq('id', req.params.id)
    res.json({ message: 'Registration deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/expo/settings — public ─────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('expo_settings').select('key,value,label,category')
    if (error) throw error
    const settings = {}
    ;(data || []).forEach(s => { settings[s.key] = s.value })
    res.json({ settings, raw: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── PUT /api/expo/settings — admin ──────────────────────────────────────────
router.put('/settings', authenticate, requireAdmin, async (req, res) => {
  try {
    const rows = Object.entries(req.body).map(([key, value]) => ({
      key, value: String(value), updated_at: new Date().toISOString()
    }))
    const { error } = await supabase.from('expo_settings').upsert(rows, { onConflict: 'key' })
    if (error) throw error
    res.json({ message: 'Expo settings updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/expo/export/excel ───────────────────────────────────────────────
router.get('/export/excel', authenticate, requireAdmin, async (req, res) => {
  try {
    const { type } = req.query
    let query = supabase.from('expo_registrations').select('*').order('registered_at', { ascending: false })
    if (type) query = query.eq('participation_type', type)
    const { data, error } = await query
    if (error) throw error

    const ExcelJS = require('exceljs')
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'MUTCU Website'
    workbook.created = new Date()

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
    const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' }
    const orangeFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9700' } }

    // Sheet 1: All
    const sheet = workbook.addWorksheet('All Registrations', { pageSetup: { paperSize: 9, orientation: 'landscape' } })
    sheet.columns = [
      { header: '#', key: 'num', width: 5 },
      { header: 'Full Name', key: 'full_name', width: 22 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Type', key: 'participation_type', width: 12 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Year', key: 'year_of_study', width: 8 },
      { header: 'Business Name', key: 'business_name', width: 22 },
      { header: 'Business Stage', key: 'business_stage', width: 18 },
      { header: 'Business Description', key: 'business_description', width: 30 },
      { header: 'Support Needed', key: 'support_needed', width: 25 },
      { header: 'How Heard', key: 'how_heard', width: 18 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registered At', key: 'registered_at', width: 20 },
    ]
    sheet.getRow(1).eachCell(cell => { cell.fill = headerFill; cell.font = headerFont; cell.alignment = { vertical: 'middle', horizontal: 'center' }; cell.border = { bottom: { style: 'medium', color: { argb: 'FFFF9700' } } } })
    sheet.getRow(1).height = 28
    sheet.spliceRows(1, 0, [])
    sheet.mergeCells('A1:N1')
    const titleCell = sheet.getCell('A1')
    titleCell.value = 'MUTCU Business Exposition 2027 — Registrations'
    titleCell.font = { bold: true, size: 14, color: { argb: 'FFFF9700' }, name: 'Calibri' }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(1).height = 36
    sheet.spliceRows(2, 0, [])
    sheet.mergeCells('A2:N2')
    const subCell = sheet.getCell('A2')
    subCell.value = `Exported: ${new Date().toLocaleString('en-GB')} | Total: ${data.length} | Attendees: ${data.filter(r=>r.participation_type==='attendee').length} | Pitchers: ${data.filter(r=>r.participation_type==='pitcher').length}`
    subCell.font = { size: 10, color: { argb: 'FF6B7280' }, name: 'Calibri' }
    subCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(2).height = 20
    ;(data || []).forEach((reg, idx) => {
      const row = sheet.addRow({
        num: idx + 1, full_name: reg.full_name, email: reg.email, phone: reg.phone,
        participation_type: reg.participation_type === 'pitcher' ? 'Pitcher' : 'Attendee',
        course: reg.course || '—', year_of_study: reg.year_of_study || '—',
        business_name: reg.business_name || '—', business_stage: reg.business_stage || '—',
        business_description: reg.business_description || '—',
        support_needed: Array.isArray(reg.support_needed) ? reg.support_needed.join(', ') : (reg.support_needed || '—'),
        how_heard: reg.how_heard || '—', status: reg.status || 'confirmed',
        registered_at: reg.registered_at ? new Date(reg.registered_at).toLocaleString('en-GB') : '—',
      })
      const rowFill = idx % 2 === 0 ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } } : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
      row.eachCell(cell => { cell.fill = rowFill; cell.font = { size: 10, name: 'Calibri' }; cell.alignment = { vertical: 'middle', wrapText: true } })
      const typeCell = row.getCell('participation_type')
      typeCell.font = { bold: true, color: { argb: reg.participation_type === 'pitcher' ? 'FFFF9700' : 'FF04003D' }, size: 10, name: 'Calibri' }
      const statusColors = { confirmed: 'FF16A34A', waitlisted: 'FFD97706', cancelled: 'FFDC2626', attended: 'FF2563EB' }
      row.getCell('status').font = { bold: true, color: { argb: statusColors[reg.status] || 'FF374151' }, size: 10, name: 'Calibri' }
      row.height = 22
    })
    sheet.views = [{ state: 'frozen', ySplit: 3 }]

    // Sheet 2: Pitchers
    const pitcherSheet = workbook.addWorksheet("Founder's Arena — Pitchers")
    const pitchers = (data || []).filter(r => r.participation_type === 'pitcher')
    pitcherSheet.columns = [
      { header: '#', key: 'num', width: 5 }, { header: 'Full Name', key: 'full_name', width: 22 },
      { header: 'Email', key: 'email', width: 28 }, { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Business Name', key: 'business_name', width: 24 }, { header: 'Business Stage', key: 'business_stage', width: 20 },
      { header: 'Business Description', key: 'business_description', width: 35 },
      { header: 'Support Needed', key: 'support_needed', width: 28 },
      { header: 'Course', key: 'course', width: 20 }, { header: 'Year', key: 'year_of_study', width: 8 },
      { header: 'Status', key: 'status', width: 12 }, { header: 'Registered At', key: 'registered_at', width: 20 },
    ]
    pitcherSheet.getRow(1).eachCell(cell => { cell.fill = orangeFill; cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' }; cell.alignment = { vertical: 'middle', horizontal: 'center' } })
    pitcherSheet.getRow(1).height = 28
    pitchers.forEach((reg, idx) => {
      const row = pitcherSheet.addRow({
        num: idx + 1, full_name: reg.full_name, email: reg.email, phone: reg.phone,
        business_name: reg.business_name || '—', business_stage: reg.business_stage || '—',
        business_description: reg.business_description || '—',
        support_needed: Array.isArray(reg.support_needed) ? reg.support_needed.join(', ') : (reg.support_needed || '—'),
        course: reg.course || '—', year_of_study: reg.year_of_study || '—',
        status: reg.status || 'confirmed',
        registered_at: reg.registered_at ? new Date(reg.registered_at).toLocaleString('en-GB') : '—',
      })
      row.eachCell(cell => { cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 0 ? 'FFFFF8ED' : 'FFFFFFFF' } }; cell.font = { size: 10, name: 'Calibri' }; cell.alignment = { vertical: 'middle', wrapText: true } })
      row.height = 22
    })

    // Sheet 3: Summary
    const summarySheet = workbook.addWorksheet('Summary')
    summarySheet.getColumn('A').width = 30; summarySheet.getColumn('B').width = 20
    const summaryData = [
      ['MUTCU Business Exposition 2027', ''], ['Beyond Ideas: Blueprint of a CEO', ''], ['', ''],
      ['Export Date', new Date().toLocaleString('en-GB')], ['', ''], ['REGISTRATION SUMMARY', ''],
      ['Total Registrations', data.length], ['Attendees', data.filter(r=>r.participation_type==='attendee').length],
      ["Pitchers (Founder's Arena)", data.filter(r=>r.participation_type==='pitcher').length],
      ['Confirmed', data.filter(r=>r.status==='confirmed').length],
      ['Attended', data.filter(r=>r.status==='attended').length],
      ['Cancelled', data.filter(r=>r.status==='cancelled').length],
    ]
    summaryData.forEach((rowData, i) => {
      const row = summarySheet.addRow(rowData)
      if (i === 0) { row.getCell(1).font = { bold: true, size: 16, color: { argb: 'FFFF9700' }, name: 'Calibri' }; row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }; summarySheet.mergeCells(`A${i+1}:B${i+1}`); row.height = 32 }
      else if (i === 5) { row.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' }, name: 'Calibri' }; row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }; summarySheet.mergeCells(`A${i+1}:B${i+1}`) }
      else if (i > 5) { row.getCell(1).font = { size: 11, name: 'Calibri' }; row.getCell(2).font = { bold: true, size: 11, color: { argb: 'FFFF9700' }, name: 'Calibri' } }
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="MUTCU-Expo-2027-Registrations-${new Date().toISOString().split('T')[0]}.xlsx"`)
    await workbook.xlsx.write(res)
    res.end()
  } catch (err) { console.error('[EXPO EXCEL]', err.message); res.status(500).json({ error: err.message }) }
})

// ─── GET /api/expo/export/pdf ─────────────────────────────────────────────────
router.get('/export/pdf', authenticate, requireAdmin, async (req, res) => {
  try {
    const { type } = req.query
    let query = supabase.from('expo_registrations').select('*').order('registered_at', { ascending: false })
    if (type) query = query.eq('participation_type', type)
    const { data, error } = await query
    if (error) throw error

    const PDFDocument = require('pdfkit')
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="MUTCU-Expo-2027-Registrations-${new Date().toISOString().split('T')[0]}.pdf"`)
    doc.pipe(res)

    doc.rect(0, 0, doc.page.width, 70).fill('#04003D')
    doc.fontSize(18).fillColor('#FF9700').font('Helvetica-Bold').text('MUTCU Business Exposition 2027', 40, 18)
    doc.fontSize(11).fillColor('rgba(255,255,255,0.7)').font('Helvetica').text("Beyond Ideas: Blueprint of a CEO  ·  Registrations Report", 40, 42)
    doc.fontSize(9).fillColor('rgba(255,255,255,0.5)').text(`Exported: ${new Date().toLocaleString('en-GB')}  ·  Total: ${data.length}  ·  Attendees: ${data.filter(r=>r.participation_type==='attendee').length}  ·  Pitchers: ${data.filter(r=>r.participation_type==='pitcher').length}`, 40, 58)

    const cols = [
      { label: '#', width: 28, key: 'num' }, { label: 'Full Name', width: 110, key: 'full_name' },
      { label: 'Email', width: 145, key: 'email' }, { label: 'Phone', width: 85, key: 'phone' },
      { label: 'Type', width: 60, key: 'participation_type' }, { label: 'Business', width: 100, key: 'business_name' },
      { label: 'Status', width: 60, key: 'status' }, { label: 'Registered', width: 95, key: 'registered_at' },
    ]
    const tableTop = 85; const rowHeight = 22; const startX = 40
    const totalWidth = cols.reduce((s, c) => s + c.width, 0)

    doc.rect(startX, tableTop, totalWidth, rowHeight).fill('#04003D')
    let x = startX
    cols.forEach(col => { doc.fontSize(8).fillColor('#FF9700').font('Helvetica-Bold').text(col.label, x + 4, tableTop + 7, { width: col.width - 8, ellipsis: true }); x += col.width })

    let currentY = tableTop + rowHeight
    ;(data || []).forEach((reg, idx) => {
      if (currentY + rowHeight > doc.page.height - 50) {
        doc.addPage({ layout: 'landscape' })
        currentY = 40
        doc.rect(startX, currentY, totalWidth, rowHeight).fill('#04003D')
        let hx = startX
        cols.forEach(col => { doc.fontSize(8).fillColor('#FF9700').font('Helvetica-Bold').text(col.label, hx + 4, currentY + 7, { width: col.width - 8, ellipsis: true }); hx += col.width })
        currentY += rowHeight
      }
      if (idx % 2 === 0) doc.rect(startX, currentY, totalWidth, rowHeight).fill('#F9FAFB')
      let cx = startX
      cols.forEach(col => {
        let val = ''
        if (col.key === 'num') val = String(idx + 1)
        else if (col.key === 'participation_type') val = reg.participation_type === 'pitcher' ? 'Pitcher' : 'Attendee'
        else if (col.key === 'business_name') val = reg.business_name || '—'
        else if (col.key === 'registered_at') val = reg.registered_at ? new Date(reg.registered_at).toLocaleDateString('en-GB') : '—'
        else val = reg[col.key] || '—'
        const color = col.key === 'participation_type' && reg.participation_type === 'pitcher' ? '#FF9700'
          : col.key === 'status' && reg.status === 'confirmed' ? '#16A34A' : '#374151'
        doc.fontSize(8).fillColor(color).font(col.key === 'participation_type' ? 'Helvetica-Bold' : 'Helvetica')
          .text(val, cx + 4, currentY + 7, { width: col.width - 8, ellipsis: true })
        cx += col.width
      })
      doc.rect(startX, currentY, totalWidth, rowHeight).stroke('#E5E7EB')
      currentY += rowHeight
    })

    doc.fontSize(8).fillColor('#9CA3AF').font('Helvetica')
      .text('MUTCU · mutcu.org/business-expo · mutcunion@gmail.com · +254 757 930723', 40, doc.page.height - 30, { align: 'center' })
    doc.end()
  } catch (err) { console.error('[EXPO PDF]', err.message); res.status(500).json({ error: err.message }) }
})

module.exports = router