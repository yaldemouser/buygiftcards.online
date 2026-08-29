import { Resend } from "resend";
import type { Order, OrderItem, GiftCardCode } from "@prisma/client";

type FullOrder = Order & { items: (OrderItem & { codes: GiftCardCode[] })[] };

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export async function sendOrderConfirmationEmail(order: FullOrder) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — skipping email for order ${order.orderNumber}`);
    return;
  }

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const orderUrl = `${siteUrl}/orders/${order.orderNumber}?email=${encodeURIComponent(order.customerEmail)}`;
  const hasDemoCodes = order.items.some((i) => i.codes.some((c) => c.isDemo));

  const itemsHtml = order.items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;">${item.brandName} × ${item.quantity}</td>
        <td style="padding:8px 0;text-align:right;">${fmt(item.denomCents * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const addressLines = [
    order.billingLine1,
    order.billingLine2,
    [order.billingCity, order.billingState, order.billingPostalCode].filter(Boolean).join(", "),
    order.billingCountry,
  ].filter(Boolean);

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="color:#0f8c66;">Order confirmed — ${order.orderNumber}</h2>
      ${hasDemoCodes ? `<p style="background:#fff3cd;padding:12px;border-radius:8px;color:#7a5b00;font-size:13px;">Demo mode: the codes on this order are randomly generated placeholders, not real redeemable gift cards.</p>` : ""}
      <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
      <table style="width:100%;border-collapse:collapse;margin-top:8px;border-top:1px solid #eee;">
        <tr><td style="padding:6px 0;color:#666;">Subtotal</td><td style="padding:6px 0;text-align:right;">${fmt(order.subtotalCents)}</td></tr>
        ${order.taxCents ? `<tr><td style="padding:6px 0;color:#666;">Tax</td><td style="padding:6px 0;text-align:right;">${fmt(order.taxCents)}</td></tr>` : ""}
        <tr><td style="padding:6px 0;font-weight:bold;">Total paid</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${fmt(order.totalCents)}</td></tr>
      </table>
      ${addressLines.length ? `<p style="color:#666;font-size:13px;margin-top:16px;">Billing address:<br>${addressLines.join("<br>")}</p>` : ""}
      <p style="margin-top:20px;"><a href="${orderUrl}" style="background:#0f8c66;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">View your gift card codes</a></p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "orders@buygiftcards.online",
    to: order.customerEmail,
    subject: `Your buygiftcards.online order ${order.orderNumber}`,
    html,
  });
}
