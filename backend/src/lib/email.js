require('dotenv').config()

// ─── IMPORTANT: Read env vars inside functions, NOT at module load time ────────
// This ensures env vars set after module load (e.g. on Render) are always used.

function getConfig() {
  return {
    apiKey: process.env.BREVO_API_KEY,
    fromEmail: process.env.MAIL_FROM_EMAIL || 'noreply@mutcu.org',
    fromName: process.env.MAIL_FROM_NAME || 'MUTCU',
    replyTo: process.env.MAIL_REPLY_TO || 'mutcunion@gmail.com',
    adminEmail: process.env.ADMIN_EMAIL || 'mutcunion@gmail.com',
  }
}

// ─── Core send function ───────────────────────────────────────────────────────
async function sendEmail({ to, subject, html, replyTo, text }) {
  const cfg = getConfig()

  if (!cfg.apiKey) {
    const msg = '[EMAIL] BREVO_API_KEY is not set — email skipped. Set it in Render environment variables.'
    console.warn(msg)
    throw new Error('Email service not configured. BREVO_API_KEY is missing on the server.')
  }

  if (!cfg.fromEmail || cfg.fromEmail === 'noreply@mutcu.org') {
    console.warn('[EMAIL] MAIL_FROM_EMAIL not set, using default noreply@mutcu.org — make sure this is verified in Brevo.')
  }

  // Normalise recipient
  const toArray = Array.isArray(to)
    ? to.map(t => typeof t === 'string' ? { email: t } : t)
    : [{ email: to }]

  const payload = {
    sender: { name: cfg.fromName, email: cfg.fromEmail },
    to: toArray,
    replyTo: { email: replyTo || cfg.replyTo },
    subject,
    htmlContent: html,
  }
  if (text) payload.textContent = text

  console.log(`[EMAIL] Sending "${subject}" to ${toArray.map(t => t.email).join(', ')}`)

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': cfg.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await response.text()
  let responseData = {}
  try { responseData = JSON.parse(responseText) } catch {}

  if (!response.ok) {
    console.error('[EMAIL ERROR]', {
      status: response.status,
      statusText: response.statusText,
      body: responseData,
      to: toArray.map(t => t.email),
      subject,
    })

    // Provide specific, actionable error messages
    if (response.status === 401) {
      throw new Error('Email failed: Invalid BREVO_API_KEY. Check your Render environment variables.')
    }
    if (response.status === 400) {
      const detail = responseData.message || responseData.code || 'Bad request'
      if (detail.includes('sender') || detail.includes('from')) {
        throw new Error(`Email failed: Sender email "${cfg.fromEmail}" is not verified in Brevo. Go to Brevo → Senders & IPs → Verify your sender email.`)
      }
      throw new Error(`Email failed (400): ${detail}`)
    }
    if (response.status === 402) {
      throw new Error('Email failed: Brevo account limit reached. Check your Brevo plan.')
    }
    if (response.status === 429) {
      throw new Error('Email failed: Too many requests to Brevo. Please wait and try again.')
    }
    throw new Error(`Email failed (${response.status}): ${responseData.message || responseText}`)
  }

  console.log(`[EMAIL] ✓ Sent successfully to ${toArray.map(t => t.email).join(', ')}`)
  return responseData
}

// ─── Safe wrapper — logs error but does NOT throw (fire-and-forget) ───────────
async function sendEmailSafe(opts) {
  try {
    return await sendEmail(opts)
  } catch (err) {
    console.error('[EMAIL SAFE] Failed silently:', err.message)
    return null
  }
}

// ─── Diagnostic: test email config ───────────────────────────────────────────
async function testEmailConfig() {
  const cfg = getConfig()
  const issues = []

  if (!cfg.apiKey) issues.push('BREVO_API_KEY is not set')
  else if (cfg.apiKey === 'your-brevo-api-key-here') issues.push('BREVO_API_KEY is still the placeholder value')
  else if (cfg.apiKey.length < 20) issues.push('BREVO_API_KEY looks too short — may be invalid')

  if (!process.env.MAIL_FROM_EMAIL) issues.push('MAIL_FROM_EMAIL is not set (using default noreply@mutcu.org)')
  if (!process.env.ADMIN_EMAIL) issues.push('ADMIN_EMAIL is not set (using default mutcunion@gmail.com)')

  return {
    configured: issues.length === 0,
    issues,
    config: {
      hasApiKey: !!cfg.apiKey,
      apiKeyLength: cfg.apiKey?.length || 0,
      fromEmail: cfg.fromEmail,
      fromName: cfg.fromName,
      replyTo: cfg.replyTo,
      adminEmail: cfg.adminEmail,
    }
  }
}

// ─── Contact notification ─────────────────────────────────────────────────────
async function sendContactNotification({ name, email, subject, message }) {
  const cfg = getConfig()
  return sendEmailSafe({
    to: cfg.adminEmail,
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

// ─── Prayer notification ──────────────────────────────────────────────────────
async function sendPrayerNotification({ name, request }) {
  const cfg = getConfig()
  return sendEmailSafe({
    to: cfg.adminEmail,
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

// ─── Newsletter welcome ───────────────────────────────────────────────────────
async function sendNewsletterWelcome(email) {
  return sendEmailSafe({
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

module.exports = {
  sendEmail,
  sendEmailSafe,
  testEmailConfig,
  sendContactNotification,
  sendPrayerNotification,
  sendNewsletterWelcome,
}