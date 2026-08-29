import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Schema = z.object({ orderNumber: z.string().min(3), email: z.string().email() });

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid order number and email" }, { status: 400 });

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: parsed.data.orderNumber.trim(),
      customerEmail: { equals: parsed.data.email.trim(), mode: "insensitive" },
    },
    include: { items: { include: { codes: true } } },
  });

  if (!order) return NextResponse.json({ error: "No matching order found" }, { status: 404 });
  return NextResponse.json({ order });
}
