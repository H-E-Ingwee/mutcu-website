const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendContactNotification } = require('../lib/email');

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