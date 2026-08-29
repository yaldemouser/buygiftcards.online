import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendSmtpMail } from "@/lib/smtp";

const BodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  orderNumber: z.string().max(60).optional(),
  message: z.string().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please fill in your name, a valid email, and a message." }, { status: 400 });
    }
    const { name, email, orderNumber, message } = parsed.data;
    const inbox = process.env.SUPPORT_INBOX_EMAIL || process.env.SMTP_USER;
    if (!inbox) {
      return NextResponse.json({ error: "Support inbox isn't configured yet." }, { status: 500 });
    }

    await sendSmtpMail({
      to: inbox,
      replyTo: email,
      subject: `Support request from ${name}${orderNumber ? ` (Order ${orderNumber})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;">
          <h2>New support request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${orderNumber ? `<p><strong>Order Number:</strong> ${escapeHtml(orderNumber)}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send";
    console.error("[/api/support]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
