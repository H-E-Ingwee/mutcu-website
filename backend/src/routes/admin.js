const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// POST /api/admin/login — uses same DMS users table + JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data: user, error } = await supabase.from('users')
      .select('id,name,email,password,role').eq('email', email.trim().toLowerCase()).single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const adminRoles = ['super_admin', 'ec_admin', 'cu_secretary', 'admin'];
    if (!adminRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/me — verify token
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// GET /api/admin/dashboard — stats overview
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const [events, blogs, gallery, contacts, prayer, newsletter, leadership] = await Promise.all([
      supabase.from('website_events').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('website_blogs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('website_gallery').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('website_contacts').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('website_prayer_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('website_newsletter').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('website_leadership').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    res.json({
      stats: {
        events: events.count || 0,
        blogs: blogs.count || 0,
        gallery: gallery.count || 0,
        newContacts: contacts.count || 0,
        pendingPrayers: prayer.count || 0,
        subscribers: newsletter.count || 0,
        leaders: leadership.count || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/testimonials
router.get('/testimonials', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_testimonials').select('*').order('display_order');
    if (error) throw error;
    res.json({ testimonials: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/testimonials
router.post('/testimonials', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_testimonials').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ testimonial: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/testimonials/:id
router.put('/testimonials/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_testimonials')
      .update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ testimonial: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/testimonials/:id
router.delete('/testimonials/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_testimonials').delete().eq('id', req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/test-email', authenticate, requireAdmin, async (req, res) => {
  try {
    const { sendEmail } = require('../lib/email')
    const to = req.body.email || req.user.email
    if (!to) return res.status(400).json({ error: 'No email address provided' })

    await sendEmail({
      to,
      subject: 'MUTCU Website — Test Email ✓',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
            <h2 style="color:#FF9700;margin:0">MUTCU Website — Test Email</h2>
            <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px">Email configuration test</p>
          </div>
          <div style="padding:24px 32px;background:#fff">
            <p style="font-size:16px;color:#1a1a2e">✅ Your email configuration is working correctly!</p>
            <p style="color:#6B7280">This test email was sent from the MUTCU Website CMS admin panel by <strong>${req.user.name}</strong>.</p>
            <div style="margin-top:16px;padding:12px;background:#f5f7fa;border-radius:8px;font-size:12px;color:#6B7280">
              Sent to: ${to}<br/>Time: ${new Date().toLocaleString('en-GB')}<br/>Provider: Brevo
            </div>
          </div>
          <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
            MUTCU Website · mutcu.org · Inspire Love, Hope &amp; Godliness
          </div>
        </div>`,
    })
    res.json({ message: `Test email sent successfully to ${to}` })
  } catch (err) {
    console.error('[TEST EMAIL] Error:', err.message)
    res.status(500).json({ error: `Email failed: ${err.message}` })
  }
})

// POST /api/admin/newsletter/send — send newsletter to subscribers
router.post('/newsletter/send', authenticate, requireAdmin, async (req, res) => {
  try {
    const { subject, body, recipientIds } = req.body
    if (!subject || !body) return res.status(400).json({ error: 'Subject and body are required' })

    let query = supabase.from('website_newsletter').select('id,email').eq('is_active', true)
    if (recipientIds && recipientIds.length > 0) query = query.in('id', recipientIds)

    const { data: subscribers, error } = await query
    if (error) throw error
    if (!subscribers || subscribers.length === 0) return res.status(400).json({ error: 'No active subscribers found' })

    const { sendEmail } = require('../lib/email')
    let sent = 0, failed = 0

    for (const sub of subscribers) {
      try {
        await sendEmail({
          to: sub.email,
          subject,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
              <h2 style="color:#FF9700;margin:0;font-size:20px">MUTCU Newsletter</h2>
              <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px">Murang'a University of Technology Christian Union</p>
            </div>
            <div style="padding:24px 32px;background:#fff">
              <div style="color:#374151;font-size:14px;line-height:1.8">${body.replace(/\n/g, '<br/>')}</div>
            </div>
            <div style="background:#f5f7fa;padding:16px 32px;text-align:center">
              <a href="https://mutcu.org" style="color:#FF9700;font-size:13px;text-decoration:none">Visit mutcu.org</a>
              <span style="color:#9CA3AF;margin:0 8px">·</span>
              <a href="https://portal.mutcu.org" style="color:#FF9700;font-size:13px;text-decoration:none">Member Portal</a>
              <p style="color:#9CA3AF;font-size:11px;margin-top:8px">MUTCU · Inspire Love, Hope &amp; Godliness</p>
            </div>
          </div>`,
        })
        sent++
      } catch (e) {
        failed++
        console.error('[NEWSLETTER] Failed to send to', sub.email, e.message)
      }
      await new Promise(r => setTimeout(r, 100))
    }

    res.json({ message: `Newsletter sent: ${sent} delivered, ${failed} failed`, sent, failed, total: subscribers.length })
  } catch (err) {
    console.error('[NEWSLETTER SEND] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

    res.json({ message: `Test email sent to ${to}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;