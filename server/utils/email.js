const nodemailer = require('nodemailer')

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

async function sendMail({ to, subject, html }) {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn(`[email] SMTP not configured — skipping send to ${to}: ${subject}`)
    return
  }
  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}

exports.sendPasswordReset = (to, resetUrl) =>
  sendMail({
    to,
    subject: 'Reset your password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Reset your password</h2>
        <p>You requested a password reset. Click the button below — this link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">
          If you didn't request this, you can safely ignore this email.<br>
          Link: ${resetUrl}
        </p>
      </div>`,
  })

exports.sendPasswordChanged = (to) =>
  sendMail({
    to,
    subject: 'Your password was changed',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#7c3aed">Password changed</h2>
        <p>Your portfolio admin password was just changed.</p>
        <p>If this wasn't you, contact your hosting provider immediately and rotate your credentials.</p>
        <p style="color:#6b7280;font-size:13px">Time: ${new Date().toUTCString()}</p>
      </div>`,
  })
