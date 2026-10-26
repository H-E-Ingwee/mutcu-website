const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { sendEmail } = require('../lib/email')

// ─── Validation helpers ───────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[\+\d\s\-\(\)]{7,20}$/

// ─── POST /api/expo/register — public submission ──────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      full_name, email, phone, participation_type,
      course, year_of_study, business_name, business_stage,
      how_heard, message,
    } = req.body

    // Validation
    if (!full_name?.trim()) return res.status(400).json({ error: 'Full name is required' })
    if (!email?.trim() || !emailRegex.test(email.trim())) return res.status(400).json({ error: 'A valid email address is required' })
    if (!phone?.trim() || !phoneRegex.test(phone.trim())) return res.status(400).json({ error: 'A valid phone number is required' })
    if (!participation_type || !['attendee', 'pitcher'].includes(participation_type)) {
      return res.status(400).json({ error: 'Participation type must be Attendee or Pitcher' })
    }
    if (participation_type === 'pitcher' && !business_name?.trim()) {
      return res.status(400).json({ error: 'Business name is required for pitchers' })
    }

    // Check for duplicate email
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

    // Insert registration
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
        how_heard: how_heard || null,
        message: message?.trim() || null,
        status: 'confirmed',
        registered_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation email (non-blocking)
    const isPitcher = participation_type === 'pitcher'
    sendEmail({
      to: email.trim(),
      subject: `You're registered! MUTCU Business Exposition 2027 — ${isPitcher ? "Founder's Arena" : 'Attendee'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:32px;text-align:center">
            <h1 style="color:#FF9700;margin:0;font-size:22px">MUTCU Business Exposition 2027</h1>
            <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">Beyond Ideas: Blueprint of a CEO</p>
          </div>
          <div style="padding:32px;background:#fff">
            <p style="font-size:16px;color:#04003D;font-weight:bold">Hi ${full_name.trim()},</p>
            <p style="color:#374151;font-size:14px;line-height:1.7">
              ${isPitcher
                ? `Your application to <strong>Founder's Arena</strong> has been received! You're on your way to the pitch stage. Our team will be in touch with next steps for Stage 01 — The Call.`
                : `Your registration as an <strong>Attendee</strong> for the MUTCU Business Exposition 2027 is confirmed! We look forward to seeing you on the day.`
              }
            </p>
            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;border-left:4px solid #FF9700">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7280;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em">Event Details</p>
              <p style="margin:4px 0;font-size:14px;color:#1a1a2e"><strong>📅 Date:</strong> Saturday, 13 March 2027</p>
              <p style="margin:4px 0;font-size:14px;color:#1a1a2e"><strong>⏰ Time:</strong> 8:00 AM – 4:00 PM</p>
              <p style="margin:4px 0;font-size:14px;color:#1a1a2e"><strong>📍 Venue:</strong> Murang'a University of Technology</p>
              <p style="margin:4px 0;font-size:14px;color:#1a1a2e"><strong>🎯 Theme:</strong> Beyond Ideas: Blueprint of a CEO</p>
              ${isPitcher ? `<p style="margin:4px 0;font-size:14px;color:#1a1a2e"><strong>🏆 Prize Pool:</strong> KSh 100,000</p>` : ''}
            </div>
            ${isPitcher ? `
            <div style="background:#fff8ed;border-radius:12px;padding:16px;margin:16px 0;border:1px solid #FF9700">
              <p style="margin:0 0 6px;font-size:13px;color:#FF9700;font-weight:bold">Your Founder's Arena Journey</p>
              <p style="margin:0;font-size:13px;color:#374151;line-height:1.6">
                Stage 01 → The Call &nbsp;|&nbsp; Stage 02 → The Den &nbsp;|&nbsp; Stage 03 → Blueprint Training &nbsp;|&nbsp; Stage 04 → The Pitch Showcase
              </p>
            </div>` : ''}
            <p style="color:#374151;font-size:14px;line-height:1.7">
              Follow us on social media for updates and announcements: <strong>@muranga_university_cu</strong>
            </p>
            <p style="color:#374151;font-size:14px;line-height:1.7">
              Questions? Email us at <a href="mailto:mutcunion@gmail.com" style="color:#FF9700">mutcunion@gmail.com</a> or call <a href="tel:+254757930723" style="color:#FF9700">+254 757 930723</a>.
            </p>
          </div>
          <div style="background:#f5f7fa;padding:16px 32px;text-align:center;font-size:11px;color:#9CA3AF">
            MUTCU Business Exposition 2027 · mutcu.org/business-expo · Inspire Love, Hope &amp; Godliness
          </div>
        </div>
      `,
    }).catch(e => console.error('[EXPO] Confirmation email failed:', e.message))

    // Notify admin (non-blocking)
    const adminEmail = process.env.ADMIN_EMAIL || 'mutcunion@gmail.com'
    sendEmail({
      to: adminEmail,
      subject: `[MUTCU Expo 2027] New ${isPitcher ? 'Pitcher' : 'Attendee'} Registration — ${full_name.trim()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
            <h2 style="color:#FF9700;margin:0;font-size:16px">New Expo Registration — ${isPitcher ? 'Pitcher (Founder\'s Arena)' : 'Attendee'}</h2>
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
              ${how_heard ? `<tr><td style="padding:6px 0;color:#6B7280">How heard</td><td style="padding:6px 0;color:#1a1a2e">${how_heard}</td></tr>` : ''}
              ${message ? `<tr><td style="padding:6px 0;color:#6B7280;vertical-align:top">Message</td><td style="padding:6px 0;color:#1a1a2e">${message}</td></tr>` : ''}
            </table>
          </div>
          <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
            View all registrations at <a href="https://mutcu.org/admin/expo-registrations" style="color:#FF9700">Admin Dashboard</a>
          </div>
        </div>
      `,
    }).catch(e => console.error('[EXPO] Admin notification failed:', e.message))

    res.status(201).json({
      message: isPitcher
        ? "You're in! Your Founder's Arena application has been received. Check your email for confirmation and next steps."
        : "You're registered! Check your email for your confirmation details. See you on 13 March 2027!",
      id: data.id,
      participation_type,
    })
  } catch (err) {
    console.error('[EXPO REGISTER]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/expo/registrations — admin: all registrations ──────────────────
router.get('/registrations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { type, status, search } = req.query
    let query = supabase
      .from('expo_registrations')
      .select('*')
      .order('registered_at', { ascending: false })

    if (type) query = query.eq('participation_type', type)
    if (status) query = query.eq('status', status)
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,business_name.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    const attendees = (data || []).filter(r => r.participation_type === 'attendee').length
    const pitchers = (data || []).filter(r => r.participation_type === 'pitcher').length

    res.json({
      registrations: data || [],
      total: data?.length || 0,
      attendees,
      pitchers,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/expo/stats — admin: summary stats ───────────────────────────────
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expo_registrations')
      .select('participation_type, status, registered_at')
    if (error) throw error

    const total = data?.length || 0
    const attendees = data?.filter(r => r.participation_type === 'attendee').length || 0
    const pitchers = data?.filter(r => r.participation_type === 'pitcher').length || 0
    const confirmed = data?.filter(r => r.status === 'confirmed').length || 0

    // Registrations per day (last 14 days)
    const now = new Date()
    const daily = {}
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      daily[d.toISOString().split('T')[0]] = 0
    }
    data?.forEach(r => {
      const day = r.registered_at?.split('T')[0]
      if (day && daily[day] !== undefined) daily[day]++
    })

    res.json({ total, attendees, pitchers, confirmed, daily })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── PUT /api/expo/registrations/:id/status — admin: update status ────────────
router.put('/registrations/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['confirmed', 'waitlisted', 'cancelled', 'attended']
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    const { data, error } = await supabase
      .from('expo_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ registration: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── DELETE /api/expo/registrations/:id — admin ───────────────────────────────
router.delete('/registrations/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('expo_registrations').delete().eq('id', req.params.id)
    res.json({ message: 'Registration deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/expo/export/excel — admin: download Excel ──────────────────────
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

    // ── Sheet 1: All Registrations ──
    const sheet = workbook.addWorksheet('All Registrations', {
      pageSetup: { paperSize: 9, orientation: 'landscape' },
    })

    // Header row styling
    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
    const headerFont = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' }
    const orangeFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9700' } }

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
      { header: 'How Heard', key: 'how_heard', width: 18 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registered At', key: 'registered_at', width: 20 },
      { header: 'Message', key: 'message', width: 30 },
    ]

    // Style header row
    sheet.getRow(1).eachCell(cell => {
      cell.fill = headerFill
      cell.font = headerFont
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      cell.border = { bottom: { style: 'medium', color: { argb: 'FFFF9700' } } }
    })
    sheet.getRow(1).height = 28

    // Add title above headers
    sheet.spliceRows(1, 0, [])
    sheet.mergeCells('A1:M1')
    const titleCell = sheet.getCell('A1')
    titleCell.value = 'MUTCU Business Exposition 2027 — Registrations'
    titleCell.font = { bold: true, size: 14, color: { argb: 'FFFF9700' }, name: 'Calibri' }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(1).height = 36

    // Add subtitle
    sheet.spliceRows(2, 0, [])
    sheet.mergeCells('A2:M2')
    const subCell = sheet.getCell('A2')
    subCell.value = `Exported: ${new Date().toLocaleString('en-GB')} | Total: ${data.length} | Attendees: ${data.filter(r => r.participation_type === 'attendee').length} | Pitchers: ${data.filter(r => r.participation_type === 'pitcher').length}`
    subCell.font = { size: 10, color: { argb: 'FF6B7280' }, name: 'Calibri' }
    subCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(2).height = 20

    // Data rows
    ;(data || []).forEach((reg, idx) => {
      const row = sheet.addRow({
        num: idx + 1,
        full_name: reg.full_name,
        email: reg.email,
        phone: reg.phone,
        participation_type: reg.participation_type === 'pitcher' ? 'Pitcher' : 'Attendee',
        course: reg.course || '—',
        year_of_study: reg.year_of_study || '—',
        business_name: reg.business_name || '—',
        business_stage: reg.business_stage || '—',
        how_heard: reg.how_heard || '—',
        status: reg.status || 'confirmed',
        registered_at: reg.registered_at ? new Date(reg.registered_at).toLocaleString('en-GB') : '—',
        message: reg.message || '—',
      })

      // Alternate row colors
      const rowFill = idx % 2 === 0
        ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }
        : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }

      row.eachCell(cell => {
        cell.fill = rowFill
        cell.font = { size: 10, name: 'Calibri' }
        cell.alignment = { vertical: 'middle', wrapText: true }
      })

      // Color-code participation type
      const typeCell = row.getCell('participation_type')
      if (reg.participation_type === 'pitcher') {
        typeCell.font = { bold: true, color: { argb: 'FFFF9700' }, size: 10, name: 'Calibri' }
      } else {
        typeCell.font = { bold: true, color: { argb: 'FF04003D' }, size: 10, name: 'Calibri' }
      }

      // Color-code status
      const statusCell = row.getCell('status')
      const statusColors = { confirmed: 'FF16A34A', waitlisted: 'FFD97706', cancelled: 'FFDC2626', attended: 'FF2563EB' }
      statusCell.font = { bold: true, color: { argb: statusColors[reg.status] || 'FF374151' }, size: 10, name: 'Calibri' }

      row.height = 22
    })

    // Freeze header rows
    sheet.views = [{ state: 'frozen', ySplit: 3 }]

    // ── Sheet 2: Pitchers Only ──
    const pitcherSheet = workbook.addWorksheet("Founder's Arena — Pitchers")
    const pitchers = (data || []).filter(r => r.participation_type === 'pitcher')

    pitcherSheet.columns = [
      { header: '#', key: 'num', width: 5 },
      { header: 'Full Name', key: 'full_name', width: 22 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Business Name', key: 'business_name', width: 24 },
      { header: 'Business Stage', key: 'business_stage', width: 20 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Year', key: 'year_of_study', width: 8 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registered At', key: 'registered_at', width: 20 },
    ]

    pitcherSheet.getRow(1).eachCell(cell => {
      cell.fill = orangeFill
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
    pitcherSheet.getRow(1).height = 28

    pitchers.forEach((reg, idx) => {
      const row = pitcherSheet.addRow({
        num: idx + 1,
        full_name: reg.full_name,
        email: reg.email,
        phone: reg.phone,
        business_name: reg.business_name || '—',
        business_stage: reg.business_stage || '—',
        course: reg.course || '—',
        year_of_study: reg.year_of_study || '—',
        status: reg.status || 'confirmed',
        registered_at: reg.registered_at ? new Date(reg.registered_at).toLocaleString('en-GB') : '—',
      })
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 0 ? 'FFFFF8ED' : 'FFFFFFFF' } }
        cell.font = { size: 10, name: 'Calibri' }
        cell.alignment = { vertical: 'middle' }
      })
      row.height = 22
    })

    // ── Sheet 3: Summary ──
    const summarySheet = workbook.addWorksheet('Summary')
    summarySheet.getColumn('A').width = 30
    summarySheet.getColumn('B').width = 20

    const summaryData = [
      ['MUTCU Business Exposition 2027', ''],
      ['Beyond Ideas: Blueprint of a CEO', ''],
      ['', ''],
      ['Export Date', new Date().toLocaleString('en-GB')],
      ['', ''],
      ['REGISTRATION SUMMARY', ''],
      ['Total Registrations', data.length],
      ['Attendees', data.filter(r => r.participation_type === 'attendee').length],
      ["Pitchers (Founder's Arena)", data.filter(r => r.participation_type === 'pitcher').length],
      ['Confirmed', data.filter(r => r.status === 'confirmed').length],
      ['Attended', data.filter(r => r.status === 'attended').length],
      ['Cancelled', data.filter(r => r.status === 'cancelled').length],
    ]

    summaryData.forEach((rowData, i) => {
      const row = summarySheet.addRow(rowData)
      if (i === 0) {
        row.getCell(1).font = { bold: true, size: 16, color: { argb: 'FFFF9700' }, name: 'Calibri' }
        row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
        summarySheet.mergeCells(`A${i + 1}:B${i + 1}`)
        row.height = 32
      } else if (i === 5) {
        row.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' }, name: 'Calibri' }
        row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
        summarySheet.mergeCells(`A${i + 1}:B${i + 1}`)
      } else if (i > 5) {
        row.getCell(1).font = { size: 11, name: 'Calibri' }
        row.getCell(2).font = { bold: true, size: 11, color: { argb: 'FFFF9700' }, name: 'Calibri' }
      }
    })

    // Stream response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="MUTCU-Expo-2027-Registrations-${new Date().toISOString().split('T')[0]}.xlsx"`)
    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error('[EXPO EXCEL]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/expo/export/pdf — admin: download PDF ──────────────────────────
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

    // ── Header ──
    doc.rect(0, 0, doc.page.width, 70).fill('#04003D')
    doc.fontSize(18).fillColor('#FF9700').font('Helvetica-Bold')
      .text('MUTCU Business Exposition 2027', 40, 18)
    doc.fontSize(11).fillColor('rgba(255,255,255,0.7)').font('Helvetica')
      .text('Beyond Ideas: Blueprint of a CEO  ·  Registrations Report', 40, 42)
    doc.fontSize(9).fillColor('rgba(255,255,255,0.5)')
      .text(`Exported: ${new Date().toLocaleString('en-GB')}  ·  Total: ${data.length}  ·  Attendees: ${data.filter(r => r.participation_type === 'attendee').length}  ·  Pitchers: ${data.filter(r => r.participation_type === 'pitcher').length}`, 40, 58)

    doc.moveDown(3)

    // ── Table ──
    const cols = [
      { label: '#', width: 28, key: 'num' },
      { label: 'Full Name', width: 120, key: 'full_name' },
      { label: 'Email', width: 155, key: 'email' },
      { label: 'Phone', width: 90, key: 'phone' },
      { label: 'Type', width: 65, key: 'participation_type' },
      { label: 'Business', width: 110, key: 'business_name' },
      { label: 'Status', width: 65, key: 'status' },
      { label: 'Registered', width: 100, key: 'registered_at' },
    ]

    const tableTop = 85
    const rowHeight = 22
    let startX = 40

    // Table header
    doc.rect(startX, tableTop, cols.reduce((s, c) => s + c.width, 0), rowHeight).fill('#04003D')
    let x = startX
    cols.forEach(col => {
      doc.fontSize(8).fillColor('#FF9700').font('Helvetica-Bold')
        .text(col.label, x + 4, tableTop + 7, { width: col.width - 8, ellipsis: true })
      x += col.width
    })

    // Table rows
    ;(data || []).forEach((reg, idx) => {
      const y = tableTop + rowHeight + idx * rowHeight
      if (y > doc.page.height - 60) {
        doc.addPage({ layout: 'landscape' })
        // Re-draw header on new page
        doc.rect(startX, 40, cols.reduce((s, c) => s + c.width, 0), rowHeight).fill('#04003D')
        let hx = startX
        cols.forEach(col => {
          doc.fontSize(8).fillColor('#FF9700').font('Helvetica-Bold')
            .text(col.label, hx + 4, 47, { width: col.width - 8, ellipsis: true })
          hx += col.width
        })
        return
      }

      // Alternate row background
      if (idx % 2 === 0) {
        doc.rect(startX, y, cols.reduce((s, c) => s + c.width, 0), rowHeight).fill('#F9FAFB')
      }

      let cx = startX
      cols.forEach(col => {
        let val = ''
        if (col.key === 'num') val = String(idx + 1)
        else if (col.key === 'participation_type') val = reg.participation_type === 'pitcher' ? 'Pitcher' : 'Attendee'
        else if (col.key === 'business_name') val = reg.business_name || '—'
        else if (col.key === 'registered_at') val = reg.registered_at ? new Date(reg.registered_at).toLocaleDateString('en-GB') : '—'
        else val = reg[col.key] || '—'

        const color = col.key === 'participation_type' && reg.participation_type === 'pitcher' ? '#FF9700'
          : col.key === 'status' && reg.status === 'confirmed' ? '#16A34A'
          : '#374151'

        doc.fontSize(8).fillColor(color).font(col.key === 'participation_type' ? 'Helvetica-Bold' : 'Helvetica')
          .text(val, cx + 4, y + 7, { width: col.width - 8, ellipsis: true })
        cx += col.width
      })

      // Row border
      doc.rect(startX, y, cols.reduce((s, c) => s + c.width, 0), rowHeight)
        .stroke('#E5E7EB')
    })

    // ── Footer ──
    doc.fontSize(8).fillColor('#9CA3AF').font('Helvetica')
      .text('MUTCU · mutcu.org/business-expo · mutcunion@gmail.com · +254 757 930723', 40, doc.page.height - 30, { align: 'center' })

    doc.end()
  } catch (err) {
    console.error('[EXPO PDF]', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router