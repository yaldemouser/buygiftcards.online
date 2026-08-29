import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getBrand, isValidDenomination } from "@/lib/brands";

const CartItemSchema = z.object({
  brandSlug: z.string(),
  amount: z.number().positive(),
  qty: z.number().int().min(1).max(10),
  deliveryType: z.enum(["egift", "physical"]),
});
const BodySchema = z.object({
  items: z.array(CartItemSchema).min(1).max(20),
  // Generated once per checkout attempt on the client and reused on retry,
  // so a double-click or a flaky network retry can't create two Stripe
  // Checkout Sessions (and charge the card twice) for the same cart.
  idempotencyKey: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const line_items: Array<{
      price_data: {
        currency: string;
        product_data: { name: string; images?: string[]; metadata: Record<string, string> };
        unit_amount: number;
      };
      quantity: number;
    }> = [];

    // Every line item is re-priced from the server-side catalog. The client
    // cart is a convenience UI — it is never trusted for what gets charged.
    for (const item of parsed.data.items) {
      const brand = getBrand(item.brandSlug);
      if (!brand) return NextResponse.json({ error: `Unknown brand: ${item.brandSlug}` }, { status: 400 });
      if (brand.type !== "both" && brand.type !== item.deliveryType) {
        return NextResponse.json({ error: `${brand.name} does not support ${item.deliveryType} delivery` }, { status: 400 });
      }
      const amountCents = Math.round(item.amount * 100);
      if (!isValidDenomination(brand, amountCents)) {
        return NextResponse.json({ error: `Invalid amount for ${brand.name}` }, { status: 400 });
      }
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${brand.name} ${item.deliveryType === "egift" ? "eGift" : "Physical"} Card — $${item.amount}`,
            metadata: { brandSlug: brand.slug, amount: String(item.amount), deliveryType: item.deliveryType },
          },
          unit_amount: amountCents,
        },
        quantity: item.qty,
      });
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items,
        success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/catalog`,
        customer_creation: "always",
        // Stripe Tax: needs a customer address to know which jurisdiction to
        // calculate for, hence requiring billing address collection here.
        // NOTE: you still need to (1) add tax registrations for every state
        // you're collecting tax in at dashboard.stripe.com/settings/tax, and
        // (2) confirm the right product tax category for gift cards there —
        // don't guess a tax code in code for something with real tax/legal
        // consequences. Until registrations exist, Stripe will calculate $0
        // tax rather than fail, so this is safe to ship ahead of that setup.
        automatic_tax: { enabled: true },
        billing_address_collection: "required",
        metadata: {
          cart: JSON.stringify(
            parsed.data.items.map((i) => ({ s: i.brandSlug, a: i.amount, q: i.qty, d: i.deliveryType }))
          ),
        },
      },
      parsed.data.idempotencyKey ? { idempotencyKey: parsed.data.idempotencyKey } : undefined
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Stripe auth errors, network errors, etc. — always return JSON so the
    // client's res.json() never chokes on an empty/HTML error body.
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("[/api/checkout]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
