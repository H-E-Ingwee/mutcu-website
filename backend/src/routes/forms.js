const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { sendEmail } = require('../lib/email')

// ─── GET /api/forms — public: list open forms ─────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_forms')
      .select('id,title,slug,description,status,deadline,success_message')
      .in('status', ['open', 'closed'])
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ forms: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/forms/all — admin: all forms ────────────────────────────────────
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_forms')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    // Attach submission counts
    const counts = await Promise.all((data || []).map(async f => {
      const { count } = await supabase
        .from('website_form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', f.id)
      return { id: f.id, count: count || 0 }
    }))
    const countMap = {}
    counts.forEach(c => { countMap[c.id] = c.count })
    res.json({ forms: (data || []).map(f => ({ ...f, submission_count: countMap[f.id] || 0 })) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/forms/:slug — public: single form by slug ──────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_forms')
      .select('id,title,slug,description,status,deadline,fields,success_message')
      .eq('slug', req.params.slug)
      .single()
    if (error || !data) return res.status(404).json({ error: 'Form not found' })
    // Auto-close if deadline passed
    if (data.status === 'open' && data.deadline && new Date(data.deadline) < new Date()) {
      await supabase.from('website_forms').update({ status: 'closed' }).eq('id', data.id)
      data.status = 'closed'
    }
    res.json({ form: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── POST /api/forms — admin: create form ────────────────────────────────────
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, fields, status, deadline, success_message, notify_email } = req.body
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })
    if (!fields || !Array.isArray(fields) || fields.length === 0) return res.status(400).json({ error: 'At least one field is required' })

    // Auto-generate slug from title
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    // Ensure unique slug
    const { data: existing } = await supabase.from('website_forms').select('slug').eq('slug', slug)
    if (existing && existing.length > 0) slug = `${slug}-${Date.now()}`

    const { data, error } = await supabase.from('website_forms').insert({
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      fields: JSON.stringify(fields),
      status: status || 'draft',
      deadline: deadline || null,
      success_message: success_message?.trim() || 'Thank you for your submission! We will be in touch soon.',
      notify_email: notify_email?.trim() || process.env.ADMIN_EMAIL || 'mutcunion@gmail.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select().single()
    if (error) throw error
    res.status(201).json({ form: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── PUT /api/forms/:id — admin: update form ─────────────────────────────────
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body, updated_at: new Date().toISOString() }
    if (updates.fields && Array.isArray(updates.fields)) updates.fields = JSON.stringify(updates.fields)
    const { data, error } = await supabase.from('website_forms').update(updates).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ form: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── DELETE /api/forms/:id — admin ───────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_form_submissions').delete().eq('form_id', req.params.id)
    await supabase.from('website_forms').delete().eq('id', req.params.id)
    res.json({ message: 'Form and all submissions deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── POST /api/forms/:slug/submit — public: submit form ──────────────────────
router.post('/:slug/submit', async (req, res) => {
  try {
    const { data: form, error: formErr } = await supabase
      .from('website_forms')
      .select('*')
      .eq('slug', req.params.slug)
      .single()
    if (formErr || !form) return res.status(404).json({ error: 'Form not found' })

    // Check if open
    if (form.status !== 'open') return res.status(403).json({ error: 'Registrations are closed for this form.', closed: true })
    if (form.deadline && new Date(form.deadline) < new Date()) {
      await supabase.from('website_forms').update({ status: 'closed' }).eq('id', form.id)
      return res.status(403).json({ error: 'The registration deadline has passed.', closed: true })
    }

    // Parse fields
    let fields = form.fields
    if (typeof fields === 'string') { try { fields = JSON.parse(fields) } catch { fields = [] } }

    // Validate required fields
    const submissionData = req.body
    for (const field of (fields || [])) {
      if (field.required && !submissionData[field.key]?.toString().trim()) {
        return res.status(400).json({ error: `${field.label} is required` })
      }
    }

    // Save submission
    const { data: submission, error: subErr } = await supabase.from('website_form_submissions').insert({
      form_id: form.id,
      data: submissionData,
      submitted_at: new Date().toISOString(),
      ip_address: req.ip || null,
    }).select().single()
    if (subErr) throw subErr

    // Send confirmation email if email field exists
    const emailField = (fields || []).find(f => f.type === 'email')
    const submitterEmail = emailField ? submissionData[emailField.key] : null
    const submitterName = submissionData['full_name'] || submissionData['name'] || 'Participant'

    if (submitterEmail) {
      const fieldRows = (fields || []).map(f => {
        const val = submissionData[f.key]
        if (!val) return ''
        return `<tr><td style="padding:5px 0;color:#6B7280;font-size:13px;width:140px">${f.label}</td><td style="padding:5px 0;color:#1a1a2e;font-size:13px;font-weight:600">${Array.isArray(val) ? val.join(', ') : val}</td></tr>`
      }).filter(Boolean).join('')

      sendEmail({
        to: submitterEmail,
        subject: `Registration Confirmed — ${form.title}`,
        replyTo: form.notify_email || process.env.ADMIN_EMAIL || 'mutcunion@gmail.com',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:32px;text-align:center">
            <h1 style="color:#FF9700;margin:0;font-size:20px;font-weight:900">${form.title}</h1>
            <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">Registration Confirmed</p>
          </div>
          <div style="padding:32px;background:#fff">
            <p style="font-size:16px;color:#04003D;font-weight:900;margin:0 0 8px">Hi ${submitterName}!</p>
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px">Your registration has been received. Here's a summary of what you submitted:</p>
            <div style="background:#f9fafb;border-radius:12px;padding:20px;border-left:4px solid #FF9700">
              <table style="width:100%;border-collapse:collapse">${fieldRows}</table>
            </div>
            <p style="color:#374151;font-size:13px;line-height:1.7;margin:20px 0 0">
              Questions? Email <a href="mailto:mutcunion@gmail.com" style="color:#FF9700">mutcunion@gmail.com</a>
            </p>
          </div>
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:16px 32px;text-align:center">
            <a href="https://mutcu.org" style="color:#FF9700;font-size:12px;text-decoration:none;font-weight:600">mutcu.org</a>
            <span style="color:rgba(255,255,255,0.3);margin:0 8px">·</span>
            <span style="color:rgba(255,255,255,0.4);font-size:11px">Inspire Love, Hope &amp; Godliness</span>
          </div>
        </div>`,
      }).catch(e => console.error('[FORM EMAIL]', e.message))
    }

    // Notify admin
    if (form.notify_email) {
      const fieldRowsAdmin = (fields || []).map(f => {
        const val = submissionData[f.key]
        if (!val) return ''
        return `<tr><td style="padding:5px 0;color:#6B7280;font-size:13px;width:140px">${f.label}</td><td style="padding:5px 0;color:#1a1a2e;font-size:13px">${Array.isArray(val) ? val.join(', ') : val}</td></tr>`
      }).filter(Boolean).join('')
      sendEmail({
        to: form.notify_email,
        subject: `[MUTCU] New Submission — ${form.title}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
            <h2 style="color:#FF9700;margin:0;font-size:16px">New Form Submission — ${form.title}</h2>
          </div>
          <div style="padding:24px 32px;background:#fff">
            <table style="width:100%;border-collapse:collapse">${fieldRowsAdmin}</table>
          </div>
          <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
            <a href="https://mutcu.org/admin/forms" style="color:#FF9700">View in Admin Dashboard</a>
          </div>
        </div>`,
      }).catch(e => console.error('[FORM ADMIN EMAIL]', e.message))
    }

    res.status(201).json({ message: form.success_message || 'Submission received!', id: submission.id })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/forms/:id/submissions — admin ───────────────────────────────────
router.get('/:id/submissions', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_form_submissions')
      .select('*')
      .eq('form_id', req.params.id)
      .order('submitted_at', { ascending: false })
    if (error) throw error
    res.json({ submissions: data || [], total: data?.length || 0 })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── DELETE /api/forms/:formId/submissions/:id — admin ───────────────────────
router.delete('/:formId/submissions/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_form_submissions').delete().eq('id', req.params.id)
    res.json({ message: 'Submission deleted' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/forms/:id/export/excel — admin ─────────────────────────────────
router.get('/:id/export/excel', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data: form, error: formErr } = await supabase.from('website_forms').select('*').eq('id', req.params.id).single()
    if (formErr || !form) return res.status(404).json({ error: 'Form not found' })
    const { data: submissions, error: subErr } = await supabase.from('website_form_submissions').select('*').eq('form_id', req.params.id).order('submitted_at', { ascending: false })
    if (subErr) throw subErr

    let fields = form.fields
    if (typeof fields === 'string') { try { fields = JSON.parse(fields) } catch { fields = [] } }

    const ExcelJS = require('exceljs')
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'MUTCU Website'
    const sheet = workbook.addWorksheet('Submissions')

    // Title row
    const colCount = (fields || []).length + 2
    sheet.mergeCells(`A1:${String.fromCharCode(64 + colCount)}1`)
    const titleCell = sheet.getCell('A1')
    titleCell.value = `${form.title} — Submissions`
    titleCell.font = { bold: true, size: 14, color: { argb: 'FFFF9700' }, name: 'Calibri' }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(1).height = 32

    // Sub-title
    sheet.mergeCells(`A2:${String.fromCharCode(64 + colCount)}2`)
    sheet.getCell('A2').value = `Exported: ${new Date().toLocaleString('en-GB')} | Total: ${submissions.length}`
    sheet.getCell('A2').font = { size: 10, color: { argb: 'FF6B7280' }, name: 'Calibri' }
    sheet.getCell('A2').alignment = { horizontal: 'center' }
    sheet.getRow(2).height = 18

    // Headers
    const headers = ['#', ...(fields || []).map(f => f.label), 'Submitted At']
    const headerRow = sheet.addRow(headers)
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF04003D' } }
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10, name: 'Calibri' }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
    headerRow.height = 24

    // Set column widths
    sheet.getColumn(1).width = 5
    ;(fields || []).forEach((f, i) => { sheet.getColumn(i + 2).width = Math.max(f.label.length + 4, 18) })
    sheet.getColumn((fields || []).length + 2).width = 22

    // Data rows
    ;(submissions || []).forEach((sub, idx) => {
      const subData = typeof sub.data === 'string' ? JSON.parse(sub.data) : (sub.data || {})
      const rowData = [idx + 1, ...(fields || []).map(f => {
        const val = subData[f.key]
        return Array.isArray(val) ? val.join(', ') : (val || '—')
      }), sub.submitted_at ? new Date(sub.submitted_at).toLocaleString('en-GB') : '—']
      const row = sheet.addRow(rowData)
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 0 ? 'FFF9FAFB' : 'FFFFFFFF' } }
        cell.font = { size: 10, name: 'Calibri' }
        cell.alignment = { vertical: 'middle', wrapText: true }
      })
      row.height = 20
    })
    sheet.views = [{ state: 'frozen', ySplit: 3 }]

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${form.slug}-submissions-${new Date().toISOString().split('T')[0]}.xlsx"`)
    await workbook.xlsx.write(res)
    res.end()
  } catch (err) { console.error('[FORM EXCEL]', err.message); res.status(500).json({ error: err.message }) }
})

// ─── GET /api/forms/:id/export/pdf — admin ───────────────────────────────────
router.get('/:id/export/pdf', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data: form, error: formErr } = await supabase.from('website_forms').select('*').eq('id', req.params.id).single()
    if (formErr || !form) return res.status(404).json({ error: 'Form not found' })
    const { data: submissions, error: subErr } = await supabase.from('website_form_submissions').select('*').eq('form_id', req.params.id).order('submitted_at', { ascending: false })
    if (subErr) throw subErr

    let fields = form.fields
    if (typeof fields === 'string') { try { fields = JSON.parse(fields) } catch { fields = [] } }

    const PDFDocument = require('pdfkit')
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${form.slug}-submissions-${new Date().toISOString().split('T')[0]}.pdf"`)
    doc.pipe(res)

    doc.rect(0, 0, doc.page.width, 70).fill('#04003D')
    doc.fontSize(18).fillColor('#FF9700').font('Helvetica-Bold').text(form.title, 40, 18)
    doc.fontSize(11).fillColor('rgba(255,255,255,0.7)').font('Helvetica').text('Submissions Report', 40, 42)
    doc.fontSize(9).fillColor('rgba(255,255,255,0.5)').text(`Exported: ${new Date().toLocaleString('en-GB')}  ·  Total: ${submissions.length}`, 40, 58)

    const visibleFields = (fields || []).slice(0, 6)
    const colWidth = Math.floor((doc.page.width - 80) / (visibleFields.length + 2))
    const cols = [{ label: '#', width: 30, key: '_num' }, ...visibleFields.map(f => ({ label: f.label, width: colWidth, key: f.key })), { label: 'Submitted', width: 90, key: '_date' }]
    const totalWidth = cols.reduce((s, c) => s + c.width, 0)
    const tableTop = 85; const rowHeight = 22; const startX = 40

    doc.rect(startX, tableTop, totalWidth, rowHeight).fill('#04003D')
    let x = startX
    cols.forEach(col => { doc.fontSize(8).fillColor('#FF9700').font('Helvetica-Bold').text(col.label, x + 4, tableTop + 7, { width: col.width - 8, ellipsis: true }); x += col.width })

    let currentY = tableTop + rowHeight
    ;(submissions || []).forEach((sub, idx) => {
      if (currentY + rowHeight > doc.page.height - 50) {
        doc.addPage({ layout: 'landscape' }); currentY = 40
        doc.rect(startX, currentY, totalWidth, rowHeight).fill('#04003D')
        let hx = startX
        cols.forEach(col => { doc.fontSize(8).fillColor('#FF9700').font('Helvetica-Bold').text(col.label, hx + 4, currentY + 7, { width: col.width - 8, ellipsis: true }); hx += col.width })
        currentY += rowHeight
      }
      const subData = typeof sub.data === 'string' ? JSON.parse(sub.data) : (sub.data || {})
      if (idx % 2 === 0) doc.rect(startX, currentY, totalWidth, rowHeight).fill('#F9FAFB')
      let cx = startX
      cols.forEach(col => {
        let val = ''
        if (col.key === '_num') val = String(idx + 1)
        else if (col.key === '_date') val = sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-GB') : '—'
        else { const v = subData[col.key]; val = Array.isArray(v) ? v.join(', ') : (v || '—') }
        doc.fontSize(8).fillColor('#374151').font('Helvetica').text(val, cx + 4, currentY + 7, { width: col.width - 8, ellipsis: true })
        cx += col.width
      })
      doc.rect(startX, currentY, totalWidth, rowHeight).stroke('#E5E7EB')
      currentY += rowHeight
    })

    doc.fontSize(8).fillColor('#9CA3AF').font('Helvetica').text('MUTCU · mutcu.org · mutcunion@gmail.com', 40, doc.page.height - 30, { align: 'center' })
    doc.end()
  } catch (err) { console.error('[FORM PDF]', err.message); res.status(500).json({ error: err.message }) }
})

module.exports = router