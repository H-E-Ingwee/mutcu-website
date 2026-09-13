require('dotenv').config()

const BREVO_API_KEY = process.env.BREVO_API_KEY
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || 'noreply@mutcu.org'
const FROM_NAME = process.env.MAIL_FROM_NAME || 'MUTCU'
const REPLY_TO = process.env.MAIL_REPLY_TO || 'mutcunion@gmail.com'

async function sendEmail({ to, subject, html, replyTo }) {
  if (!BREVO_API_KEY) {
    console.warn('[EMAIL] BREVO_API_KEY not set — skipping email')
    return
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: Array.isArray(to) ? to : [{ email: to }],
      replyTo: { email: replyTo || REPLY_TO },
      subject,
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    console.error('[EMAIL ERROR]', err)
    throw new Error(err.message || `Email send failed: ${response.status}`)
  }

  return response.json()
}

async function sendContactNotification({ name, email, subject, message }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'mutcunion@gmail.com'
  return sendEmail({
    to: adminEmail,
    subject: `[MUTCU Website] New Contact: ${subject}`,
    replyTo: email,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
        <h2 style="color:#FF9700;margin:0">MUTCU Website — New Contact Message</h2>
      </div>
      <div style="padding:24px 32px;background:#fff">
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background:#f5f7fa;border-left:4px solid #FF9700;padding:16px;border-radius:4px;margin-top:12px">
          <p style="margin:0;white-space:pre-wrap">${message}</p>
        </div>
      </div>
      <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
        MUTCU Website · mutcu.org · Inspire Love, Hope &amp; Godliness
      </div>
    </div>`,
  })
}

async function sendPrayerNotification({ name, request }) {
  const adminEmail = process.env.ADMIN_EMAIL || 'mutcunion@gmail.com'
  return sendEmail({
    to: adminEmail,
    subject: `[MUTCU] New Prayer Request`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:24px 32px">
        <h2 style="color:#FF9700;margin:0">MUTCU — New Prayer Request</h2>
      </div>
      <div style="padding:24px 32px;background:#fff">
        <p><strong>From:</strong> ${name || 'Anonymous'}</p>
        <div style="background:#f5f7fa;border-left:4px solid #30D5C8;padding:16px;border-radius:4px;margin-top:12px">
          <p style="margin:0;white-space:pre-wrap">${request}</p>
        </div>
      </div>
      <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
        MUTCU Website · mutcu.org
      </div>
    </div>`,
  })
}

async function sendNewsletterWelcome(email) {
  return sendEmail({
    to: email,
    subject: 'Welcome to the MUTCU Newsletter!',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#04003D,#0a0060);padding:32px;text-align:center">
        <h1 style="color:#FF9700;margin:0;font-size:24px">Welcome to MUTCU!</h1>
        <p style="color:rgba(255,255,255,0.7);margin-top:8px;font-size:14px">Inspire Love, Hope &amp; Godliness</p>
      </div>
      <div style="padding:32px;background:#fff;text-align:center">
        <p style="font-size:16px;color:#1a1a2e">Thank you for subscribing to the MUTCU newsletter!</p>
        <p style="color:#6B7280">You will receive updates on services, events, devotionals, and ministry opportunities from Murang'a University of Technology Christian Union.</p>
        <a href="https://mutcu.org" style="display:inline-block;margin-top:16px;background:#FF9700;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Visit Our Website</a>
      </div>
      <div style="background:#f5f7fa;padding:12px 32px;text-align:center;font-size:11px;color:#9CA3AF">
        MUTCU Website · mutcu.org · Inspire Love, Hope &amp; Godliness
      </div>
    </div>`,
  })
}

module.exports = { sendEmail, sendContactNotification, sendPrayerNotification, sendNewsletterWelcome }