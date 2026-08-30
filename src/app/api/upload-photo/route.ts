import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// Uploads a customer's photo for a custom-photo gift card (currently: Visa
// only, see Brand.supportsCustomPhoto) to Vercel Blob and returns a public
// URL. This is purely cosmetic — it's rendered on our own virtual card
// mockup and order/email pages, never sent to Stripe or a card issuer.
//
// NOTE: there's no content moderation here. Before this is customer-facing
// at any real scale, add one (e.g. a moderation API pass on upload) —
// an unmoderated public image upload endpoint is a real operational risk
// (illegal content, abuse) that a v0 feature like this doesn't cover.
export async function POST(req: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Photo upload isn't configured yet." }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Please upload a JPEG, PNG, or WEBP image." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const pathname = `card-photos/${randomUUID()}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[/api/upload-photo]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
