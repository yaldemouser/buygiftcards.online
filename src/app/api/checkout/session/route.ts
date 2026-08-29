import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });

  // Fulfillment happens asynchronously via the Stripe webhook, so the order
  // may not exist yet the instant the customer lands on the success page.
  const order = await prisma.order.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
    select: { orderNumber: true, customerEmail: true, status: true },
  });

  if (!order) return NextResponse.json({ pending: true });
  return NextResponse.json({ pending: false, order });
}
