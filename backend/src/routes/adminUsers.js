const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { authenticate } = require('../middleware/auth')
const { sendEmail } = require('../lib/email')

// ─── Role definitions ─────────────────────────────────────────────────────────
const WEBSITE_ROLES = [
  { value: 'super_admin',       label: 'Super Admin',              desc: 'Full access to everything' },
  { value: 'content_manager',   label: 'Content & Events Manager', desc: 'Homepage, Events, Leadership, Ministries, Resources, Blogs (read)' },
  { value: 'blog_manager',      label: 'Blog & Editorial Manager', desc: 'Blogs, Gallery' },
  { value: 'gallery_manager',   label: 'Gallery & Media Manager',  desc: 'Gallery only' },
  { value: 'newsletter_manager',label: 'Newsletter Manager',       desc: 'Newsletter, Analytics (read)' },
  { value: 'prayer_manager',    label: 'Prayer & Contact Manager', desc: 'Prayer, Contacts' },
  { value: 'analytics_manager', label: 'SEO & Analytics Manager',  desc: 'Analytics, Settings (SEO tab)' },
  { value: 'expo_manager',      label: 'Expo Manager',             desc: 'Expo Registrations, Expo Settings, Forms' },
  { value: 'secretary',         label: 'CU Secretary',             desc: 'Contacts, Prayer, Newsletter, Leadership, Settings, Forms, Content' },
]

// ─── Middleware: require super_admin website role ──────────────────────────────
async function requireSuperWebAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  // DMS super_admin / ec_admin always have full access
  if (['super_admin', 'ec_admin'].includes(req.user.role)) return next()
  // Check website_admin_users table
  const { data } = await supabase
    .from('website_admin_users')
    .select('website_role, is_active')
    .eq('email', req.user.email)
    .single()
  if (!data || !data.is_active || data.website_role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' })
  }
  next()
}

// ─── Audit log helper ─────────────────────────────────────────────────────────
async function auditLog(user, action, module, recordId, recordTitle, details, ip) {
  try {
    await supabase.from('website_audit_log').insert({
      user_id: user?.id || null,
      user_name: user?.name || 'System',
      user_email: user?.email || null,
      user_role: user?.website_role || user?.role || null,
      action,
      module,
      record_id: recordId ? String(recordId) : null,
      record_title: recordTitle || null,
      details: details || null,
      ip_address: ip || null,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[AUDIT LOG]', e.message)
  }
}

// ─── GET /api/admin-users/roles — list available roles ────────────────────────
router.get('/roles', authenticate, (req, res) => {
  res.json({ roles: WEBSITE_ROLES })
})

// ─── GET /api/admin-users — list all website admin users ─────────────────────
router.get('/', authenticate, requireSuperWebAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_admin_users')
      .select('id, email, name, website_role, is_active, invite_accepted, last_login_at, created_at, invited_by')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ users: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── POST /api/admin-users/invite — invite a new admin user ──────────────────
router.post('/invite', authenticate, requireSuperWebAdmin, async (req, res) => {
  try {
    const { email, name, website_role } = req.body
    if (!email?.trim() || !name?.trim() || !website_role) {
      return res.status(400).json({ error: 'Email, name, and role are required' })
    }
    if (!WEBSITE_ROLES.find(r => r.value === website_role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Check if already exists
    const { data: existing } = await supabase
      .from('website_admin_users')
      .select('id, is_active, invite_accepted')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existing?.invite_accepted) {
      return res.status(409).json({ error: 'A user with this email already has an active account.' })
    }

    // Generate invite token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const userData = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      website_role,
      is_active: true,
      invite_token: token,
      invite_expires_at: expires.toISOString(),
      invite_accepted: false,
      invited_by: req.user.id || null,
      updated_at: new Date().toISOString(),
    }

    let userId
    if (existing) {
      // Re-invite: update existing record
      const { data, error } = await supabase
        .from('website_admin_users')
        .update(userData)
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      userId = data.id
    } else {
      const { data, error } = await supabase
        .from('website_admin_users')
        .insert(userData)
        .select()
        .single()
      if (error) throw error
      userId = data.id
    }

    // Send invitation email
    const inviteUrl = `${process.env.FRONTEND_URL || 'https://mutcu.org'}/admin/accept-invite?token=${token}`
    const roleLabel = WEBSITE_ROLES.find(r => r.value === website_role)?.label || website_role

    await sendEmail({
      to: email.trim(),
      subject: `You've been invited to manage the MUTCU Website`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:36px 32px;text-align:center">
            <h1 style="color:#FF9700;margin:0;font-size:22px;font-weight:900">MUTCU Website Admin</h1>
            <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">mutcu.org</p>
          </div>
          <div style="padding:32px;background:#fff">
            <p style="font-size:16px;color:#04003D;font-weight:900;margin:0 0 8px">Hi ${name.trim()}!</p>
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 16px">
              <strong>${req.user.name}</strong> has invited you to manage the MUTCU website as a <strong style="color:#FF9700">${roleLabel}</strong>.
            </p>
            <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:0 0 20px;border-left:4px solid #FF9700">
              <p style="margin:0 0 4px;font-size:12px;color:#9CA3AF;font-weight:700;text-transform:uppercase">Your Role</p>
              <p style="margin:0;font-size:15px;color:#04003D;font-weight:700">${roleLabel}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#6B7280">${WEBSITE_ROLES.find(r => r.value === website_role)?.desc || ''}</p>
            </div>
            <p style="color:#374151;font-size:14px;line-height:1.8;margin:0 0 20px">
              Click the button below to set your password and access the admin dashboard. This link expires in <strong>7 days</strong>.
            </p>
            <a href="${inviteUrl}" style="display:inline-block;background:#FF9700;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
              Accept Invitation & Set Password
            </a>
            <p style="color:#9CA3AF;font-size:12px;margin:20px 0 0">
              Or copy this link: <a href="${inviteUrl}" style="color:#FF9700">${inviteUrl}</a>
            </p>
          </div>
          <div style="background:#f5f7fa;padding:16px 32px;text-align:center;font-size:11px;color:#9CA3AF">
            MUTCU Website · mutcu.org · Inspire Love, Hope &amp; Godliness
          </div>
        </div>
      `,
    })

    await auditLog(req.user, 'INVITE', 'users', userId, `${name.trim()} (${email.trim()})`, { role: website_role }, req.ip)

    res.status(201).json({ message: `Invitation sent to ${email.trim()}`, userId })
  } catch (err) {
    console.error('[INVITE]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/admin-users/invite/:token — validate invite token ───────────────
router.get('/invite/:token', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('website_admin_users')
      .select('id, email, name, website_role, invite_expires_at, invite_accepted')
      .eq('invite_token', req.params.token)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Invalid or expired invitation link.' })
    if (data.invite_accepted) return res.status(400).json({ error: 'This invitation has already been used.' })
    if (new Date(data.invite_expires_at) < new Date()) return res.status(400).json({ error: 'This invitation link has expired. Please ask your admin to resend it.' })

    res.json({ user: { email: data.email, name: data.name, website_role: data.website_role } })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── POST /api/admin-users/accept-invite — set password + activate ────────────
router.post('/accept-invite', async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ error: 'Token and password are required' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const { data, error } = await supabase
      .from('website_admin_users')
      .select('*')
      .eq('invite_token', token)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Invalid or expired invitation link.' })
    if (data.invite_accepted) return res.status(400).json({ error: 'This invitation has already been used.' })
    if (new Date(data.invite_expires_at) < new Date()) return res.status(400).json({ error: 'This invitation link has expired.' })

    const password_hash = await bcrypt.hash(password, 12)

    const { error: updateError } = await supabase
      .from('website_admin_users')
      .update({
        password_hash,
        invite_accepted: true,
        invite_token: null,
        invite_expires_at: null,
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)

    if (updateError) throw updateError

    // Issue JWT
    const jwtPayload = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: 'website_admin',
      website_role: data.website_role,
      source: 'website',
    }
    const token_jwt = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

    await auditLog(jwtPayload, 'LOGIN', 'users', data.id, data.name, { method: 'invite_accept' }, req.ip)

    res.json({
      message: 'Account activated! Welcome to the MUTCU admin dashboard.',
      token: token_jwt,
      user: { id: data.id, name: data.name, email: data.email, role: 'website_admin', website_role: data.website_role },
    })
  } catch (err) {
    console.error('[ACCEPT INVITE]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/admin-users/login — website admin login ───────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const { data: user, error } = await supabase
      .from('website_admin_users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' })
    if (!user.is_active) return res.status(403).json({ error: 'Your account has been deactivated. Contact the super admin.' })
    if (!user.invite_accepted) return res.status(403).json({ error: 'Please accept your invitation first. Check your email for the invitation link.' })
    if (!user.password_hash) return res.status(403).json({ error: 'No password set. Please use your invitation link to set a password.' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    // Update last login
    await supabase.from('website_admin_users').update({ last_login_at: new Date().toISOString() }).eq('id', user.id)

    const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'website_admin',
      website_role: user.website_role,
      source: 'website',
    }
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

    await auditLog(jwtPayload, 'LOGIN', 'users', user.id, user.name, { method: 'password' }, req.ip)

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: 'website_admin', website_role: user.website_role },
    })
  } catch (err) {
    console.error('[WEBSITE LOGIN]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── PUT /api/admin-users/:id — update role or status ────────────────────────
router.put('/:id', authenticate, requireSuperWebAdmin, async (req, res) => {
  try {
    const { website_role, is_active, name } = req.body
    const updates = { updated_at: new Date().toISOString() }
    if (website_role) {
      if (!WEBSITE_ROLES.find(r => r.value === website_role)) return res.status(400).json({ error: 'Invalid role' })
      updates.website_role = website_role
    }
    if (typeof is_active === 'boolean') updates.is_active = is_active
    if (name?.trim()) updates.name = name.trim()

    const { data, error } = await supabase
      .from('website_admin_users')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error

    await auditLog(req.user, 'UPDATE', 'users', data.id, data.name, { changes: updates }, req.ip)
    res.json({ user: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── POST /api/admin-users/:id/resend-invite — resend invitation ──────────────
router.post('/:id/resend-invite', authenticate, requireSuperWebAdmin, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('website_admin_users')
      .select('*')
      .eq('id', req.params.id)
      .single()
    if (error || !user) return res.status(404).json({ error: 'User not found' })
    if (user.invite_accepted) return res.status(400).json({ error: 'User has already accepted their invitation' })

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await supabase.from('website_admin_users').update({
      invite_token: token,
      invite_expires_at: expires.toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    const inviteUrl = `${process.env.FRONTEND_URL || 'https://mutcu.org'}/admin/accept-invite?token=${token}`
    const roleLabel = WEBSITE_ROLES.find(r => r.value === user.website_role)?.label || user.website_role

    await sendEmail({
      to: user.email,
      subject: `[Resent] Your MUTCU Website Admin Invitation`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:32px;text-align:center">
          <h1 style="color:#FF9700;margin:0;font-size:20px">MUTCU Website Admin — Invitation Resent</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <p style="font-size:15px;color:#04003D;font-weight:700">Hi ${user.name},</p>
          <p style="color:#374151;font-size:14px;line-height:1.8">Your invitation as <strong>${roleLabel}</strong> has been resent. Click below to set your password:</p>
          <a href="${inviteUrl}" style="display:inline-block;background:#FF9700;color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;margin:16px 0">Accept Invitation</a>
          <p style="color:#9CA3AF;font-size:12px">This link expires in 7 days.</p>
        </div>
      </div>`,
    })

    res.json({ message: `Invitation resent to ${user.email}` })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── DELETE /api/admin-users/:id — deactivate (soft delete) ──────────────────
router.delete('/:id', authenticate, requireSuperWebAdmin, async (req, res) => {
  try {
    // Prevent self-deletion
    const { data: target } = await supabase.from('website_admin_users').select('name, email').eq('id', req.params.id).single()
    if (target?.email === req.user.email) return res.status(400).json({ error: 'You cannot remove your own account' })

    await supabase.from('website_admin_users').update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', req.params.id)
    await auditLog(req.user, 'DELETE', 'users', req.params.id, target?.name, null, req.ip)
    res.json({ message: 'User deactivated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/admin-users/audit-log — audit trail ────────────────────────────
router.get('/audit-log', authenticate, requireSuperWebAdmin, async (req, res) => {
  try {
    const { module, action, search, limit = 100, page = 1 } = req.query
    let query = supabase
      .from('website_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (module) query = query.eq('module', module)
    if (action) query = query.eq('action', action)
    if (search) query = query.or(`user_name.ilike.%${search}%,record_title.ilike.%${search}%,user_email.ilike.%${search}%`)

    const { data, error } = await query
    if (error) throw error
    res.json({ logs: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ─── GET /api/admin-users/me — get current website user profile ───────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    // If DMS user (has role from DMS JWT)
    if (req.user.source !== 'website') {
      return res.json({
        user: {
          ...req.user,
          website_role: req.user.role === 'super_admin' || req.user.role === 'ec_admin' ? 'super_admin' : 'secretary',
          source: 'dms',
        }
      })
    }
    // Website admin user
    const { data, error } = await supabase
      .from('website_admin_users')
      .select('id, email, name, website_role, is_active, last_login_at')
      .eq('id', req.user.id)
      .single()
    if (error || !data) return res.status(404).json({ error: 'User not found' })
    res.json({ user: { ...data, role: 'website_admin', source: 'website' } })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
module.exports.auditLog = auditLog