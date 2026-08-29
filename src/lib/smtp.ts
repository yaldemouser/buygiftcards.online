import nodemailer from "nodemailer";

// Generic SMTP sender — configured for Zoho Mail by default (see
// .env.example) but works with any standard SMTP provider via the same env
// vars. Used for support-ticket notifications; order-confirmation emails
// still go through Resend's API (src/lib/email.ts) since that's already
// working — no reason to touch it.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null; // caller should handle: log + no-op, same pattern as email.ts
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Zoho: 465 = implicit TLS, 587 = STARTTLS
    auth: { user, pass },
  });
  return transporter;
}

export async function sendSmtpMail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const t = getTransporter();
  if (!t) {
    console.warn("[smtp] SMTP_HOST/SMTP_USER/SMTP_PASS not fully set — skipping send:", opts.subject);
    return { skipped: true };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  await t.sendMail({
    from,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
  });
  return { skipped: false };
}
