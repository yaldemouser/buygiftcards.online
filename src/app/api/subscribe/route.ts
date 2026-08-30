import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { subscribeToKit } from "@/lib/newsletter";

const BodySchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    const email = parsed.data.email.trim().toLowerCase();

    // Save locally first — a signup should never be lost just because Kit
    // is unconfigured or briefly down.
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    let synced = false;
    try {
      const result = await subscribeToKit(email);
      synced = result.synced;
    } catch (err) {
      console.error("[/api/subscribe] Kit.com sync failed, subscriber still saved locally:", err);
    }

    await prisma.newsletterSubscriber.create({ data: { email, syncedToKit: synced } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/subscribe]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
