// Fetches your Tango Card catalog and prints it next to our own brand
// slugs, so you can populate BRAND_TO_TANGO_UTID in
// src/lib/giftcard-provider.ts by hand.
//
// Run with: node scripts/fetch-tango-catalog.mjs
// Requires TANGO_PLATFORM_NAME / TANGO_PLATFORM_KEY / TANGO_API_BASE_URL
// in .env.local.
//
// Deliberately prints only utid / brand name / face value — not Tango's
// disclaimers, descriptions, or redemption-instructions HTML that also come
// back in the response. We don't need that copy (we already write our own
// brand descriptions in src/lib/brands.ts) and shouldn't be pulling a
// third party's marketing/legal text into this codebase.

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

const baseUrl = process.env.TANGO_API_BASE_URL || "https://integration-api.tangocard.com/raas/v2";
const platformName = process.env.TANGO_PLATFORM_NAME;
const platformKey = process.env.TANGO_PLATFORM_KEY;

if (!platformName || !platformKey) {
  console.error("Set TANGO_PLATFORM_NAME and TANGO_PLATFORM_KEY in .env.local first.");
  process.exit(1);
}

const auth = Buffer.from(`${platformName}:${platformKey}`).toString("base64");

const res = await fetch(`${baseUrl}/catalogs`, {
  headers: { Authorization: `Basic ${auth}` },
});

if (!res.ok) {
  console.error(`Catalog fetch failed (${res.status}):`, await res.text());
  process.exit(1);
}

const data = await res.json();

// Actual shape: { catalogName, brands: [ { brandName, items: [ { utid, faceValue, valueType } ] } ] }
if (!Array.isArray(data?.brands)) {
  console.log("Unexpected response shape, printing raw top-level keys:", Object.keys(data ?? {}));
  process.exit(0);
}

console.log(`Catalog: ${data.catalogName} — ${data.brands.length} brands\n`);

const sorted = [...data.brands].sort((a, b) => a.brandName.localeCompare(b.brandName));
for (const brand of sorted) {
  const items = (brand.items ?? [])
    .filter((i) => i.status === "active")
    .map((i) => (i.valueType === "FIXED_VALUE" ? `$${i.faceValue}` : "variable"))
    .join(", ");
  const utids = (brand.items ?? [])
    .filter((i) => i.status === "active")
    .map((i) => i.utid)
    .join(", ");
  console.log(`${brand.brandName}`);
  console.log(`  denominations: ${items || "(none active)"}`);
  console.log(`  utids: ${utids || "(none)"}`);
}

console.log(`\nMatch these brandName values against src/lib/brands.ts and add the right utid(s) to BRAND_TO_TANGO_UTID.`);
