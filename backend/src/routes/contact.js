const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendContactNotification } = require('../lib/email');
const { generateContactReply } = require('../lib/gemini');
const { sendEmail } = require('../lib/email');

// POST /api/contact — public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return res.status(400).json({ error: 'Invalid email address' });

    const { data, error } = await supabase.from('website_contacts').insert({
      name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(),
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) throw error;

    sendContactNotification({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }).catch(() => {});

    // Send AI-generated auto-reply to the sender (non-blocking)
    ;(async () => {
      try {
        const aiReply = await generateContactReply(name.trim(), subject.trim(), message.trim())
        if (aiReply) {
          await sendEmail({
            to: email.trim(),
            subject: `Re: ${subject.trim()} — MUTCU`,
            replyTo: 'info@mutcu.org',
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
                  <h2 style="color:#FF9700;margin:0;font-size:18px">MUTCU — Message Received</h2>
                  <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px">Murang'a University of Technology Christian Union</p>
                </div>
                <div style="padding:24px 32px;background:#fff">
                  <p style="color:#1a1a2e;font-size:15px;line-height:1.7">${aiReply.replace(/\n/g, '<br/>')}</p>
                  <div style="margin-top:20px;padding:16px;background:#f5f7fa;border-left:4px solid #FF9700;border-radius:4px">
                    <p style="margin:0;font-size:12px;color:#6B7280"><strong>Your message:</strong> ${subject.trim()}</p>
                  </div>
                </div>
                <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
                  MUTCU Website · mutcu.org · Inspire Love, Hope &amp; Godliness
                </div>
              </div>`,
          })
        }
      } catch (e) {
        console.error('[AI] Contact auto-reply failed:', e.message)
      }
    })()

    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — admin
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('website_contacts').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ contacts: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/contact/:id/status (admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('website_contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ contact: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_contacts').delete().eq('id', req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;