// Standalone Resend smoke test — separate from the app's real integration
// (src/lib/email.ts, used by the Stripe webhook for order confirmations).
// Run manually with: node scripts/test-resend-email.mjs
//
// Reads the key from RESEND_API_KEY (set in .env.local) instead of hardcoding
// it in source, so it never ends up committed to git by accident.

import { Resend } from "resend";
import { readFileSync } from "fs";

function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnvLocal();

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("RESEND_API_KEY is not set in .env.local");
  process.exit(1);
}

const resend = new Resend(apiKey);

const result = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: "ptlhumanresource@gmail.com",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});

console.log(result);
