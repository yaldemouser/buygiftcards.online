import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getBrand, isValidDenomination } from "@/lib/brands";

const LineSchema = z.object({
  brandSlug: z.string(),
  amount: z.number().positive(),
  quantity: z.number().int().min(1).max(1000),
});
const BodySchema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  notes: z.string().max(2000).optional(),
  items: z.array(LineSchema).min(1).max(50),
});

// Corporate/bulk gift card requests use Stripe Invoicing rather than
// Checkout: a business asks for (e.g.) 500 cards for employee rewards, gets
// billed on terms instead of paying instantly. This endpoint only creates a
// DRAFT invoice — nothing is finalized or emailed to the customer here. A
// person reviews it in the Stripe Dashboard and sends it deliberately.
export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { companyName, contactName, email, phone, notes, items } = parsed.data;

    const resolvedItems: { brandSlug: string; brandName: string; denomCents: number; quantity: number }[] = [];
    for (const item of items) {
      const brand = getBrand(item.brandSlug);
      if (!brand) return NextResponse.json({ error: `Unknown brand: ${item.brandSlug}` }, { status: 400 });
      const amountCents = Math.round(item.amount * 100);
      if (!isValidDenomination(brand, amountCents)) {
        return NextResponse.json({ error: `Invalid amount for ${brand.name}` }, { status: 400 });
      }
      resolvedItems.push({ brandSlug: brand.slug, brandName: brand.name, denomCents: amountCents, quantity: item.quantity });
    }

    // Reuse an existing Stripe Customer for this email if one already
    // exists, instead of creating a duplicate every time they request a quote.
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data[0] ??
      (await stripe.customers.create({ email, name: contactName, metadata: { companyName } }));

    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: "send_invoice",
      days_until_due: 15,
      auto_advance: false, // stays a draft — never auto-finalizes or emails
      description: notes || undefined,
      metadata: { companyName, contactName, source: "business-bulk-request" },
    });

    for (const item of resolvedItems) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        currency: "usd",
        unit_amount: item.denomCents,
        quantity: item.quantity,
        description: `${item.brandName} gift card — $${(item.denomCents / 100).toFixed(2)} each`,
      });
    }

    const totalCents = resolvedItems.reduce((sum, i) => sum + i.denomCents * i.quantity, 0);

    const saved = await prisma.businessInvoiceRequest.create({
      data: {
        companyName,
        contactName,
        email,
        phone,
        notes,
        totalCents,
        stripeCustomerId: customer.id,
        stripeInvoiceId: invoice.id,
        items: { create: resolvedItems },
      },
    });

    return NextResponse.json({ requestId: saved.id, status: saved.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    console.error("[/api/business/quote]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
