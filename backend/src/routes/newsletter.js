const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendNewsletterWelcome } = require('../lib/email');

// POST /api/newsletter/subscribe — public
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return res.status(400).json({ error: 'Invalid email address' });

    const { data: existing } = await supabase.from('website_newsletter').select('id,is_active').eq('email', email.trim()).single();
    if (existing) {
      if (existing.is_active) return res.json({ message: 'You are already subscribed!' });
      // Reactivate
      await supabase.from('website_newsletter').update({ is_active: true }).eq('id', existing.id);
      return res.json({ message: 'Welcome back! Your subscription has been reactivated.' });
    }

    await supabase.from('website_newsletter').insert({ email: email.trim() });
    sendNewsletterWelcome(email.trim()).catch(() => {});
    res.status(201).json({ message: 'Successfully subscribed! Welcome to the MUTCU newsletter.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/newsletter/unsubscribe — public
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });
    await supabase.from('website_newsletter').update({ is_active: false }).eq('email', email.trim());
    res.json({ message: 'You have been unsubscribed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/newsletter — admin: all subscribers
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('website_newsletter')
      .select('*').order('subscribed_at', { ascending: false });
    if (error) throw error;
    res.json({ subscribers: data || [], total: data?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/newsletter/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await supabase.from('website_newsletter').delete().eq('id', req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;